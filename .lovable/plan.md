

# Plano de Otimizacao — Fase 3

Score caiu para 52. LCP render delay subiu para **3390ms**. Identifiquei as causas reais:

## Problemas encontrados

1. **SenviaNavbar importa framer-motion eagerly** (linha 2: `import { motion, AnimatePresence } from 'framer-motion'`). Como a navbar NAO e lazy, isto puxa ~41KB (`proxy-BmjM5ITt.js`) para o bundle inicial.

2. **CookieConsent importa Button/ui eagerly** — carrega o chunk `ui-GaGUN4hI.js` (29KB) no render inicial, mesmo que o banner so apareca condicionalmente.

3. **main.tsx tem preloadCriticalResources quebrado** — tenta preload de `/src/index.css` que nao existe em producao. Codigo morto que executa no startup.

4. **GTM carrega sincronamente no head** — bloqueia o parser HTML. Sao 263KB de scripts terceiros (GTM + Facebook) que competem com o JS da app.

5. **Falta preconnect para supabase.co** — Lighthouse sugere 310ms de poupanca.

---

## Alteracoes

### 1. `src/components/senvia/SenviaNavbar.tsx`
- Remover `import { motion, AnimatePresence } from 'framer-motion'`
- Substituir `motion.div` do dropdown por `div` com CSS transitions (`transition-all duration-200 opacity-0 scale-95` / `opacity-100 scale-100`)
- Isto elimina o chunk `proxy-BmjM5ITt.js` (41KB) do bundle inicial

### 2. `src/App.tsx`
- Lazy load `CookieConsent` com `React.lazy` + `Suspense`
- Isto defere o chunk `ui-GaGUN4hI.js` (29KB)

### 3. `src/main.tsx`
- Remover funcao `preloadCriticalResources` e a sua invocacao — codigo quebrado sem efeito util

### 4. `index.html`
- Mover GTM script para depois do `<div id="root">` com `defer` ou usar `setTimeout` no inline script para adiar 2s
- Adicionar `<link rel="preconnect" href="https://rvrulhbgkdvnrkhzibif.supabase.co">`

### 5. `src/components/home2/StatsSection.tsx`
- Verificar se importa framer-motion e remover se sim (e lazy loaded mas pode arrastar dependencias)

## Resultado esperado
- Eliminar ~70KB do bundle inicial (framer-motion 41KB + ui 29KB)
- Reduzir LCP render delay com GTM deferido
- Preconnect ao supabase poupa ~310ms na chain

