

# Remover NichosSection da SenviaHome

## Problema
A secao "Feito para o seu setor" (NichosSection) fala do "SENVIA OS" e dos seus nichos de produto. Como este site e para a SENVIA empresa no geral, essa secao nao faz sentido aqui.

## Alteracao

### Arquivo: `src/pages/SenviaHome.tsx`
- Remover o import do `NichosSection`
- Remover o componente `<NichosSection />` do JSX

### Resultado
A pagina ficara com: Navbar > Hero > Services > Why Us > Stats > Footer

