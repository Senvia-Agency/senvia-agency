

# Completar Meta Tags SEO em Falta

## Problema
Quatro paginas publicas ainda nao tem o conjunto completo de meta tags OG/Twitter:

| Pagina | og:type | og:description | twitter:card |
|--------|---------|----------------|--------------|
| SobreNos.tsx | Falta | OK | Falta |
| PrivacyPolicy.tsx | Falta | Falta | Falta |
| TermosServico.tsx | Falta | Falta | Falta |
| PoliticaCookies.tsx | Falta | Falta | Falta |

As paginas principais (SenviaHome, Home, Index, ServicoSites, ServicoChatbots, ServicoSoftwares) ja estao completas.

## Alteracoes

### `src/pages/SobreNos.tsx`
Adicionar as tags em falta no Helmet:
- `og:type` = "website"
- `twitter:card` = "summary_large_image"

### `src/pages/PrivacyPolicy.tsx`
Adicionar:
- `og:type` = "website"
- `og:description` = mesma da meta description
- `twitter:card` = "summary_large_image"

### `src/pages/TermosServico.tsx`
Adicionar:
- `og:type` = "website"
- `og:description` = mesma da meta description
- `twitter:card` = "summary_large_image"

### `src/pages/PoliticaCookies.tsx`
Adicionar:
- `og:type` = "website"
- `og:description` = mesma da meta description
- `twitter:card` = "summary_large_image"

## Resultado
Todas as paginas publicas passarao a ter o conjunto completo e uniforme de meta tags SEO: title, description, canonical, og:title, og:description, og:type, og:url, og:image, twitter:card, twitter:image.
