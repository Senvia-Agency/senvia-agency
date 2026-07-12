# SENVIA Blog — `blog.senvia.pt`

Blog estático construído em **Astro 5** para aprovação no Google AdSense. Conteúdo sobre IA, Seguros, Finanças e PMEs em português de Portugal (pt-PT).

## Stack

| Camada | Tecnologia |
|---|---|
| Geração estática | Astro 5 (zero JS por defeito) |
| Conteúdo | Content Collections + Markdown/MDX |
| SEO | `@astrojs/sitemap` + JSON-LD (Article, BreadcrumbList, Organization) |
| Feed | `@astrojs/rss` em `/rss.xml` |
| Hosting | Vercel (root dir: `sites/blog/`) |
| Package manager | Bun |

## Estrutura

```
sites/blog/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── vercel.json
├── public/
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── config.ts                 ← config central (site, nav, categorias)
    ├── content.config.ts         ← schema Zod dos artigos
    ├── content/artigos/          ← artigos em Markdown
    ├── components/               ← Header, Footer, ArticleCard, SEO, AdSense
    ├── layouts/
    │   ├── Base.astro            ← HTML shell + meta + AdSense auto
    │   └── BlogPost.astro        ← article layout + JSON-LD
    ├── pages/
    │   ├── index.astro           ← home (hero + featured + por categoria)
    │   ├── artigos/
    │   │   ├── index.astro       ← arquivo completo
    │   │   └── [...slug].astro   ← artigo individual
    │   ├── categoria/[categoria].astro
    │   ├── sobre.astro
    │   ├── contacto.astro
    │   ├── privacidade.astro
    │   ├── cookies.astro
    │   ├── termos.astro
    │   ├── rss.xml.ts
    │   └── 404.astro
    └── styles/global.css
```

## Comandos

```sh
cd sites/blog
bun install
bun run dev       # dev server em http://localhost:4321
bun run build     # type-check + build para dist/
bun run preview   # servir build de produção
```

## Variáveis de ambiente (Vercel)

| Nome | Descrição |
|---|---|
| ` PUB_ID` | Publisher ID do AdSense (`ca-pub-XXXX`). Default em `src/config.ts`. |

## Setup DNS para blog.senvia.pt

1. No gestor de DNS de `senvia.pt` (Cloudflare, digital ou onde estiver):
   - Adicionar **CNAME** `blog` → `cname.vercel-dns.com`
2. No Vercel:
   - Criar projeto novo apontando para a subpasta `sites/blog/`
   - Em Settings → Domains, adicionar `blog.senvia.pt`

## Schema de um artigo (frontmatter)

```md
---
title: "Título do artigo (20–120 caracteres)"
description: "Resumo para SEO e cards (50–200 caracteres)."
pubDate: 2026-07-12
updatedDate: 2026-08-01        # opcional
author: "Redação SENVIA"        # opcional
category: ia                    # ia | seguros | financas | pmes
tags: ["chatbots", "automação"]
coverImage: /img/artigo.jpg     # opcional
coverAlt: "Descrição da imagem" # opcional
readingTime: 7                  # opcional (minutos)
featured: false                 # destacar na home
draft: false                    # não publica em produção
---
```

## AdSense

O script de auto-ads está carregado no `<head>` em `Base.astro`. Substituir o placeholder em `src/config.ts`:

```ts
export const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX'; // ← seu publisher ID
```

Slots manuais (`AdSense.astro`) colocam anúncios:
- In-article, após cabeçalho do artigo
- Homepage, entre categorias

## Princípios editoriais

1. **Praticidade sobre hype** — cada artigo tem de ter ação concreta
2. **Contexto português** — referências regulatórias e culturais locais
3. **Transparência** — uso de IA declarado, parcerias identificadas
4. **Atualização contínua** — artigos revistos pelo menos 1x/ano

## Licença

Conteúdo original: CC BY-NC 4.0.
Marcas e logos: propriedade da SENVIA.
