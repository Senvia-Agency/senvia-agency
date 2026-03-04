

# Passar `fbclid` em TODOS os CTAs do site que apontam para app.senvia.pt

## Situação actual

Existem dois tipos de URLs usados nos CTAs:
- **Formulários**: `https://app.senvia.pt/c/senvia-agency/formulario-lp` e `formulario-site`
- **Signup/Área cliente**: `https://app.senvia.pt` ou `https://app.senvia.pt/?tab=signup`

O `fbclid` já é passado nos 3 componentes da SENVIA OS (`OSHeroSection`, `OSFinalCTASection`, `Home2Navbar`). Falta em **15 outros locais** espalhados pelo site.

## Plano

### 1. Criar helper genérico `getAppUrl(path)`

Refactorizar `getSignupUrl.ts` para expor também uma função genérica:

```ts
export const getAppUrl = (path: string): string => {
  const fbclid = new URLSearchParams(window.location.search).get('fbclid');
  const url = new URL(path, 'https://app.senvia.pt');
  if (fbclid) url.searchParams.set('fbclid', fbclid);
  return url.toString();
};
```

`getSignupUrl()` continua a existir, usando `getAppUrl` internamente.

### 2. Actualizar todos os ficheiros com links para app.senvia.pt

| Ficheiro | Quantos links | URL base |
|---|---|---|
| `SitesHeroSection.tsx` | 1 | `formulario-site` |
| `SitesCTASection.tsx` | 1 | `formulario-site` |
| `ChatbotsHeroSection.tsx` | 1 | `formulario-lp` |
| `ChatbotsCTASection.tsx` | 1 | `formulario-lp` |
| `SoftwaresHeroSection.tsx` | 1 | `formulario-lp` |
| `SoftwaresCTASection.tsx` | 1 | `formulario-lp` |
| `SenviaHeroSection.tsx` | 1 | `formulario-lp` |
| `SenviaServicesSection.tsx` | 1 | `formulario-lp` |
| `SenviaNavbar.tsx` | 2 | `formulario-lp` |
| `HomeNavbar.tsx` | 3 | `formulario-lp` + área cliente |
| `HomeFooter.tsx` | 2 | `formulario-lp` + área cliente |
| `HeroSection.tsx` (home) | 1 | `formulario-lp` |
| `SoftwareHouseSection.tsx` | 1 | `formulario-lp` |
| `PricingSection.tsx` (home2) | 1 | `/` |
| `SobreNos.tsx` | 1 | `formulario-lp` |

Em cada um, importar `getAppUrl` e substituir a URL hardcoded por `getAppUrl('/c/senvia-agency/formulario-lp')` (ou o path correspondente).

### Ficheiros alterados
- `src/utils/getSignupUrl.ts` — adicionar `getAppUrl()`
- 15 componentes listados acima — importar e usar `getAppUrl()`

