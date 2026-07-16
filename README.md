# SENVIA — Site Público (senvia.pt)

[![Astro](https://img.shields.io/badge/Astro-5-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![Live](https://img.shields.io/badge/Live-www.senvia.pt-2563EB)](https://www.senvia.pt)

Site de marketing público da **SENVIA — AI Software House**, em produção em
[www.senvia.pt](https://www.senvia.pt). Stack estática com blog em MD/MDX,
sitemap i18n, RSS feed, e integração RGPD-compliant com Google AdSense.

## Stack

- **Framework:** [Astro 5](https://astro.build) (estático, output `dist/`)
- **Linguagem:** TypeScript (strict mode, `astro/tsconfigs/strict`)
- **Conteúdo:** MD/MDX via `@astrojs/mdx` + content collections (`src/content/artigos/`)
- **SEO:** `@astrojs/sitemap` (i18n pt-PT) + `@astrojs/rss`
- **Imagens:** `sharp` (processamento build-time)
- **Build:** Bun (`bun run build`) · também compatível com `npm run build`
- **Deploy:** Vercel (framework: `astro`)

## Estrutura

```
.
├── src/
│   ├── components/         Componentes reutilizáveis (Header, Footer, SEO, ConsentBanner…)
│   ├── content/artigos/    36+ artigos MD/MDX do blog (categorias: ia, seguros, financas, pmes)
│   ├── content.config.ts   Schema Zod da collection "artigos"
│   ├── config.ts           Config do site (NAV_LINKS, SOCIAL, STATS, CATEGORIES, ADSENSE_CLIENT)
│   ├── layouts/            Base.astro (site), BlogBase.astro, BlogPost.astro
│   ├── pages/              11 páginas .astro + blog/artigos/[...slug].astro + rss.xml.ts
│   └── styles/global.css   CSS global (43 variáveis, sem framework)
├── public/                 Assets estáticos (favicon, robots.txt, ads.txt, images/, lovable-uploads/)
├── supabase/               Edge Functions + 80+ migrations SQL (projeto jiirxgdngacfqqohwxyq)
├── sites/                  Sub-projetos NÃO incluídos no build Vercel:
│   ├── app/                Admin dashboard React/Vite (deploy separado em app.senvia.pt)
│   └── blog/               Mirror estática de imagens de artigos (legacy)
├── astro.config.mjs        Config Astro (sitemap i18n, prefetch hover, MDX)
├── vercel.json             Config Vercel (CSP, HSTS, headers de segurança, cache)
├── tsconfig.json           extends astro/tsconfigs/strict (exclui sites/, supabase/)
└── package.json            Scripts: dev, build, preview, check
```

## Desenvolvimento local

Pré-requisitos: Node 18.17+ (recomendado 20+) ou Bun 1.1+.

```bash
# Instalar dependências (Bun é canónico)
bun install

# Servidor de desenvolvimento (porta 4322)
bun run dev
# → http://localhost:4322

# Build de produção
bun run build

# Preview do build
bun run preview

# Type-check
bun run check
```

> Alternativa com npm: substituir `bun` por `npm` nos comandos acima. Não manter ambos os lockfiles — `bun.lock` é a fonte de verdade.

## Variáveis de ambiente

Copiar `.env.example` para `.env` (ou pedir ao admin). Variáveis necessárias:

```
VITE_SUPABASE_PROJECT_ID=jiirxgdngacfqqohwxyq
VITE_SUPABASE_PUBLISHABLE_KEY=<anon key do Supabase>
VITE_SUPABASE_URL=https://jiirxgdngacfqqohwxyq.supabase.co
```

> A chave `VITE_SUPABASE_PUBLISHABLE_KEY` é a chave `anon` pública (RLS protege os dados).
> NÃO usar a chave `service_role` em código client-side.

## Deploy

O deploy é automático via Vercel quando se faz push para `main`. Config em `vercel.json`:

- `buildCommand`: `bun run build`
- `outputDirectory`: `dist`
- `framework`: `astro`
- Headers de segurança: HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, CSP
- Redirects: `/sitemap.xml` → `/sitemap-index.xml`

## SEO

- Sitemap gerado automaticamente por `@astrojs/sitemap` em `/sitemap-index.xml`
- `robots.txt` referencia o sitemap
- `SEO.astro` emite canonical, Open Graph, Twitter Card, RSS alternate
- JSON-LD Organization no `Base.astro` (default em todas as páginas)
- RSS em `/blog/rss.xml` com últimos 50 artigos

## RGPD / Cookies

- `ConsentBanner.astro` apresenta banner de consentimento antes de carregar AdSense
- Script AdSense é injetado dinamicamente só após consentimento explícito
- Preferência guardada em `localStorage` chave `senvia_consent_v1`
- Páginas legais: `/politica-privacidade`, `/politica-cookies`, `/termos-servico`

## Subprojetos (não deployam com o site)

### `sites/app/` — Admin Dashboard (React/Vite)

CRM interno com módulos de leads, clientes, vendas, financeiro, marketing.
Deploy independente em `app.senvia.pt`. Não partilha build com o site público.

### `sites/blog/` — Mirror de imagens (legacy)

Pasta com imagens de artigos duplicadas do `public/images/artigos/`. Considerar remover num cleanup futuro.

## Auditoria

Relatórios de auditoria em `docs/auditoria/`:

- `2026-07-16-relatorio-completo.md` — Fase 1 (reconhecimento)
- `2026-07-16-fase2-relatorio.md` — Fase 2 (profunda, com Playwright + RLS audit)

## Licença

Privado. © SENVIA.
