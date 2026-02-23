
# Criar Pagina Dedicada ao Servico "Softwares"

## Resumo
Criar uma nova pagina `/softwares` seguindo o mesmo padrao das paginas `/sites` e `/chatbots`, focada no servico de Desenvolvimento de Software a Medida. Sem o CTA generico do footer.

## Estrutura da Pagina

1. **Hero** - Titulo sobre software a medida, subtitulo focado em sistemas de gestao e aplicacoes web, CTA "Pedir Orcamento"
2. **Tipos de Software** - Cards para: Sistemas de Gestao, Portais & Dashboards, APIs & Integracoes, Apps Web Complexas
3. **Processo** - 4 passos: Levantamento de Requisitos, Arquitetura & Design, Desenvolvimento Agil, Deploy & Suporte
4. **Diferenciais** - Codigo limpo, escalabilidade, seguranca, tecnologias modernas, suporte dedicado, integracao com sistemas existentes
5. **CTA Final** - Chamada para acao com formulario externo
6. **Footer** - HomeFooter com `hideCTA`

## Ficheiros a Criar

### 1. `src/pages/ServicoSoftwares.tsx`
- Pagina principal com Helmet (SEO), SenviaNavbar, secoes, HomeFooter hideCTA
- Estrutura identica ao ServicoSites.tsx e ServicoChatbots.tsx

### 2. Componentes em `src/components/servicos/softwares/`:
- `SoftwaresHeroSection.tsx` - Hero com icone Code2, cores blue/cyan (consistente com card na SenviaHome), CTA externo
- `SoftwaresTypesSection.tsx` - Grid 2x2 com tipos de software (Sistemas de Gestao, Portais & Dashboards, APIs & Integracoes, Apps Web Complexas)
- `SoftwaresProcessSection.tsx` - Timeline 4 passos adaptados a desenvolvimento de software
- `SoftwaresDifferentialsSection.tsx` - 6 diferenciais tecnicos
- `SoftwaresCTASection.tsx` - CTA final

## Ficheiros a Editar

### 3. `src/App.tsx`
- Adicionar lazy load: `const ServicoSoftwares = lazy(() => import("./pages/ServicoSoftwares"))`
- Adicionar rota: `<Route path="/softwares" element={<ServicoSoftwares />} />`

### 4. `src/components/senvia/SenviaNavbar.tsx`
- Atualizar submenu: `{ label: "Softwares", href: "/softwares" }` (substituir o `#` pelo link real)

### 5. `src/components/senvia/SenviaServicesSection.tsx`
- No card "Desenvolvimento de Software a Medida", adicionar `link: "/softwares"` e alterar CTA para "Saber Mais" com link interno (mesmo padrao dos outros cards)

## Detalhes Tecnicos

- Formulario CTA: `https://app.senvia.pt/c/senvia-agency/formulario-lp` (generico, ate haver formulario especifico)
- Cores do tema: blue/cyan (consistente com o card de software na SenviaHome)
- Mesmo padrao de animacoes framer-motion
- SEO com react-helmet-async
- Lazy loading no App.tsx
- HomeFooter com prop `hideCTA` para nao mostrar "A sua equipa de vendas agradece"
