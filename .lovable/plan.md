

# Carrossel de Logos de Clientes

## O que será feito

Criar uma secção de logos de clientes com scroll automático infinito (marquee), com fundo branco para os logos ficarem bem visíveis. A secção será colocada na página principal (`SenviaHome.tsx`) entre o `StatsSection` e o `GoogleReviewsSection`.

## Componente

Novo ficheiro: `src/components/home/ClientLogosSection.tsx`

- Fundo branco (`bg-white`)
- Título: "Projetos que Confiaram na SENVIA" ou similar
- Animação marquee CSS infinita (sem JS) — os logos deslizam continuamente da direita para a esquerda
- Logos com altura fixa (~50-60px), espaçamento generoso
- Links para os sites dos clientes (`target="_blank"`)

## Logos

Copiar os 4 uploads para `public/images/clients/`:
- `logo-renascer.png` → clinicarenascer.pt
- `logo-dracristina.png` → dracristinasousa.com
- `logo-longev.svg` → longevstudio.com
- `logo-tiago.png` → estudiotiagopereira.pt

## Integração

Em `SenviaHome.tsx`, lazy-load o novo componente e colocá-lo entre `StatsSection` e `GoogleReviewsSection`.

## Ficheiros alterados
- `public/images/clients/` — 4 logos copiados
- `src/components/home/ClientLogosSection.tsx` (novo)
- `src/pages/SenviaHome.tsx` — adicionar a secção

