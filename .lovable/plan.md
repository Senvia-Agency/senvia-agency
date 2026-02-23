

# Corrigir efeito azul cortado no "E o agora."

## Problema
O texto "E o agora." usa a classe `gradient-text-animated` com `inline-block`. O `inline-block` cria uma caixa muito justa ao redor do texto, e combinado com `background-clip: text`, o efeito gradiente fica cortado nas bordas (especialmente em baixo e nos lados).

## Solucao

### Arquivo: `src/components/senvia/SenviaHeroSection.tsx` (linha 114)

Adicionar padding ao `motion.span` para dar espaco ao efeito gradiente nao ser cortado:

- **De:** `className="gradient-text-animated inline-block"`
- **Para:** `className="gradient-text-animated inline-block pb-2 pr-1"`

O `pb-2` (padding-bottom) evita que o gradiente seja cortado em baixo, e `pr-1` garante que nao corta a direita.

Se o padding sozinho nao resolver completamente, tambem se pode adicionar `overflow-visible` ao estilo do elemento pai (o `h1` na linha 110) para garantir que nada e cortado.

### Resumo
- 1 arquivo modificado, 1 linha alterada
- Adicionar padding ao span do texto animado para evitar o corte do efeito

