
# Usar a navbar da Home (SenviaNavbar) na pagina Sobre Nos

## Alteracao

### `src/pages/SobreNos.tsx`

Substituir o import e uso de `HomeNavbar` por `SenviaNavbar`:

- **Import**: `HomeNavbar` de `@/components/home/HomeNavbar` -> `SenviaNavbar` de `@/components/senvia/SenviaNavbar`
- **JSX**: `<HomeNavbar />` -> `<SenviaNavbar />`

Isto fara com que a pagina Sobre Nos use a mesma navbar completa da pagina principal, com menu de servicos, links de navegacao e dropdown.
