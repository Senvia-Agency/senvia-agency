
# Criar Pagina Dedicada ao Servico "Chatbots"

## Resumo
Criar uma nova pagina `/chatbots` seguindo exatamente o mesmo padrao da pagina `/sites`, focada no servico de Chatbots e Automacao com IA.

## Estrutura da Pagina

1. **Hero** - Titulo sobre chatbots com IA, subtitulo focado em atendimento 24/7 e automacao, CTA "Agendar Diagnostico"
2. **Tipos de Chatbots** - Cards para: Atendimento ao Cliente, Qualificacao de Leads, FAQ Inteligente, Assistente de Vendas
3. **Processo** - 4 passos: Diagnostico, Configuracao, Treino da IA, Lancamento e Otimizacao
4. **Diferenciais** - IA avancada, respostas naturais, integracao com sistemas, disponibilidade 24/7, analytics, multicanal
5. **CTA Final** - Chamada para acao com formulario externo
6. **Footer** - Reutilizar HomeFooter

## Ficheiros a Criar

### 1. `src/pages/ServicoChatbots.tsx`
- Pagina principal com Helmet (SEO), SenviaNavbar, secoes, HomeFooter
- Estrutura identica ao `ServicoSites.tsx`

### 2. Componentes em `src/components/servicos/chatbots/`:
- `ChatbotsHeroSection.tsx` - Hero com icone Bot/MessageSquare, cores purple/violet, CTA externo
- `ChatbotsTypesSection.tsx` - Grid 2x2 com tipos de chatbots
- `ChatbotsProcessSection.tsx` - Timeline 4 passos adaptados a chatbots
- `ChatbotsDifferentialsSection.tsx` - 6 diferenciais (IA, 24/7, integracao, etc.)
- `ChatbotsCTASection.tsx` - CTA final

## Ficheiros a Editar

### 3. `src/App.tsx`
- Adicionar lazy load: `const ServicoChatbots = lazy(() => import("./pages/ServicoChatbots"))`
- Adicionar rota: `<Route path="/chatbots" element={<ServicoChatbots />} />`

### 4. `src/components/senvia/SenviaNavbar.tsx`
- Atualizar submenu: `{ label: "Chatbots", href: "/chatbots" }` (substituir o `#`)

### 5. `src/components/senvia/SenviaServicesSection.tsx`
- No card "Automacao de Processos com IA", adicionar `link: "/chatbots"` e alterar CTA para "Saber Mais" com link interno (mesmo padrao do card Sites)

## Detalhes Tecnicos

- Formulario CTA: `https://app.senvia.pt/c/senvia-agency/formulario-lp` (generico, ate haver um formulario especifico para chatbots)
- Cores do tema: purple/violet (consistente com o card de automacao na SenviaHome)
- Mesmo padrao de animacoes framer-motion das outras paginas
- SEO com react-helmet-async
- Lazy loading no App.tsx
