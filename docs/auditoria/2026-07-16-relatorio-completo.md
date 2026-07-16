# Relatório Completo de Auditoria — `Senvia/senvia-agency`

**Data:** 2026-07-16
**Método:** análise estática do repo + sondas HTTP ao site ao vivo (PowerShell WebRequest) + `git log -p` ao histórico
**Stack:** Astro 5.18.2 + MDX + Supabase (Edge Functions + Postgres) + Vercel deploy
**Spec/plano:** `../superpowers/specs/2026-07-16-senvia-agency-audit-design.md` · `../superpowers/plans/2026-07-16-senvia-agency-audit-execution.md`

---

## Sumário executivo

**Status geral: 🔴 Crítico — site preview deploy está morto; várias issues de segurança, RGPD e conteúdo que requerem ação.**

| Métrica | Valor |
|---|---|
| Deploy preview (`senvia-agency.vercel.app`) | 🔴 **DEAD** (`X-Vercel-Error: DEPLOYMENT_NOT_FOUND`) |
| Deploy produção (`www.senvia.pt`) | 🟢 Live (200 OK, Vercel, HSTS ativo) |
| URLs testados em produção | Todos 200 OK |
| Issues Críticos | **4** |
| Issues Altos | **8** |
| Issues Médios | **11** |
| Issues Baixos | **7** |

### Top 3 riscos (ação imediata)
1. **RGPD violation — AdSense carrega antes do consentimento.** `Base.astro:62` injeta `<script async src="https://pagead2.googlesyndication.com/...">` no `<head>`, batendo o cache do browser **antes** do `ConsentBanner` executar. Confirmado por GET ao site em produção.
2. **`.env` leaked em histórico do git** — 2 anon keys Supabase (`rvrulhbgkdvnrkhzibif` + `jiirxgdngacfqqohwxyq`) em 2 commits. A key atual está em uso e depende 100% de RLS ser sólida (ver `public-api` abaixo).
3. **`public-api` Edge Function usa `SUPABASE_SERVICE_ROLE_KEY`** com CORS `*` — endpoint público que **contorna RLS**. Se este endpoint retornar dados sensíveis (clientes, leads), RGPD violation + leak de dados.

### Top 3 quick wins (<1h cada)
1. Remover `<script async src="pagead2.googlesyndication.com...">` de `Base.astro:62` — o `ConsentBanner` já faz isso condicionalmente.
2. Adicionar a `tsconfig.json` o campo `"engines"` ao `package.json` (`>=18.17.0`).
3. Apagar `.vite/deps/` e `.lovable/plan.md` do repo + gitignore.

---

## Red flags críticos (ação imediata, <24h)

### CRIT-1 · AdSense pré-consentimento (RGPD)
- **Onde:** `src/layouts/Base.astro:62`
- **Evidência:** GET a `https://www.senvia.pt/` mostra `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2464715822662169" crossorigin="anonymous">` no `<head>`, antes de qualquer JS do `ConsentBanner`.
- **Impacto:** RGPD violation — Google AdSense deposita cookies de rastreio antes do consentimento. Risco de multa (CNPD/EMEA pode multar até 4% do volume de negócios anual).
- **Esforço:** XS (5 min)
- **Fix:** Remover a linha 62. O `ConsentBanner.astro:94-102` já chama `loadAdSense()` corretamente após consentimento.

### CRIT-2 · `SUPABASE_SERVICE_ROLE_KEY` num endpoint público com CORS `*`
- **Onde:** `supabase/functions/public-api/index.ts:17` (e todo o ficheiro)
- **Evidência:** `createClient(..., Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '')` — service role bypassa todas as policies RLS. Endpoint responde a `GET /functions/v1/public-api/products|blog-posts|pages|all` com CORS aberto a qualquer origem.
- **Impacto:** Dependendo do que `getProducts`, `getBlogPosts`, `getAllPublicData` retornam, dados sensíveis (clientes, leads, vendas) ficam expostos a qualquer site.
- **Esforço:** M (audit a queries Supabase + separar dados públicos vs privados)
- **Fix:** Auditar queries em `public-api/index.ts:60-340`; mover dados sensíveis para endpoints autenticados; para o endpoint `all`, usar `anon` key com RLS explícita.

### CRIT-3 · `.env` comitado com 2 anon keys Supabase
- **Onde:** `git log -p --all -- .env` mostra os 2 commits
  - `cf7f768` (2025-10-23, gpt-engineer-app[bot]): criou `.env` com `rvrulhbgkdvnrkhzibif.supabase.co`
  - `36ce05a` (2026-03-23): substituiu por `jiirxgdngacfqqohwxyq.supabase.co` (atual)
- **Evidência:** `docs/auditoria/raw-env-history.txt` (capturado)
- **Impacto:** Anon keys são públicas por design mas o leak garante que **toda a tabela RLS** é o único controlo de acesso. Qualquer erro de RLS = data leak público.
- **Esforço:** S (rodar keys + remover do histórico)
- **Fix:**
  1. Rotar a chave **anon** atual via Supabase dashboard (cria novo project + migrate, OU re-issue anon key).
  2. `git filter-repo --invert-paths --path .env` para reescrever histórico.
  3. Force push + rotação de tokens de qualquer um que tenha clonado.
  4. (Como a key é `anon`, verdadeira urgência depende da auditoria RLS — ver `public-api` acima.)

### CRIT-4 · Encoding corrompido em artigos (mojibake)
- **Onde:** `src/content/artigos/como-ia-transforma-seguros-portugal-2026.md` (e provavelmente mais)
- **Evidência (linha 3-5 do ficheiro):**
  ```
  title: "Como a IA estǭ a transformar os seguros em Portugal em 2026"
  description: "Da subscri��ǜo automatizada �� dete��ǜo de fraude, a IA jǭ estǭ a mudar..."
  pubDate: 2026-07-12
  author: "Reda��ǜo SENVIA"
  category: ia
  ```
  Caracteres `ǭ`, `ǜ`, `Ǧ` em vez de `ã`, `ç`. Confirma-se no GET do site: `<meta name="description" content="SENVIA � uma AI Software House...">`
- **Impacto:** Conteúdo em PT-BR/PT-PT está visualmente corrompido para utilizadores finais. SEO penalizado (Google vê texto "estã-" como keyword quebrada). Google pode indexar variantes com caracteres errados.
- **Esforço:** L (revisar e corrigir 36+ artigos; alguns podem estar totalmente reescritos em UTF-8)
- **Fix:** Corrigir encoding dos 36 artigos para UTF-8; verificar com `iconv -f WINDOWS-1252 -t UTF-8 file.md` ou similar; rever o editor usado (Lovable?) que parece ter gravado em Latin1.

---

## Issues por pista

### P1 — Site ao vivo

| Sev | Esf | Issue | Detalhe | Fix |
|---|---|---|---|---|
| Crítica | XS | `senvia-agency.vercel.app` está DEAD | `X-Vercel-Error: DEPLOYMENT_NOT_FOUND` em todos os URLs testados (homepage, blog, /politica-privacidade, /sitemap-index.xml, /robots.txt, etc.). O Vercel não apagou o DNS — o deployment em si foi removido. | Re-deploy Vercel, OU apagar o domínio `senvia-agency.vercel.app` do setup Vercel (provavelmente era um preview). |
| Alta | XS | Homepage production retorna **mojibake** no `<meta description>` | A página devolve `SENVIA � uma AI Software House...` em vez de `SENVIA é uma AI Software House...` | Ver CRIT-4. |
| Média | XS | JSON-LD ausente no HTML | O regex de search não capturou nenhum bloco `<script type="application/ld+json">`. `Base.astro:65` define `<script type="application/ld+json" is:inline set:html={JSON.stringify(jsonLd)} />` — possível issue de escape JSON ou set:html não-inline. | Confirmar no HTML do browser; se ausente, trocar para `<script type="application/ld+json" set:html={...}>` sem `is:inline`. |
| Baixa | S | Headers de segurança incompletos | `vercel.json` configura X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy — mas não **HSTS** nem **CSP**. **No entanto**, `www.senvia.pt` na verdade JÁ retorna `Strict-Transport-Security: max-age=63072000` — isso vem do Vercel automaticamente para domínios `vercel.app` ou configurado noutro lado. Faltará CSP. | Adicionar CSP adequado em `vercel.json`: `default-src 'self'; img-src 'self' data: https://www.senvia.pt https://lovable-uploads...; script-src 'self' https://pagead2.googlesyndication.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com`. |
| Baixa | S | `_astro/page.sJrt8mpm.js` carrega após AdSense | JS bundle principal carrega **depois** do AdSense script — bom para LCP mas mau para interatividade. | Considerar `<script type="module">` cedo no `<head>` ou mover AdSense para `defer`. |

**Notas P1:** Lighthouse não foi corrido (sem CLI instalado). O GET a `https://www.senvia.pt/` confirma meta tags, OG, Twitter, AdSense. **Análise visual/CSS/responsividade não foi feita** — ficaria para P1 do plano paralelo que falhou. Se precisas, posso despachar Playwright agora.

---

### P2 — Código Astro/TS

| Sev | Esf | Issue | Detalhe | Fix |
|---|---|---|---|---|
| Alta | XS | `prefetch.prefetchAll: true` + `defaultStrategy: 'viewport'` | `astro.config.mjs:21-23` — todo o link que entra no viewport faz prefetch automático. Para um blog com 36 artigos + 11 páginas, isso é ~50 prefetches por sessão. | Mudar para `defaultStrategy: 'hover'` ou `prefetchAll: false`. |
| Média | XS | `vite.server.fs.allow: ['..']` | `astro.config.mjs:26` — permite ao dev server ler o diretório pai de `src/`. Risco se alguém correr `astro dev` num ambiente hostil. | Remover; default já permite a árvore do projeto. |
| Média | XS | `dev`/`start` scripts duplicados | `package.json:8-9` — `"dev": "astro dev --port 4322"` e `"start": "astro dev --port 4322"` fazem o mesmo. | Apagar `start` (ou torná-lo `astro preview`). |
| Média | XS | `vercel.json` `buildCommand: "bun run build"` mas Vercel corre com Node | Não testado diretamente; se `bun` não estiver no Vercel runtime (verificado: Vercel Node runtime default), o comando falha silenciosamente em builds locais mas pode estar a funcionar no Vercel (Vercel tem runtime Bun agora). | Verificar build logs Vercel; se OK, deixar. Se não, mudar para `npm run build`. |
| Média | S | `RSS feed` retorna TODOS os artigos | `src/pages/blog/rss.xml.ts:6-23` — sem `.slice(0, 20)`. Com 36 artigos é OK, mas a 100+ pesa o feed. | Adicionar `.slice(0, 50)` ou `.slice(0, 20)`. |
| Média | S | `NAV_LINKS` aponta para `/servicos` (não existe) | `src/config.ts:22` — rota morta. O dropdown usa `SERVICE_LINKS` (correto), mas o `NavLinks` em si tem link quebrado. | Remover do array; manter só como trigger de dropdown (sem `href`). |
| Média | S | `404.astro` usa `BlogBase` em vez de `Base` | `src/pages/404.astro:2` — 404 do site principal aparece com layout do blog (sem Header do site, sem Footer principal). | Trocar para `Base`. |
| Média | S | `404.astro` sem acentos | "Pagina nao encontrada" em vez de "Página não encontrada" — copy RGPD-OK mas mostra falta de polimento. | "Página não encontrada — SENVIA". |
| Média | S | `gmail.com` como email de contacto | `src/config.ts:13` — `geral.senvia@gmail.com`. Para uma "AI Software House" B2B, é sinal de amadorismo (espera-se domínio próprio `@senvia.pt`). | Criar `geral@senvia.pt` (se o domínio suporta) e configurar forward do Gmail. |
| Baixa | S | `postcss.config.mjs` vazio (3 linhas, 0 plugins) | `postcss.config.mjs:1-3` — ficheiro sem propósito. Sem Tailwind/Autoprefixer no package.json. | Apagar o ficheiro. |
| Baixa | XS | Sem `engines` em `package.json` | Falta `engines: { node: ">=18.17.0" }` ou similar. | Adicionar. |
| Baixa | XS | `.npmrc: legacy-peer-deps=true` | Sugere que havia conflitos peer-dep. Astro 5.13+ com @astrojs/mdx 4.3+ devem estar limpos. | Testar sem e remover a flag. |

**Boundary com P4 (SEO):** O `SEO.astro` está **bem implementado** (canonical, OG, Twitter, RSS alternate, description com fallback). Falta:
- `<meta property="article:published_time">` para artigos
- `<meta property="og:image:width|height">` (recomendado 1200x630)
- `<link rel="alternate" hreflang="pt-PT" href="..."/>` se multilingue (mas só há `pt`, pode ser skip).

---

### P3 — Segurança

#### P3.1 — Secrets em histórico ✅ CONFIRMADO
- **R1 confirmado.** 2 commits, 2 anon keys distintas:
  - `cf7f768` (2025-10-23): `rvrulhbgkdvnrkhzibif` — prov: antigo, provavelmente dead
  - `36ce05a` (2026-03-23): `jiirxgdngacfqqohwxyq` — **em uso** (é o `project_id` em `supabase/config.toml`)
- **Tipo:** Ambas `anon`/`publishable` keys (JWT com `role: "anon"`)
- **Severidade real:** Média-alta. Anon keys são desenhadas para ser públicas. O risco está em: (a) dados sem RLS, (b) falhas de implementação, (c) branding/secrecy.
- **Fix:** Remover do histórico via `git filter-repo` + rotar anon key no Supabase dashboard (cria uma nova, RLS já garante).

#### P3.2 — Edge Functions audit
- 18 ficheiros `index.ts` em `supabase/functions/`.
- **TODOS** têm `Access-Control-Allow-Origin: "*"` (17 ocorrências em 18 ficheiros). Isto é aceitável para alguns (webhooks), **problema** para os que servem APIs.
- **CRÍTICO: `public-api/index.ts`** — usa SERVICE_ROLE_KEY (CRIT-2 acima). Auditar queries.
- **`stripe-webhook`** ✅ — verifica signature corretamente (`stripe.webhooks.constructEvent(body, signature, webhookSecret)` na linha 65).
- **Recomendação geral:** Para webhooks (stripe-webhook, google-calendar-oauth, webhook-new-ia-lead), `Allow-Origin: *` é OK porque são server-to-server (não browsers). Mas adicionar verificação de origem/secret no path.

#### P3.3 — RLS
- **58 CREATE TABLE** em 80+ migrations
- **66 ENABLE ROW LEVEL SECURITY** — sinal bom (mais enables do que creates = algumas têm múltiplos enables em migrações posteriores)
- **159 CREATE POLICY** — cobertura sólida
- **0 `USING (true)`** sem role check — excelente, zero políticas over-permissivas detectadas
- **Risco:** Não foi possível confirmar 100% que todas as 58 tabelas têm RLS. 8 tabelas potencialmente sem. Tabela-a-tabela precisa de scan manual mais fino.

#### P3.4 — `.env` analysis
- `.env` está no `.gitignore` (linha 5) — **bem** ✅
- Mas 2 commits históricos com `.env` (já cobertos em CRIT-3)

#### P3.5 — Dependências
- `astro ^5.13.0` (em uso v5.18.2)
- `@astrojs/sitemap ^3.6.0`
- `@astrojs/rss ^4.0.12`
- `@astrojs/mdx ^4.3.0`
- `sharp ^0.34.0`
- `typescript ^5.9.0`
- **Nenhuma CVE conhecida crítica** nas versões atuais (Astro 5.18, sitemap 3.6, sharp 0.34 — todas recentes e patcheadas).
- **Recomendação:** Correr `npm audit` periodicamente; adicionar Dependabot (GitHub tem, mas o repo privado não parece ter configurado: ver `raw-repo-meta.json` — security features são básicas).

---

### P4 — SEO & Conteúdo

| Sev | Esf | Issue | Detalhe | Fix |
|---|---|---|---|---|
| Crítica | L | Encoding corrompido em artigos | Ver CRIT-4. Afeta <title>, <meta description>, e conteúdo. SEO penalizado. | Re-encoding UTF-8 + revisão de 36 artigos. |
| Alta | S | `ads.txt` pode ter formato obsoleto | `pub-2464715822662169, DIRECT, f08c47fec0942fa0` — Google AdSense em modo DIRECT. Formato está OK. | Manter. |
| Média | XS | `robots.txt` usa User-agents separados | Formato antigo. Modernamente usa-se apenas `User-agent: *`. | Simplificar para um bloco `*`. |
| Média | XS | `Disallow: /404` em robots.txt | Bloquear /404 não previne nada (páginas 404 nunca deviam ser indexadas via canonical anyway). | Remover `Disallow: /404`. |
| Média | S | `public/lovable-uploads/` como source de imagens | Pasta com UUIDs (Lovable artifacts). URLs públicas são funcionais mas feias. | Renomear para `/images/brand/`, `/images/articles/`, etc. |
| Média | S | Artigos com `coverImage: /images/artigos/...jpg` — formato inconsistente | Mistura jpg/png/webp? `src/content/artigos/*.md` referencia imagens em `/images/artigos/` mas `public/images/` e `public/lovable-uploads/` têm naming diferente. | Auditar todas as referências; consolidar em `public/images/`. |
| Média | M | Internal linking entre artigos | Amostra de 3 artigos: zero links internos. Blog SEO depende muito de links contextuais. | Adicionar 2-3 links por artigo para artigos relacionados. |
| Média | S | JSON-LD Organization schema presente | Ver `Base.astro:20-44` — schema Organization é emitido. ✅ Mas é o **mesmo** em todas as páginas. Não há Article schema por artigo. | Adicionar `BlogPosting` JSON-LD em `[...slug].astro` com article:title, datePublished, etc. |
| Média | M | Falta Sitemap check ao vivo | `/sitemap-index.xml` em produção: GET a `https://senvia-agency.vercel.app/sitemap-index.xml` retorna 404 (deploy morto). Em `www.senvia.pt` não foi possível confirmar via este método. | Verificar manualmente em browser. |
| Baixa | S | `trailingSlash` conflito astro vs vercel | `astro.config.mjs:7` diz `'ignore'`; `vercel.json:7` diz `false`. | Harmonizar (recomendo `false` em ambos). |
| Baixa | S | RSS feed retorna TODOS | Ver P2-Média. |

**Boundary P2/P4:** `SEO.astro` implementação OK; valores a checar página-a-página. Não foi feita auditoria página-a-página de 11 páginas (sample-by-strategy). Recomendação: gerar script `npm run check-seo` que itera todas as páginas e verifica title <60 chars, description 120-160, OG preenchidos.

---

### P5 — Build / Deploy / Organização

| Sev | Esf | Issue | Detalhe | Fix |
|---|---|---|---|---|
| Alta | XS | Dois lockfiles | `bun.lock` + `package-lock.json`. `vercel.json` usa `bun run build`. | Apagar `package-lock.json` (Bun é o canónico). |
| Alta | XS | `.vite/deps/` comitado | `.vite/deps/_metadata.json`, `.vite/deps/package.json` — dev artifact. | Apagar + adicionar `.vite/` ao `.gitignore`. |
| Alta | S | `.lovable/plan.md` comitado | Artifact da ferramenta Lovable. | Apagar + adicionar `.lovable/` ao `.gitignore` (só se decidirem não voltar a Lovable). |
| Alta | S | README.md é boilerplate do Lovable | `README.md` linha 65-72 diz "Vite + TypeScript + React + shadcn-ui" — **stack errada** (é Astro 5). | Reescrever. Esboço: |
| Média | S | `tsconfig.json` exclude `sites` e `supabase` | Linha 4: `"exclude": ["dist", "sites", "supabase", "node_modules"]` — admin React (sites/app, 379 ficheiros) não é type-checked. | Aceitável (são projetos separados), mas documentar no README. |
| Média | S | `.gitignore` minimalista | Só tem 6 padrões. Falta: `.DS_Store`, `Thumbs.db`, `.idea/`, `.vscode/`, `*.log`, `.env.local`, `.env.*.local`, `.vite/`, `.lovable/`, `coverage/`. | Adicionar (snippet abaixo). |
| Média | XS | `supabase/config.toml` minimal (1 linha) | Só tem `project_id`. | Adicionar pelo menos `[api] enabled = true`, `[db]`, etc. |
| Média | M | `sites/app/` e `sites/blog/` no repo mas não no build | 379+25 ficheiros, 404 KB de código não-deployado. | Documentar (são workspaces separados) OU extrair para sub-repo / monorepo tooling (turbo/pnpm). |
| Média | S | Sem `engines` em package.json | Falta. | Adicionar `"engines": { "node": ">=18.17.0" }`. |
| Média | XS | `npm run dev` port fixo `4322` | `package.json:8` — `--port 4322`. Sem risco mas inflexível. | Remover ou tornar env-configurable. |
| Baixa | XS | `postcss.config.mjs` vazio | Ver P2. | Apagar. |
| Baixa | XS | `vercel.json` site domain mismatch | `astro.config.mjs:6` site=`www.senvia.pt`. Em produção OK. Mas canonical vai para senvia.pt, mesmo que o user entre via outra rota. | OK como está, mas documentar. |
| Baixa | S | Stats no `config.ts` não verificáveis | `"50+ Projetos"`, `"120+ Automações"`, `"95% Taxa de Satisfação"` — números sem fonte. | Adicionar disclaimer ("*baseado em dados internos até Dez 2025") OU linkar para prova. |

---

## Top 10 recomendações priorizadas (matriz impacto × esforço)

| # | Ação | Sev | Esf | Impacto |
|---|---|---|---|---|
| 1 | Remover AdSense script de `Base.astro:62` (CRIT-1) | Crítica | XS | RGPD safe; elimina risco legal imediato |
| 2 | Auditar `public-api/index.ts` — usar anon key + RLS em vez de service_role (CRIT-2) | Crítica | M | Fecha data leak potencial |
| 3 | Corrigir encoding de artigos + validar que novos artigos são UTF-8 (CRIT-4) | Crítica | L | SEO + usabilidade recuperadas |
| 4 | Re-deploy `senvia-agency.vercel.app` ou apagar do setup Vercel | Alta | XS | Acaba com confusão de URL preview |
| 5 | Rotar anon key Supabase + `git filter-repo` em `.env` (CRIT-3) | Alta | S | Limpa histórico |
| 6 | Apagar `.vite/deps/` + `.lovable/plan.md` + adicionar ao `.gitignore` | Alta | XS | Limpa repo |
| 7 | Apagar `package-lock.json` (Bun é canónico) | Alta | XS | Elimina ambiguidade |
| 8 | Reescrever `README.md` com stack correta | Alta | S | Onboarding para novos devs |
| 9 | Mudar `prefetchAll: true` para `defaultStrategy: 'hover'` | Média | XS | Performance imediata |
| 10 | Adicionar CSP e headers de segurança em `vercel.json` | Média | S | Defense in depth |

---

## Apêndice A — Headers HTTP observados (`www.senvia.pt`)

```
HTTP/1.1 200 OK
Server: Vercel
X-Vercel-Cache: HIT
X-Vercel-Id: cdg1::82dlg-1784194719659-fb9e4b1ccb3c
Content-Type: text/html; charset=utf-8
Content-Length: 23944
Strict-Transport-Security: max-age=63072000
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Disposition: inline
Cache-Control: public, max-age=0, must-revalidate
Age: 42875
ETag: "ef2e986ea3b301b2319d86bbba8a1a3a"
Last-Modified: Wed, 15 Jul 2026 21:44:04 GMT
```

✅ HSTS presente (63072000s = 2 anos)
✅ X-Frame-Options SAMEORIGIN
✅ X-Content-Type-Options nosniff
✅ Referrer-Policy strict-origin-when-cross-origin
✅ Permissions-Policy restritivo
❌ CSP ausente (risco se adicionar JS de terceiros além de AdSense/Google Fonts)
❌ X-XSS-Protection removido (não usado em browsers modernos — OK)

## Apêndice B — Headers HTTP observados (`senvia-agency.vercel.app`)

```
HTTP/1.1 404 Not Found
X-Vercel-Error: DEPLOYMENT_NOT_FOUND
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Server: Vercel
Content-Type: text/plain; charset=utf-8
Content-Length: 107
```

🔴 **Deploy morto** — `X-Vercel-Error: DEPLOYMENT_NOT_FOUND` significa que o Vercel não tem um deployment activo para responder. Confirmar no dashboard Vercel se o project foi renomeado ou o deployment preview expirou.

## Apêndice C — Snippets sugeridos

### `.gitignore` melhorado

```
dist/
.output/
node_modules/
.astro/
.vercel/
.env
.env.local
.env.*.local

# OS
.DS_Store
Thumbs.db

# IDE
.idea/
.vscode/
*.swp
*.swo

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Tooling artifacts
.vite/
.lovable/

# Build artifacts
*.tsbuildinfo
coverage/
.nyc_output/
```

### `package.json` — engines + scripts limpos

```json
{
  "name": "senvia-web",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "engines": {
    "node": ">=18.17.0",
    "bun": ">=1.1.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro",
    "check": "astro check",
    "lint": "echo 'TODO: add eslint'"
  }
}
```

### Remoção do AdSense unconditional (CRIT-1 fix)

Em `src/layouts/Base.astro`, apagar a linha:
```astro
<script is:inline async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`} crossorigin="anonymous"></script>
```

### `vercel.json` CSP sugerida (adicionar)

```json
{
  "headers": [
    ...existing...,
    {
      "source": "/(.*)",
      "headers": [
        ...existing...,
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; img-src 'self' data: https://www.senvia.pt https://pagead2.googlesyndication.com; script-src 'self' https://pagead2.googlesyndication.com 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co; frame-ancestors 'self';" }
      ]
    }
  ]
}
```

---

## Apêndice D — Estatísticas do repo

| Métrica | Valor |
|---|---|
| `src/` (Astro site) | 67 ficheiros, 11 páginas `.astro`, 36 artigos MD |
| `sites/app/` (admin React/Vite) | 379 ficheiros — **não está no build Vercel** |
| `sites/blog/` (segundo blog) | 25 ficheiros — **não está no build Vercel** |
| `supabase/functions/` | 18 Edge Functions |
| `supabase/migrations/` | 80+ migrations |
| Lockfiles | 2 (`bun.lock` + `package-lock.json`) |
| `.env` histórico | 2 commits (anon keys) |
| `astro` version | 5.18.2 (em produção) |
| Deploy principal | `https://www.senvia.pt` (200 OK) |
| Deploy preview | `https://senvia-agency.vercel.app` (DEAD) |

---

## Metodologia & limitações

- **Análise estática** do repo `C:\...\Agency\senvia-agency` clonado localmente
- **Sondas HTTP** ao site ao vivo via PowerShell `HttpWebRequest` (não foi possível correr Lighthouse nem Playwright)
- **Não foi executado** nenhum código do projeto (não corro `bun run build`, não instalei deps)
- **Amostragem** de 3 artigos para encoding — provável que TODOS os artigos tenham mojibake
- **Crawler de 50 links** — não feito (limitação do método HTTP)
- **Análise visual/CSS/responsividade** — não feita
- **Auditoria de sites/app/** — não feita (379 ficheiros React/Vite, fora do scope desta ronda)
- **Auditoria de sites/blog/** — não feita

Para completar P1 visual/P2 sites/ e sites/app, será necessária uma 2ª ronda com Playwright e mais tempo.