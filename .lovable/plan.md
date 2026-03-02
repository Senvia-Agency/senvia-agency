

# Otimização de Performance — Página SENVIA OS

A página já segue boas práticas (HTML nativo, sem framer-motion, lazy loading, GTM diferido). Aqui estão as otimizações adicionais que ainda podem ser feitas:

## 1. Lazy load das secções below-the-fold

Atualmente todas as 5 secções são importadas estaticamente em `Home.tsx`. Apenas a Hero precisa de estar no bundle inicial — as restantes (Process, Benefits, FAQ, CTA Final) e o Footer podem ser lazy-loaded com `React.lazy`.

## 2. Eliminar o import de `lucide-react` na Hero

O `CheckCircle` na Hero é um ícone simples. Substituí-lo por um SVG inline elimina o chunk do lucide-react do caminho crítico. O mesmo para `Smartphone`, `Cpu`, `CheckCircle` no ProcessSection e `Users`, `Shield` no BenefitsSection — mas esses já estarão lazy-loaded.

## 3. Preload da imagem Hero

Adicionar `<link rel="preload">` na tag `<Helmet>` para a imagem `foto-senvia-os.png` melhora o LCP, pois o browser começa a descarregar a imagem antes de processar o React.

## 4. Adicionar `width` e `height` explícitos à imagem Hero

Para evitar CLS (Cumulative Layout Shift), adicionar dimensões explícitas ao `<img>` da Hero e ao logo da Navbar.

## 5. Remover os blobs de background da Hero

Os dois `div` com `blur-[120px]` e `blur-[100px]` forçam composite layers caros. Substituí-los por um gradiente CSS simples no próprio `<section>` reduz o trabalho de GPU.

## 6. Navbar — remover o ícone `Sparkles` do lucide

Substituir por um SVG inline ou emoji para evitar carregar lucide no caminho crítico da Navbar.

## Ficheiros a alterar

- `src/pages/Home.tsx` — lazy load das secções below-the-fold + preload da imagem
- `src/components/senvia-os/OSHeroSection.tsx` — SVG inline para CheckCircle, dimensões na imagem, gradiente em vez de blobs
- `src/components/home2/Home2Navbar.tsx` — SVG inline para Sparkles

