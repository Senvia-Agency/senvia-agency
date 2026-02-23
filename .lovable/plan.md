
# Atualizar Navbar da Pagina Principal SENVIA

## O que muda

### Logo
- Icone SENVIA (imagem atual) + texto "SENVIA" ao lado
- Abaixo do texto "SENVIA", em tamanho menor: "IA Software House"
- Layout vertical compacto no bloco da logo

### Menu de Navegacao (Desktop)
| Item | Tipo | Destino |
|------|------|---------|
| SENVIA OS | Link | `/senvia-os` |
| Servicos | Dropdown | Submenus: Sites, Chatbots, E-commerces, Agentes de IA |
| Sobre Nos | Link | `/sobre-nos` |
| Blog | Link | `/blog` (rota a criar no futuro, por agora `#`) |
| Contactos | Scroll/Link | Seccao contactos ou `/contactos` |
| **Agendar Consultoria** | Botao CTA | Link externo (formulario atual) |

### Menu Mobile
- Mesmos itens, com "Servicos" expandivel (accordion) mostrando os submenus
- Botao "Agendar Consultoria" no fundo

## Detalhes Tecnicos

### Arquivo modificado
`src/components/senvia/SenviaNavbar.tsx` - Reescrita completa:

1. **Logo**: Trocar o layout de `flex items-center gap-3` para um bloco com "SENVIA" em bold e "IA Software House" em texto menor logo abaixo
2. **Dropdown "Servicos"**: Usar um hover dropdown customizado com `framer-motion` (AnimatePresence) -- sem dependencia nova, nao precisa de Radix DropdownMenu, basta um div com onMouseEnter/onMouseLeave
3. **Novos navItems**: SENVIA OS (`/senvia-os`), Servicos (dropdown), Sobre Nos (`/sobre-nos`), Blog (`#`), Contactos (scroll ou link)
4. **Botao CTA**: Texto muda de "Falar com Especialista" para "Agendar Consultoria"
5. **Mobile**: Servicos com toggle para mostrar/esconder submenus

### Nenhum arquivo novo necessario
- A rota `/sobre-nos` ja existe
- Blog pode apontar para `#` por agora (sem pagina criada ainda)
- O dropdown sera feito com logica de hover + AnimatePresence (ja disponivel)
