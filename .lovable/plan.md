

# Otimizacao de Desempenho — Fase 2

O score subiu de 55 para 65 mas ainda ha problemas significativos. Os maiores culpados agora sao:

## Problemas identificados

1. **framer-motion carrega na homepage inteira** — SenviaHeroSection, SenviaServicesSection e SenviaWhyUsSection importam framer-motion eagerly (~30-40KB). O hero tem mouse tracking com `useMotionValue`/`useSpring` que executa em cada mousemove.

2. **Seccoes abaixo da dobra nao sao lazy** — SenviaServicesSection e SenviaWhyUsSection carregam imediatamente mas so sao visiveis apos scroll.

3. **CSS com animacoes infinitas pesadas** — `aurora-bg::before` (20s infinite), `spotlight::before` (8s infinite), `blob` (8s infinite), `neonFlicker`, `glitch`, `floating` — mesmo que algumas sejam compostas, forcam o GPU a trabalhar continuamente.

4. **AuthProvider + Supabase carregam no render inicial** — o supabase client (43KB) e importado via AuthContext que envolve toda a app, mesmo na homepage onde nao e necessario.

---

## Alteracoes

### 1. `src/components/senvia/SenviaHeroSection.tsx`
- Remover framer-motion completamente: substituir `motion.div` por `div` com classes CSS `animate-fade-in`
- Remover mouse tracking (`useMotionValue`, `useSpring`, `useTransform`, mousemove listener)
- O visual 3D do lado direito passa a ser estatico (sem rotateX/Y)

### 2. `src/pages/SenviaHome.tsx`
- Lazy load `SenviaServicesSection` e `SenviaWhyUsSection` com `React.lazy` + `Suspense`

### 3. `src/index.css`
- `aurora-bg::before`: remover animacao `auroraMove`, manter apenas o gradiente estatico
- `spotlight::before`: remover animacao `spotlightMove`, manter radial gradient estatico ou remover completamente
- `blob`: remover animacao `blobMorph` (ja e blur-3xl, nao precisa de morph)
- Remover keyframes `auroraMove`, `spotlightMove`, `blobMorph`, `glitch-anim`, `glitch-anim2`, `neonFlicker`, `floating` — nenhum e usado em componentes criticos
- Isto reduz o tamanho do CSS e elimina trabalho do GPU

### 4. `src/App.tsx`
- Mover `AuthProvider` para dentro das rotas protegidas (dashboard/admin) em vez de envolver toda a app
- Alternativa mais simples: lazy load do `AuthContext` para que o supabase client so carregue quando necessario

### 5. `src/components/senvia/SenviaServicesSection.tsx`
- Substituir `motion.div` por `div` com CSS transitions simples
- Remover import de `framer-motion`

### 6. `src/components/senvia/SenviaWhyUsSection.tsx`
- Substituir `motion.div` por `div` com CSS transitions simples
- Remover import de `framer-motion`

### 7. `src/components/home/GoogleReviewsSection.tsx`
- Substituir `motion` por divs com `animate-fade-in` CSS
- Remover import de `framer-motion`

### 8. `src/components/home/HomeFooter.tsx`
- Substituir ultimo `motion.div` por div normal
- Remover import de `framer-motion`

## Resultado esperado
- Eliminar framer-motion do bundle inicial (~35KB menos)
- Eliminar supabase do carregamento inicial (~43KB menos)  
- Menos trabalho de GPU com animacoes infinitas removidas
- **FCP e LCP devem melhorar significativamente** com ~80KB menos de JS a carregar

