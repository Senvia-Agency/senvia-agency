

# Plano de Otimizacao de Desempenho

O Lighthouse mostra **55 de desempenho** com FCP 4.9s e LCP 7.8s. Os problemas principais sao: animacoes CSS nao-compostas, carregamento bloqueante de fontes, JS nao utilizado no carregamento inicial, e imagens sem dimensoes.

---

## 1. Corrigir animacoes nao-compostas (maior impacto no CLS e TBT)

As animacoes `gradient-text-animated`, `blobMorph`, `glowPulse`, `shimmer` e `gradientShift` usam propriedades que forcam repaint (background-position, border-radius, box-shadow, left). Sao 22 elementos animados reportados.

**`src/index.css`**:
- `gradient-text-animated`: remover animacao `background-position` e usar texto estatico com gradiente (sem animacao constante)
- `blobMorph`: substituir animacao de `border-radius` por `transform` (scale/rotate) que e composta
- `glowPulse`: remover animacao continua de `box-shadow`, usar apenas no hover
- `shimmer`: substituir animacao de `left` por `transform: translateX()` que e composta
- `gradientShift`: remover animacao de `background-position`, usar gradiente estatico

## 2. Lazy load do Supabase e componentes abaixo da dobra

O `supabase-CqL4roK8.js` (43KB) e `ui-GaGUN4hI.js` (28KB) carregam na homepage sem necessidade. O `GoogleReviewsSection` faz fetch ao Supabase edge function.

**`src/pages/SenviaHome.tsx`**:
- Lazy import de `GoogleReviewsSection` e `StatsSection` com `React.lazy` + `Suspense`
- Lazy import de `HomeFooter`

## 3. Otimizar carregamento de fontes (render-blocking)

**`index.html`**:
- Mudar Google Fonts de `<link>` para `<link rel="preload" as="style">` com `onload` para nao bloquear render
- Adicionar `font-display: swap` via URL param (ja tem `&display=swap`)
- Pre-conectar a `fonts.gstatic.com` ja existe, manter

## 4. Adicionar dimensoes explicitas nas imagens

**`src/components/senvia/SenviaNavbar.tsx`** e **`src/components/home/HomeFooter.tsx`**:
- Adicionar `width` e `height` ao logo (`<img>`)
- Logo de 1080x1080 servido para 56x56 - adicionar dimensoes explícitas

**`src/components/home/GoogleReviewsSection.tsx`**:
- Adicionar `width="40" height="40"` nas imagens dos reviews
- Usar `?s=80` no URL do Google para pedir tamanho correto (em vez de s128)

## 5. Reduzir animacoes framer-motion no carregamento inicial

**`src/components/senvia/SenviaHeroSection.tsx`**:
- Remover `FloatingParticles` (20 particulas animadas infinitamente)
- Remover animacao SVG `rotate: 360` infinita
- Simplificar blobs: remover animacoes framer-motion repetitivas, manter apenas CSS
- Reduzir delays sequenciais (atualmente ate 1.7s antes do conteudo aparecer, contribui para 2650ms LCP delay)

**`src/components/senvia/SenviaNavbar.tsx`**:
- Remover animacao `filter` infinita no logo (reportada no Lighthouse)

**`src/components/home/HomeFooter.tsx`**:
- Remover `motion` dos social links e list items (micro-animacoes desnecessarias)
- Simplificar animacao do botao "Voltar ao topo"

## 6. Acessibilidade (bonus rapido)

- Adicionar `aria-label` ao botao mobile do menu na navbar
- Adicionar `aria-label` aos links das redes sociais no footer

---

## Resultado esperado

- **FCP**: de 4.9s para ~2s (fonts nao-bloqueantes + menos JS inicial)
- **LCP**: de 7.8s para ~3s (menos delay de render do h1, menos animacoes)
- **CLS**: de 0.002 para 0 (animacoes compostas + dimensoes de imagens)
- **TBT**: de 250ms para ~100ms (menos JS, animacoes simplificadas)

