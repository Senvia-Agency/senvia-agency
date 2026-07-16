# Auditoria Completa — `Senvia/senvia-agency`

**Data:** 2026-07-16
**Aprovado por:** utilizador (scope = Completo; abordagem = A — 5 pistas paralelas)
**Status:** Spec pronto para revisão

---

## 1. Contexto do projeto

O repo `Senvia/senvia-agency` é um monorepo informal que contém **3 superfícies distintas**, não uma:

| Superfície | Localização | Stack | Tamanho | Notas |
|---|---|---|---|---|
| **S1. Site marketing público** | `src/`, `public/` | Astro 5 estático + MDX + Sitemap | 67 ficheiros, 11 páginas `.astro`, 36 artigos MD | Deploy em `senvia-agency.vercel.app`, mas `astro.config` aponta para `https://www.senvia.pt` |
| **S2. Admin dashboard** | `sites/app/` | React + Vite + shadcn-ui | 379 ficheiros TSX/TS | CRM/financeiro/vendas/leads/Stripe/Google Calendar |
| **S3. Segundo blog** | `sites/blog/` | Estático (imagens duplicadas) | 25 ficheiros | Apresenta imagens de artigos duplicadas |

**Backend:** 17 Supabase Edge Functions (`supabase/functions/`) + 80+ migrations SQL (`supabase/migrations/`).

**Build/Deploy:** `bun run build` → `dist/` → Vercel (framework=astro).

### 1.1 Red flags já identificados no reconhecimento

| # | Categoria | Severidade preliminar | Finding |
|---|---|---|---|
| R1 | Segurança | **Crítica** | `.env` foi comitado em `cf7f768` (2025-10-23) — Supabase URL + anon key presentes no histórico do git |
| R2 | Organização | Alta | 3 subprojetos no mesmo repo sem monorepo tooling (turbo/pnpm workspaces); `sites/app` parece não integrar no build Vercel |
| R3 | Manutenção | Alta | `README.md` é boilerplate do Lovable, descreve stack errada (Vite/React/shadcn) em vez de Astro |
| R4 | Build | Média | Dois lockfiles: `bun.lock` + `package-lock.json` — gestor de pacotes ambíguo |
| R5 | Config | Média | `astro.config.mjs` tem `vite.server.fs.allow: ['..']` — permite leitura de diretório pai em dev |
| R6 | Manutenção | Baixa | `.gitignore` minimalista (sem `.DS_Store`, IDE, `.vercel/` está faltando como padrão defensivo) |
| R7 | Conformidade | A confirmar | `AdSense.astro` + `ConsentBanner.astro` presentes — verificar conformidade RGPD real |
| R8 | SEO | A confirmar | Sitemap existe (`@astrojs/sitemap`), mas `vercel.json` faz redirect `/sitemap.xml` → `/sitemap-index.xml` — verificar se ambos servem corretamente |

> Estes red flags serão validados/estendidos pelas pistas. Não substituem o trabalho das pistas.

---

## 2. Objetivo

Entregar um **relatório único, priorizado e acionável** que responda a:

1. O site público está visualmente correto, performante, acessível e bem indexado?
2. O código (3 superfícies) é seguro, mantível e segue boas práticas da stack?
3. Há riscos legais (RGPD/cookies) ou de segurança (secrets/dependências) que exijam ação imediata?
4. Quais são as **top 10 correções por impacto/esforço**?

---

## 3. Scope

### 3.1 Incluído

- **S1 (Astro marketing)** — auditoria completa: site ao vivo + código
- **S2 (React admin)** — auditoria de código apenas (sem acesso ao runtime; sem Credenciais Supabase válidas)
- **S3 (Segundo blog)** — auditoria breve: confirmação se está em uso ou morto
- **Supabase configs** — auditoria estática dos Edge Functions e migrations
- **Build/Deploy** — `vercel.json`, `astro.config.mjs`, lockfiles, `.env`, `.gitignore`
- **Histórico git** — verificação de leaks de secrets

### 3.2 Excluído

- Auditoria ao vivo do Supabase (sem credenciais de service_role válidas)
- Auditoria de contas Google/AdSense/Stripe (sem acesso)
- DNS do domínio `senvia.pt` (foco no deploy Vercel)
- **Pen-test ativo ou exploits reais** — auditoria passiva apenas
- Análise legal formal de RGPD (não é consultoria jurídica; apenas checklist técnico)

---

## 4. Abordagem: 5 pistas paralelas

Cinco agentes especializados correm em paralelo. Cada um entrega um relatório Markdown estruturado. Sisyphus sintetiza num relatório único.

### P1 — Site ao vivo (visual + performance)

- **Agente:** `visual-engineering` + skill `frontend`
- **URL alvo:** `https://senvia-agency.vercel.app`
- **Ferramentas:** Playwright (screenshots desktop+mobile, navegação), Lighthouse (4 dimensões: performance, SEO, acessibilidade, best-practices)
- **O que verifica:**
  - Páginas carregam sem erros 4xx/5xx
  - Layout responsive (375px, 768px, 1280px, 1920px)
  - LCP, CLS, INP, FCP, TTFB (Core Web Vitals)
  - Links internos não quebrados (crawler superficial — 50 URLs)
  - Imagens com `alt` e lazy-loading
  - 404 funcional
  - Contraste de cor mínimo AA
  - Navegação por teclado básica (tab order, focus visível)
- **Entrega:** `p1-site-ao-vivo.md` — screenshots + métricas Lighthouse + lista de issues visuais

### P2 — Código Astro/TS (S1)

- **Agente:** `unspecified-high` + skill `programming`
- **Foco:** `src/` apenas
- **O que verifica:**
  - Padrões Astro 5 (content collections, layouts, islands)
  - Type-safety (sem `as any`, sem `@ts-ignore`)
  - Componentização: `Header`, `Footer`, `SEO`, `CTASection`, `ConsentBanner` — coesão e reuso
  - Configuração `content.config.ts` (schema dos artigos)
  - Componente `SEO.astro` — meta tags, Open Graph, Twitter cards, canonical
  - RSS (`blog/rss.xml.ts`) — formato válido, encoding, últimos 20 itens
  - 36 artigos MD — amostragem estratificada de 5 (uma por categoria) para validar frontmatter consistente
  - **Boundary com P4:** P2 audita a *implementação* do componente `SEO.astro`; P4 audita a *correção SEO* dos valores preenchidos
  - `astro.config.mjs` — `prefetchAll: true` pode pesar bundle; revisar
  - Duplicação entre `Header.astro`/`Footer.astro` e `BlogHeader.astro`/`BlogFooter.astro`
- **Entrega:** `p2-codigo-astro.md` — lista de code smells + recomendações por prioridade

### P3 — Segurança (secrets + deps + edge functions)

- **Agente:** `unspecified-high` + skill `security-review`
- **O que verifica:**
  - **R1 (crítico):** Confirmar leak `.env` em `cf7f768`; identificar exatamente que valores estão expostos; recomendar rotação de chaves
  - `git log -p --all -- '.env'` para ver conteúdo histórico
  - Verificar outros ficheiros com padrões secret (`ghs_`, `sk_live_`, `eyJ`, `SUPABASE_`, `STRIPE_`)
  - `npm audit` / `bun audit` para CVEs conhecidos nas deps
  - 17 Supabase Edge Functions — CORS, validação de input, auth do webhook, segredos hardcoded
  - 80+ migrations SQL — RLS (Row Level Security) ativa em tabelas sensíveis (clients, leads, vendas, financeiro)
  - `astro.config.mjs` `vite.server.fs.allow: ['..']` — risco em dev
  - Headers HTTP no `vercel.json` — confirmar HSTS ausente (potencial gap)
- **Entrega:** `p3-seguranca.md` — issues classificados por severidade (Crítica/Alta/Média/Baixa) + recomendações

### P4 — SEO & Conteúdo

- **Agente:** `unspecified-high`
- **O que verifica:**
  - `public/robots.txt` — permite indexação correta
  - `public/ads.txt` — válido para AdSense
  - Sitemap `/sitemap-index.xml` — número de URLs, última modificação
  - 11 páginas `.astro` — title, meta description, canonical, Open Graph, Twitter
  - 36 artigos — amostragem de 10: estrutura H1/H2/H3, keyword, meta description, internal linking
  - `hreflang`/`lang="pt-PT"` consistente (i18n declarado no sitemap)
  - Estrutura de URLs (trailing slash, hífens, lowercase)
  - Duplicação: existe `sites/blog/` com imagens duplicadas — risco de conteúdo canibal?
  - Performance de imagens: `public/images/` vs `public/lovable-uploads/` — otimização (WebP/AVIF)?
- **Entrega:** `p4-seo-conteudo.md` — checklist SEO técnico + oportunidades de conteúdo

### P5 — Build / Deploy / Organização

- **Agente:** `quick`
- **O que verifica:**
  - `bun run build` corre sem erros (simulação local)
  - `astro check` passa sem type errors
  - `vercel.json` — build command, output directory, redirects, headers (todos válidos?)
  - **R4:** Dois lockfiles — qual é a fonte de verdade? Recomendação
  - **R3:** README — reescrever para refletir stack real
  - **R2:** `sites/app/` e `sites/blog/` — participam no build Vercel? Se não, deviam ser submódulos ou removidos?
  - `.lovable/plan.md` — ainda relevante ou lixo histórico?
  - `.vite/deps/` — devia estar gitignored?
  - **R6:** `.gitignore` — completude (adicionar `.DS_Store`, `*.log`, `.idea/`, `.vscode/`, `coverage/`)
  - Node/Bun versions — `engines` ausente em `package.json`
- **Entrega:** `p5-build-deploy.md` — checklist de housekeeping + comandos concretos

---

## 5. Entregável final

Sisyphus sintetiza os 5 relatórios num único documento:

**`docs/auditoria/2026-07-16-relatorio-completo.md`** com:

1. **Sumário executivo** (1 página) — score geral, top 3 riscos, top 3 quick wins
2. **Red flags críticos** (ação imediata) — ex.: rodar chave Supabase, remover `.env` do histórico
3. **Relatório por pista** (5 secções) — cada uma com tabela de issues `[Severidade] [Esforço] [Descrição] [Como corrigir]`
4. **Top 10 recomendações priorizadas** (matriz impacto × esforço)
5. **Apêndices** — screenshots, métricas Lighthouse, lista de dependências vulneráveis

Critério de severidade:

| Nível | Definição |
|---|---|
| **Crítica** | Risco de segurança ativo, secret leaked, site em baixo, perda de dados |
| **Alta** | Funcionalidade quebrada, SEO/UX gravemente comprometido, bloqueador de manutenção |
| **Média** | Code smell recorrente, performance degradada, risco futuro |
| **Baixa** | Polimento, nitpicks, boas práticas defensivas |

Critério de esforço: `XS` (<15 min), `S` (<1h), `M` (<4h), `L` (<1 dia), `XL` (>1 dia).

---

## 6. Critérios de aceitação (definition of done)

A auditoria está completa quando:

- [ ] Os 5 relatórios de pista estão escritos em `docs/auditoria/`
- [ ] P1 inclui métricas Lighthouse reais (não estimadas) para mobile + desktop
- [ ] P3 confirma ou refuta R1 (leak do `.env`) com evidência do `git log -p`
- [ ] Relatório final contém top 10 recomendações priorizadas
- [ ] Cada issue tem severidade, esforço e comando/ação de correção
- [ ] Não há placeholders, TODOs ou "a confirmar" no relatório final

---

## 7. Riscos e limitações

| Risco | Mitigação |
|---|---|
| `sites/app/` (admin) pode estar fora do build Vercel → achados irrelevantes | P5 confirma se participa no build; se não, auditoria é estática (código apenas) |
| Lighthouse ao vivo reflete cache Vercel/CDN, não primeira visita | Correr Lighthouse em modo "no throttling, clear cache" + relatar metodologia |
| Secrets no histórico podem já ter sido rodados | Recomendação sempre inclui "rodar a chave", não só "remover do histórico" |
| 36 artigos não serão lidos integralmente | Amostragem estatística: 10 para SEO, 5 para padrões de frontmatter |
| Não temos Credenciais Supabase service_role | RLS será auditado pelas migrations, não por teste ao vivo |

---

## 8. Orçamento e duração estimada

| Pista | Agente | Duração estimada |
|---|---|---|
| P1 site ao vivo | visual-engineering (Playwright+Lighthouse) | 8-12 min |
| P2 código Astro | unspecified-high | 6-10 min |
| P3 segurança | unspecified-high + security-review | 10-15 min |
| P4 SEO/conteúdo | unspecified-high | 6-10 min |
| P5 build/deploy | quick | 4-6 min |
| **Síntese Sisyphus** | (eu próprio) | 5-8 min |

**Total wall-clock:** ~20-30 min (paralelo) + síntese.

---

## 9. Próximos passos (pós-aprovação do spec)

1. Sisyphus invoca `writing-plans` para converter este spec num plano de execução detalhado
2. Sisyphus despacha os 5 agentes em paralelo (background)
3. À medida que cada agente termina, Sisyphus recolhe e integra
4. Sisyphus escreve relatório final e pede revisão ao utilizador
5. Implementação de fixes é **outro pedido** — esta auditoria não altera código
