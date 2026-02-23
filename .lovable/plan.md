
# Remover CTA "A sua equipa de vendas agradece" da pagina SENVIA OS

## Alteracao

### `src/pages/Home.tsx` (linha 28)

O componente `HomeFooter` ja suporta a prop `hideCTA`. Basta passa-la como `true`:

- De: `<HomeFooter />`
- Para: `<HomeFooter hideCTA />`

Isto remove o bloco de CTA do footer mantendo os links, informacoes legais e redes sociais.
