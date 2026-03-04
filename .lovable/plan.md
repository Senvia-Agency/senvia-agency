

# Substituir imagem da Hero por Mockup + Reposicionar foto do fundador

## O que muda

### 1. Copiar o mockup para o projeto
Copiar `user-uploads://mockup.svg` para `public/images/mockup-senvia-os.svg`.

### 2. Hero Section — usar o mockup
No `OSHeroSection.tsx`, substituir a imagem actual (`foto-senvia-os.png`) pelo mockup SVG. O mockup ficará no lado direito da Hero, sem crop (`object-contain`), com sombra e sem border-radius excessivo para manter o aspecto de produto/dashboard.

### 3. Nova secção com a foto do fundador
Criar uma secção de credibilidade/prova social entre a Hero e o ProcessSection — uma secção simples com a foto do homem à esquerda e um bloco de texto à direita (quem é, missão da SENVIA OS). Isto reforça a confiança e aproveita a imagem que já existia.

Alternativa mais simples: colocar a foto na secção de Benefícios como elemento visual lateral, transformando-a num layout 2 colunas (imagem + cards).

### 4. Preload
Atualizar o `<link rel="preload">` em `Home.tsx` para apontar para o novo mockup SVG em vez da foto.

### Ficheiros alterados
- `public/images/mockup-senvia-os.svg` (novo — cópia do upload)
- `src/components/senvia-os/OSHeroSection.tsx` — mockup no lugar da foto
- `src/components/senvia-os/OSBenefitsSection.tsx` — adicionar a foto do fundador como elemento visual (layout 2 colunas: imagem + cards)
- `src/pages/Home.tsx` — atualizar preload

