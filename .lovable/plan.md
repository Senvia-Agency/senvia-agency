
# Adicionar Google Reviews a SenviaHome

## Problema
A secao de avaliacoes Google (com integracao API real) existe apenas na pagina "Funis" (`Index.tsx`). Deve tambem aparecer na pagina principal (`SenviaHome.tsx`).

## Alteracao

### Arquivo: `src/pages/SenviaHome.tsx`
- Importar o componente `GoogleReviewsSection` de `@/components/home/GoogleReviewsSection`
- Adicionar `<GoogleReviewsSection />` antes do `<HomeFooter />`, depois da `<StatsSection />`

### Resultado
A pagina ficara com: Navbar > Hero > Services > Why Us > Stats > **Google Reviews** > Footer

### Notas
- O componente `GoogleReviewsSection` ja esta pronto e funcional
- Usa o hook `useGoogleReviews` que chama a edge function `get-google-reviews`
- Inclui loading states, fallback data e link para o Google Business
- Nenhum componente novo precisa ser criado
