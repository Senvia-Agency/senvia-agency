

# Auditoria e Correcao de SEO Completa

## Problemas Identificados

### 1. URLs Canonicas Erradas (CRITICO)
Varias paginas usam `senvia-agency.lovable.app` em vez de `www.senvia.pt`:
- `SenviaHome.tsx` (pagina principal `/`)
- `Home.tsx` (pagina `/senvia-os`)
- `ServicoSites.tsx` (`/sites`)
- `ServicoChatbots.tsx` (`/chatbots`)
- `ServicoSoftwares.tsx` (`/softwares`)

### 2. Meta Tags OG/Twitter Incompletas
As paginas de servicos (Sites, Chatbots, Softwares), SenviaHome e Home (SENVIA OS) nao tem tags Open Graph e Twitter completas (og:type, og:url, og:image, twitter:card, twitter:image).

### 3. Sitemap Desatualizado (CRITICO)
O `sitemap.xml` atual so tem 5 URLs. Faltam rotas publicas importantes:
- `/senvia-os`
- `/funis`
- `/sites`
- `/chatbots`
- `/softwares`

### 4. Pagina 404 sem SEO
O `NotFound.tsx` nao tem `<Helmet>` com `<meta name="robots" content="noindex">` nem titulo adequado.

### 5. OG Image com URL relativa no index.html
As tags `og:image` e `twitter:image` no `index.html` usam caminhos relativos em vez de URLs absolutas.

---

## Alteracoes

### `src/pages/SenviaHome.tsx`
- Canonical: `https://senvia-agency.lovable.app/` -> `https://www.senvia.pt/`
- Adicionar tags OG completas (og:type, og:url, og:image, twitter:card, twitter:image)

### `src/pages/Home.tsx`
- Canonical: `https://senvia-agency.lovable.app/` -> `https://www.senvia.pt/senvia-os`
- Adicionar tags OG completas

### `src/pages/ServicoSites.tsx`
- Canonical: `https://senvia-agency.lovable.app/sites` -> `https://www.senvia.pt/sites`
- Adicionar tags OG completas (og:type, og:url, og:image, twitter:card, twitter:image)

### `src/pages/ServicoChatbots.tsx`
- Canonical: `https://senvia-agency.lovable.app/chatbots` -> `https://www.senvia.pt/chatbots`
- Adicionar tags OG completas

### `src/pages/ServicoSoftwares.tsx`
- Canonical: `https://senvia-agency.lovable.app/softwares` -> `https://www.senvia.pt/softwares`
- Adicionar tags OG completas

### `src/pages/NotFound.tsx`
- Adicionar `<Helmet>` com titulo "Pagina Nao Encontrada | SENVIA" e `<meta name="robots" content="noindex, nofollow" />`

### `public/sitemap.xml`
- Adicionar as URLs em falta: `/senvia-os`, `/funis`, `/sites`, `/chatbots`, `/softwares`
- Atualizar `lastmod` para 2025-06-01

### `index.html`
- Corrigir og:image e twitter:image de caminhos relativos para URLs absolutas com `https://www.senvia.pt/`

---

## Detalhes Tecnicos

Todas as paginas publicas passarao a ter o conjunto completo de meta tags:
- `title`
- `meta description`
- `link canonical` (com dominio `www.senvia.pt`)
- `og:title`, `og:description`, `og:type`, `og:url`, `og:image`
- `twitter:card`, `twitter:image`

