

# Remover secao CTA do HomeFooter na pagina Sites

## Problema
A pagina `/sites` ja tem o seu proprio CTA (`SitesCTASection`) com "Pronto para ter o site que o seu negocio merece?". O `HomeFooter` adiciona outro CTA generico ("A sua equipa de vendas agradece") que nao e relevante para esta pagina de servico e cria redundancia.

## Solucao
Adicionar uma prop `hideCTA` ao `HomeFooter` para controlar a visibilidade da secao CTA. Apenas a pagina Sites (e Chatbots, que tambem tem CTA proprio) passarao `hideCTA={true}`.

## Alteracoes

### 1. `src/components/home/HomeFooter.tsx`
- Adicionar prop opcional `hideCTA?: boolean`
- Envolver a secao CTA (linhas 28-91) num condicional: so renderiza se `hideCTA` nao for `true`

### 2. `src/pages/ServicoSites.tsx`
- Passar `<HomeFooter hideCTA />` em vez de `<HomeFooter />`

### 3. `src/pages/ServicoChatbots.tsx`
- Passar `<HomeFooter hideCTA />` em vez de `<HomeFooter />`
  (a pagina de chatbots tambem tem o seu proprio CTA)

## Impacto
- Todas as outras paginas que usam `<HomeFooter />` sem props continuam a mostrar o CTA normalmente
- Apenas as paginas de servico com CTA dedicado escondem o CTA generico do footer

