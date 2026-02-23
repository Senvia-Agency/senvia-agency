
# Atualizar Submenu Servicos na Navbar

## Resumo
Simplificar o submenu "Servicos" removendo "E-commerces" e "Agentes de IA", agrupando e-commerce junto com sites, e adicionando "Softwares".

## Alteracoes

### `src/components/senvia/SenviaNavbar.tsx` (linhas 7-12)

Substituir o array `serviceSubmenus` de:
```
{ label: "Sites", href: "/sites" },
{ label: "Chatbots", href: "/chatbots" },
{ label: "E-commerces", href: "#" },
{ label: "Agentes de IA", href: "#" },
```

Para:
```
{ label: "Sites & E-commerces", href: "/sites" },
{ label: "Chatbots", href: "/chatbots" },
{ label: "Softwares", href: "#" },
```

## Resultado
- "Sites" passa a "Sites & E-commerces" (mesmo link `/sites`)
- "Chatbots" mantem-se
- "E-commerces" e "Agentes de IA" removidos
- "Softwares" adicionado (com `href: "#"` ate ter pagina dedicada)
- Submenu passa de 4 para 3 itens
