
# Remover secao "Software House & Engenharia" da pagina SENVIA OS

## Alteracao

### `src/pages/Home.tsx`
- Remover o import do `SoftwareHouseSection` (linha 7)
- Remover o uso do componente `<SoftwareHouseSection />` (linha 25)

O ficheiro `src/components/home2/SoftwareHouseSection.tsx` pode ser mantido no projeto caso seja reutilizado noutro lugar futuramente, ou eliminado se preferir.
