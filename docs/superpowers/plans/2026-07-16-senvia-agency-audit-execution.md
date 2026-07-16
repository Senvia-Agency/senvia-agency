# Plano de Execução — Auditoria Completa `senvia-agency`

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:dispatching-parallel-agents para despachar as 5 pistas em paralelo, depois superpowers:executing-plans para integrar resultados.

**Goal:** Entregar relatório único priorizado com auditoria completa do site Astro público + código das 3 superfícies + Supabase + build/deploy.

**Architecture:** 5 agentes especializados em paralelo (P1-P5), cada um com checklist específico e entregável Markdown; Sisyphus sintetiza relatório final.

**Tech Stack:** Astro 5, React + Vite + shadcn (admin), Supabase Edge Functions, Vercel deploy, Bun/npm. Tools: Playwright, Lighthouse, `git log -p`, `npm audit`/`bun audit`.

## Global Constraints

- Não modificar código-fonte do projeto — auditoria é passiva
- Não rodar `bun run build` local se demorar >2 min (pode falhar por deps); preferir verificação de configs
- Lighthouse em modo "clear cache, no throttling" para primeira visita
- Cada pista escreve o seu relatório em `docs/auditoria/`
- Não usar tokens do utilizador ou keys reais nos outputs — mascarar tudo com `***REDACTED***` se aparecer
- Não chamar `git push`, `git commit`, `git reset` no repo durante a auditoria
- Pasta `sites/app/` (admin) é React/Vite — auditoria é estática (código), sem executar
- Coordenação: agentes podem ler-se mutuamente em paralelo; cada um foca na sua pista sem duplicar

---

## Task 1: Setup (Sisyphus)

**Files:**
- Create: `docs/auditoria/.gitkeep`
- Create: `docs/auditoria/README.md` (índice das pistas)

**Steps:**
- [ ] **Step 1.1:** Criar pasta `docs/auditoria/` com `.gitkeep`
- [ ] **Step 1.2:** Criar `docs/auditoria/README.md` com índice das 5 pistas (placeholders para os relatórios)
- [ ] **Step 1.3:** Verificar que `bun` ou `npm` está disponível (qual foi usado no build?) — anotar para P5
- [ ] **Step 1.4:** Capturar `git log -p --all -- '.env' | head -100` em `docs/auditoria/raw-env-history.txt` como evidência para P3
- [ ] **Step 1.5:** Capturar `gh repo view Senvia/senvia-agency --json` em `docs/auditoria/raw-repo-meta.json` para P3/P5

---

## Task 2: Dispatch P1 (Site ao vivo)

**Agent:** `visual-engineering` (category) + `playwright` skill + `frontend` skill
**Background:** true
**Output:** `docs/auditoria/p1-site-ao-vivo.md` + `docs/auditoria/screenshots/`

**Steps:**
- [ ] **Step 2.1:** Despachar task em background
- [ ] **Step 2.2:** Esperar notificação; recolher output
- [ ] **Step 2.3:** Validar: screenshots presentes, métricas Lighthouse numéricas, issues com severidade
- [ ] **Step 2.4:** Se falhar, re-despachar com prompt ajustado

**Prompt resumo P1:** Auditar `https://senvia-agency.vercel.app` ao vivo com Playwright + Lighthouse. Páginas: home, sobre-nos, sites, softwares, chatbots, senvia-os, contacto, blog, 1 artigo, legais, 404. Screenshots 1280×800 + 375×812. Métricas: LCP, CLS, INP, FCP, TTFB. Visual: responsive 375/768/1280/1920, alt em imagens, lazy-loading, consent banner, 404, contraste AA, tab navigation. Crawler 50 URLs para broken links. Headers HTTP via curl -I.

---

## Task 3: Dispatch P2 (Código Astro/TS)

**Agent:** `unspecified-high` + `programming` skill
**Background:** true
**Output:** `docs/auditoria/p2-codigo-astro.md`

**Prompt resumo P2:** Auditar apenas `src/` do projeto Astro 5. Padrões Astro (content collections, schema), type-safety (`as any`, `@ts-ignore`), componentização (Header vs BlogHeader duplicação), SEO.astro (OG/Twitter/canonical), `blog/rss.xml.ts` validade, amostra estratificada de 5 artigos (frontmatter), `astro.config.mjs` trade-offs (`prefetchAll`, `vite.server.fs.allow`), páginas legais (404, cookies, privacidade, termos), global.css. Boundary: P2 audita implementação do `SEO.astro`; P4 audita os valores SEO.

---

## Task 4: Dispatch P3 (Segurança)

**Agent:** `unspecified-high` + `security-review` + `programming` skills
**Background:** true
**Output:** `docs/auditoria/p3-seguranca.md`

**Prompt resumo P3:** Confirmar R1 — `.env` leaked em `cf7f768` (2025-10-23). Comandos: `git log -p --all -- .env` (MASK values), grep por padrões secret (`ghs_`, `sk_live_`, `eyJ`, `AKIA`, `AIza`, `xox`, `SUPABASE_`, `STRIPE_`). `npm audit`/`bun audit` para CVEs. 17 Supabase Edge Functions: CORS, JWT verify, input validation, webhook signature. 80+ migrations: RLS em tabelas sensíveis (clients, leads, vendas, financeiro, customers) — flag `ENABLE ROW LEVEL SECURITY` ausente ou policies `USING (true)`. `astro.config.mjs` `vite.server.fs.allow`. `vercel.json` headers (HSTS/CSP faltando?). MASK secrets com `***REDACTED***`.

---

## Task 5: Dispatch P4 (SEO & Conteúdo)

**Agent:** `unspecified-high`
**Background:** true
**Output:** `docs/auditoria/p4-seo-conteudo.md`

**Prompt resumo P4:** Auditar SEO técnico + conteúdo. `public/robots.txt`, `public/ads.txt` (formato AdSense), sitemap (`@astrojs/sitemap` i18n pt-PT, ~47 URLs esperadas), 11 páginas `.astro` (title <60, meta description 120-160, OG/Twitter/canonical), amostra estratificada de 10 artigos (H1/H2/H3, internal linking, keyword, meta), `lang="pt-PT"` consistente, URL structure, otimização de imagens (`public/images/` vs `public/lovable-uploads/`, formatos webp/avif), Schema.org/JSON-LD, `sites/blog/` second blog (dead? duplicado?), RSS validity, hreflang.

---

## Task 6: Dispatch P5 (Build/Deploy/Organização)

**Agent:** `quick`
**Background:** true
**Output:** `docs/auditoria/p5-build-deploy.md`

**Prompt resumo P5:** Validar build config, lockfiles, monorepo org, housekeeping. Lockfiles (bun.lock vs package-lock.json — fonte de verdade). `vercel.json` validation (buildCommand, outputDirectory, redirects, headers patterns; HSTS/CSP gaps). `astro.config.mjs` (prefetch, vite.server.fs.allow). `.gitignore` completude (faltam: `.DS_Store`, `Thumbs.db`, `.idea/`, `.vscode/`, `*.log`, `.env.local`). `README.md` (boilerplate Lovable errado, proposta de reescrita). `.lovable/plan.md`, `.vite/deps/` (committed?). `sites/app/` e `sites/blog/` participam no build Vercel? `package.json` sem `engines`. `.npmrc`, `postcss.config.mjs`, `tsconfig.json`, `supabase/config.toml`.

---

## Task 7: Collect & Synthesize (Sisyphus)

**Inputs:** 5 relatórios de pista completos
**Output:** `docs/auditoria/2026-07-16-relatorio-completo.md`

**Steps:**
- [ ] **Step 7.1:** Aguardar 5 background tasks; recolher via `background_output`
- [ ] **Step 7.2:** Ler os 5 relatórios
- [ ] **Step 7.3:** Construir tabela consolidada (deduplicar cross-lane)
- [ ] **Step 7.4:** Score severidade (Crítica/Alta/Média/Baixa)
- [ ] **Step 7.5:** Score esforço (XS/S/M/L/XL)
- [ ] **Step 7.6:** Calcular matriz impacto × esforço → top 10 priorizadas
- [ ] **Step 7.7:** Escrever sumário executivo (1 página)
- [ ] **Step 7.8:** Escrever relatório final

**Estrutura do relatório:**
1. Sumário executivo (score, top 3 riscos, top 3 quick wins)
2. Red flags críticos (ação imediata)
3. Por pista (5 secções, tabela de issues)
4. Top 10 recomendações priorizadas (matriz)
5. Apêndices (screenshots index, métricas Lighthouse, CVEs)

---

## Task 8: Hand-off to User

**Steps:**
- [ ] **Step 8.1:** Mostrar sumário + top 10 no chat
- [ ] **Step 8.2:** Aguardar revisão do utilizador
- [ ] **Step 8.3:** Se pedir alterações, editar relatório
- [ ] **Step 8.4:** Done — implementação de fixes é outro pedido

---

## Self-Review

**1. Spec coverage:**
- ✅ 5 pistas paralelas (P1-P5) matching spec §4
- ✅ Setup task captura env history para P3
- ✅ Synthesis produz relatório final per spec §5
- ✅ User hand-off per spec §9

**2. Placeholder scan:** Sem "TBD", "TODO", "implement later", "fill in details".

**3. Type consistency:** N/A — investigação, sem tipos de código.

**4. Critérios de aceitação (spec §6):**
- ✅ P1 com Lighthouse real (Task 2)
- ✅ P3 R1 evidência (Task 1.4 + Task 4)
- ✅ Top 10 priorizadas (Task 7.6)
- ✅ Severidade + esforço por issue (Tasks 2-6 prompts)
- ✅ Sem placeholders no relatório final (Task 7.8)

**5. Orçamento temporal (spec §8):**
- ✅ 5 background tasks paralelos → ~15-30 min wall-clock
- ✅ Síntese ~5-8 min
- ✅ Total dentro do budget
