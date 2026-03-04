

# Passar `fbclid` nos CTAs da página SENVIA OS

## Contexto

A página `/senvia-os` tem 4 locais com links para `app.senvia.pt`:
1. **OSHeroSection** — botão "Começar os meus 14 Dias Grátis" (`<a href>`)
2. **OSFinalCTASection** — botão "Criar a Minha Conta Gratuita Agora" (`<a href>`)
3. **Home2Navbar** — botão "Começar Teste Grátis" (2x: desktop + mobile) (`<a href>`)

Todos usam `<a href="https://app.senvia.pt/">` estático. É necessário capturar o `fbclid` da URL actual e passá-lo para `app.senvia.pt/?tab=signup&fbclid=...`.

## Plano

### 1. Criar helper `getSignupUrl()` (`src/utils/getSignupUrl.ts`)

Função utilitária reutilizável:

```ts
export const getSignupUrl = (): string => {
  const fbclid = new URLSearchParams(window.location.search).get('fbclid');
  const base = 'https://app.senvia.pt/?tab=signup';
  return fbclid ? `${base}&fbclid=${encodeURIComponent(fbclid)}` : base;
};
```

### 2. Alterar os 3 componentes

Converter os `<a href="...">` estáticos em `<a>` com `onClick` handler que usa `getSignupUrl()`:

- **`OSHeroSection.tsx`** — substituir `href` fixo por `onClick={() => window.open(getSignupUrl(), '_blank')}`
- **`OSFinalCTASection.tsx`** — idem
- **`Home2Navbar.tsx`** — idem nos 2 links (desktop + mobile)

### Ficheiros alterados
- `src/utils/getSignupUrl.ts` (novo)
- `src/components/senvia-os/OSHeroSection.tsx`
- `src/components/senvia-os/OSFinalCTASection.tsx`
- `src/components/home2/Home2Navbar.tsx`

