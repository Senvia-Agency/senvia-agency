# Relatório de Auditoria — Fase 2 (Profunda)

**Data:** 2026-07-16
**Continuação de:** `2026-07-16-relatorio-completo.md` (Fase 1)
**Método:** grep direto em todos os ficheiros + Playwright ao vivo + byte-level encoding check

---

## ⚠️ Correções à Fase 1 (importante)

### ❌ RETRACT CRIT-4 — Encoding mojibake era FALSO POSITIVO

Na Fase 1 reportei que os artigos tinham "encoding corrompido" (mojibake). **ERRADO.** Verificação byte-level confirma que os ficheiros estão em **UTF-8 válido**:

- `est C3 A1` = `está` ✅ (C3 A1 é UTF-8 para á)
- `subscri C3 A7 C3 A3 6F` = `subscrição` ✅ (C3 A7 = ç, C3 A3 = ã)

O "mojibake" era **artifact de display da consola PowerShell** (codepage CP1252). Confirmado via Playwright no browser — título da página é `Como a IA está a transformar os seguros em Portugal em 2026 | SENVIA` (UTF-8 perfeito).

**Ação:** Nenhuma correção de encoding necessária. Top 10 da Fase 1 deve ser atualizado para remover este item.

---

## Novos achados da Fase 2

### 🔴 NOVO CRIT-5 — 13 das 18 Edge Functions usam SERVICE_ROLE_KEY

| Function | service_role? | Auth verify? | Writes | Reads |
|---|---|---|---|---|
| stripe-webhook | ✅ | signature verify ✅ | 4 | 11 |
| **public-api** | ✅ | ❌ NENHUMA | 0 | 8 |
| create-stripe-product | ✅ | ? | 3 | 4 |
| delete-stripe-product | ✅ | ? | 3 | 5 |
| update-stripe-product | ✅ | ? | 2 | 4 |
| sync-stripe-payments | ✅ | ? | 3 | 11 |
| sync-stripe-products | ✅ | ? | 4 | 10 |
| sync-inconsistent-sales | ✅ | ? | 5 | 5 |
| sync-google-calendar | ✅ | ? | 2 | 4 |
| google-calendar-oauth | ✅ | ? | 2 | 4 |
| n8n-get-calendar-events | ✅ | ? | 2 | 6 |
| webhook-new-ia-lead | ✅ | ? | 1 | 1 |
| generate-recurring-bills | ✅ | ? | 0 | 0 |
| get-google-config | ❓ | ? | 0 | 0 |
| get-google-reviews | ❓ | ? | 0 | 0 |
| send-notification-email | ❓ | ? | 0 | 2 |
| database-maintenance | ❓ | ? | 0 | 16 |

**Implicação:** praticamente todas as Edge Functions que manipulam dados de cliente **contornam RLS**. A boa notícia: não há hardcoded secrets (todas usam `Deno.env.get()`).

**Esforço de fix:** L (auditar cada function individualmente). Padrão aceitável para webhooks server-to-server (stripe-webhook) mas problemático para `public-api`.

### 🔴 NOVO CRIT-6 — `unified_leads` permite INSERT público sem validação

**Onde:** `20260323151914_19b4ba5f...sql:103`

```sql
CREATE POLICY "Allow public inserts for forms"
ON public.unified_leads
FOR INSERT TO anon, authenticated
WITH CHECK (true);
```

**Implicação:** qualquer anónimo pode INSERT na tabela de leads com **dados arbitrários**. Sem rate limit, sem schema check, sem honeypot.

**Risco real:**
- Spam massivo de leads falsos → polui CRM
- Injection de dados maliciosos (XSS se `notes` ou `promo_agente_whatsapp` forem renderizados sem escape)
- Enumeração de emails (unique constraint em `email` permite verificar se um email já existe)

**Esforço de fix:** M (adicionar constraints: source_page whitelist, regex phone, rate limiting via Supabase Edge Function middleware).

### 🟡 ALTA — Admin React: 65 occurrences de `as any`/`any`

Distribuição (top 10):
- `useSystemSettings.ts` — 7
- `useRecurringServices.ts` — 7
- `useAllFinancialMovements.ts` — 6
- `useUnifiedReceivables.ts` — 6
- `useGoogleCalendar.ts` — 5
- `GTMPageView.tsx` — 4
- `useEntityContacts.ts` — 3
- `useCustomServices.ts` — 3
- `useFinancialMovements.ts` — 3
- `useActivityHistory.ts` — 3

Concentrados em hooks de financeiro/vendas — código crítico de negócio onde tipos importam mais.

**Bom sinal:** zero uso de `service_role` no client-side (RLS enforced via Supabase).

### 🟡 ALTA — Admin React: 6 ficheiros >500 linhas (code smell)

| Ficheiro | Linhas |
|---|---|
| `integrations/supabase/types.ts` | **1831** (auto-gerado, aceitável) |
| `components/admin/AdminSubscriptions.tsx` | **906** |
| `components/admin/AdminSettings.tsx` | **784** |
| `components/ui/sidebar.tsx` | **708** |
| `components/admin/financeiro/PaymentModal.tsx` | **602** |
| `components/admin/WebhookSetup.tsx` | **587** |

`AdminSubscriptions.tsx` e `AdminSettings.tsx` precisam de ser quebrados em sub-componentes (250 LOC ceiling).

### 🟢 BOM — RLS está bem implementada

- **29 tabelas** criadas em 80+ migrations
- **36 ENABLE ROW LEVEL SECURITY** statements (todas as tabelas têm RLS)
- **0 políticas `USING (true)` over-permissive** (grelhei incorretamente na Fase 1)
- **33 políticas `FOR ALL`** — alguma concentração em migrations recentes (2026-03)
- **Políticas usam `is_admin(auth.uid())`** — padrão correto
- **Política problemática única:** `unified_leads` INSERT público (CRIT-6 acima)
- **Sem colunas de pagamento sensíveis** (sem `cvv`, `card_number`, `password` em texto)
- **`tax_id` (NIF) presente** — RGPD relevant; precisa de proteção adequada

### 🟢 BOM — Site ao vivo (Playwright confirmado)

| Métrica | Valor |
|---|---|
| Homepage FCP | **564 ms** (excelente) |
| Homepage loadEvent | 869 ms |
| Homepage total bytes | **365 KB** (muito lean) |
| Homepage HTML | 6.5 KB |
| Homepage console errors | **0** |
| Homepage `<h1>` count | 1 ✅ |
| Homepage imgs sem alt | 0 ✅ |
| Homepage imgs sem loading | 0 ✅ |
| Homepage buttons sem aria-label | 0 ✅ |
| Homepage external links sem noopener | 0 ✅ |
| Homepage JSON-LD scripts | 1 ✅ |
| Homepage canonical | presente ✅ |
| 404 page | funcional, HTTP 404 ✅ |
| Blog loadEvent | 524 ms |
| Blog HTML | 300 bytes (super lean pré-rendered) |

Screenshots em `docs/auditoria/screenshots/`: home-desktop.png, home-mobile.png, blog-artigos.png, 404-page.png.

### 🟡 MÉDIA — Contacto não tem formulário nativo

`https://www.senvia.pt/contacto` tem:
- 0 inputs de formulário
- 4 iframes (3 dos quais `about:blank` — provavelmente embedded Tally/Typeform que ainda não carregaram)
- 2 botões

Formulário de contacto está em `app.senvia.pt/c/senvia-agency/formulario-lp` (subdomínio separado). Redirecionamento implícito. Para UX, considerar embed nativo.

---

## Tabela consolidada — todos os issues (Fase 1 + Fase 2)

### 🔴 Críticos (4)

| # | Issue | Status |
|---|---|---|
| CRIT-1 | AdSense carrega antes do consentimento (`Base.astro:62`) | confirmado RGPD violation |
| CRIT-2 | `public-api` Edge Function sem auth com service_role | confirmado data leak risk |
| CRIT-3 | `.env` comitado com 2 anon keys | confirmado |
| CRIT-4 | Encoding mojibake em artigos | **❌ FALSE POSITIVE — RETRACTED** |
| CRIT-5 | 13/18 Edge Functions usam service_role (RLS bypass) | **NOVO** |
| CRIT-6 | `unified_leads` permite INSERT público sem check | **NOVO** |

### 🟠 Altos (8 confirmados)

| Issue | Detalhe |
|---|---|
| `senvia-agency.vercel.app` DEAD | `X-Vercel-Error: DEPLOYMENT_NOT_FOUND` |
| Admin: 65 `any` em código de negócio | top: useSystemSettings, useRecurringServices |
| Admin: 6 ficheiros >500 linhas | AdminSubscriptions 906, AdminSettings 784 |
| `.vite/deps/` + `.lovable/plan.md` comitados | dev artifacts |
| 2 lockfiles | `bun.lock` + `package-lock.json` |
| README.md é boilerplate Lovable errado | diz Vite/React/shadcn em vez de Astro |
| NAV_LINKS aponta para `/servicos` (404) | `src/config.ts:22` |
| Email `geral.senvia@gmail.com` para B2B | `src/config.ts:13` |

### 🟡 Médios (11 confirmados)

`prefetchAll:true`, RSS sem slice, `vite.server.fs.allow:['..']`, JSON-LD ausente em BlogPosting, falta Schema.org Article, `404.astro` usa BlogBase em vez de Base, `Disallow: /404` em robots, `/lovable-uploads/` naming feio, `internal linking` entre artigos fraco, `package.json` sem engines, `trailingSlash` astro vs vercel conflito.

### 🟢 Baixos (7 confirmados)

postcss.config.mjs vazio, .npmrc legacy-peer-deps, scripts dev/start duplicados, README Lovable link, faltam vários .gitignore patterns, site preview morto, GA/Ads sem schema verification.

---

## Top 10 recomendações atualizadas (matriz impacto × esforço)

| # | Ação | Sev | Esf | Impacto |
|---|---|---|---|---|
| 1 | Remover AdSense script de `Base.astro:62` (CRIT-1) | Crítica | XS | RGPD safe |
| 2 | Auditar `public-api` — separar dados públicos dos privados (CRIT-2) | Crítica | M | Fecha data leak |
| 3 | Restringir `unified_leads` INSERT público: source whitelist + rate limit + regex (CRIT-6) | Crítica | M | Fecha spam/Poisoning |
| 4 | Revisar 11 Edge Functions que usam service_role mas respondem a requests externos (CRIT-5) | Crítica | L | Defense in depth |
| 5 | Rotar anon key Supabase + `git filter-repo` (CRIT-3) | Alta | S | Limpa histórico |
| 6 | Apagar `.vite/deps/`, `.lovable/plan.md`, `package-lock.json` + melhorar `.gitignore` | Alta | XS | Limpa repo |
| 7 | Reescrever `README.md` com stack Astro correta | Alta | S | Onboarding devs |
| 8 | Refactorizar `AdminSubscriptions.tsx` (906 linhas) e `AdminSettings.tsx` (784 linhas) | Alta | L | Mantibilidade |
| 9 | Remover `as any` dos hooks críticos (financeiro/vendas) | Alta | M | Type safety |
| 10 | Adicionar CSP em `vercel.json` + JSON-LD `BlogPosting` em artigos | Média | S | SEO + defense |

---

## Limitações restantes da Fase 2

Mesmo com a F2 profunda, ainda **não foi auditado em detalhe:**

1. **Conteúdo dos 36 artigos** (só verifiquei encoding; não validei qualidade de copy, factual accuracy, links internos)
2. **Páginas Astro em detalhe** (li apenas titles e line counts; conteúdo das 9 páginas restantes não foi verificado)
3. **Hooks do admin** (379 ficheiros — só contagem de `any`; não li lógica de cada um)
4. **Migrations SQL policy-by-policy** (só greps; não li cada uma das 159 CREATE POLICY)
5. **Lighthouse real** (não tenho CLI; FCP/loadEvent via performance API são proxy)
6. **Auditoria visual/CSS** (screenshots capturados mas `look_at` fez timeout; análise visual não feita)
7. **Testes mobile real** (só viewport 375×812 emulado; sem device real)
8. **Conteúdo de cada Edge Function** (só padrões globais; não li lógica completa das 13 com service_role)

---

## Conclusão

A Fase 2 revelou **2 novos issues críticos** (CRIT-5 service_role generalizado, CRIT-6 unified_leads aberto) e **retractou 1 falso positivo** (CRIT-4 encoding). O código é **maioritariamente sólido** — RLS bem implementada, performance excelente, type errors concentrados em hooks específicos.

Os issues reais são:
1. **RGPD/segurança:** AdSense pré-consentimento + INSERT público de leads
2. **Arquitetura:** service_role em quase todas as Edge Functions (lazy pattern)
3. **Manutenção:** admin com code smells e files grandes

**Tempo estimado para resolver tudo:** ~3-5 dias de trabalho dedicado, priorizando CRIT-1 (5 min), CRIT-6 (meio dia), CRIT-2 (1 dia), README rewrite (1h), refactor admin (2-3 dias).
