

# Nova Pagina Principal - SENVIA AI Software House

## Resumo
Criar uma nova pagina principal focada na SENVIA como AI Software House completa, movendo a pagina atual para a rota `/funis`. A nova pagina tera efeitos visuais premium usando framer-motion e os estilos CSS ja existentes no projeto.

## Estrutura de Rotas

| Rota | Pagina |
|------|--------|
| `/` | **Nova** - AI Software House (SENVIA OS + Servicos) |
| `/funis` | Pagina atual (funis de vendas) |
| Restantes | Sem alteracoes |

## Seccoes da Nova Pagina Principal

### 1. Hero Section
- Titulo principal: "Software Inteligente. Resultados Reais."
- Subtitulo focado na proposta de valor como AI Software House
- Destaque do SENVIA OS como produto principal
- CTA: "Comecar Teste Gratis" + "Falar com Especialista"
- Mockup 3D animado do SENVIA OS (reutilizando padroes do hero atual)
- Particulas flutuantes, aurora background, blobs animados

### 2. SENVIA OS Section (Produto Principal)
- Apresentacao do CRM completo com todos os modulos
- Grid visual com icones para cada modulo: Leads, Clientes, Propostas, Vendas, Financeiro, Calendario, Marketing, E-commerce, Faturacao
- Badge "IA Integrada + Automacoes"
- Animacoes de scroll reveal

### 3. Pricing Section (SENVIA OS)
- 3 planos: Starter (49EUR), Pro (99EUR - Mais Popular), Elite (147EUR)
- Cards com efeitos glass, glow no plano popular
- Lista de features com checkmarks verdes/cinzas conforme disponibilidade
- CTA "Comecar Teste Gratis"

### 4. Nichos Section
- Cards animados para cada nicho: Clinicas/Saude, Construcao/Obras, Telecomunicacoes, E-commerce, Imobiliario
- Icones e descricoes especificas
- Efeito glowing-effect nos cards

### 5. Software House Section (Servicos High-Ticket)
- Desenvolvimento de Software a Medida
- Construcao de Sites, Landing Pages e E-commerces
- Automacao de Processos Empresariais
- Cards grandes com parallax/3D hover
- CTAs: "Pedir Orcamento", "Agendar Diagnostico"

### 6. Social Proof / Stats Section
- Numeros animados (clientes, projetos, automacoes)
- Reutilizando o componente AnimatedCounter existente

### 7. CTA Final + Footer
- Reutilizar HomeFooter com links atualizados

## Arquivos a Criar/Modificar

### Novos Arquivos
1. `src/pages/Home.tsx` - Nova pagina principal
2. `src/components/home2/Hero2Section.tsx` - Hero da nova pagina
3. `src/components/home2/SenviaOSSection.tsx` - Secao do produto SENVIA OS
4. `src/components/home2/PricingSection.tsx` - Planos do SENVIA OS
5. `src/components/home2/NichosSection.tsx` - Nichos atendidos
6. `src/components/home2/SoftwareHouseSection.tsx` - Servicos high-ticket
7. `src/components/home2/StatsSection.tsx` - Numeros/social proof
8. `src/components/home2/Home2Navbar.tsx` - Navbar adaptada

### Arquivos Modificados
1. `src/App.tsx` - Rota `/` aponta para `Home`, rota `/funis` aponta para `Index` (pagina atual)
2. `src/components/home/HomeFooter.tsx` - Adicionar link para `/funis` no footer

## Detalhes Tecnicos

### Efeitos Visuais Utilizados
- `framer-motion`: Animacoes de entrada, hover, scroll-triggered (useInView)
- CSS existente: `aurora-bg`, `glass-premium`, `gradient-text-animated`, `shimmer`, `glow-pulse`, `floating`, `blob`, `spotlight`
- `GlowingEffect` component para cards de servicos
- Parallax 3D com `useMotionValue` e `useSpring` no hero
- Particulas flutuantes animadas

### Padroes Reutilizados
- AnimatedCounter do HeroSection atual
- FloatingParticles do HeroSection atual
- Layout de cards do SolutionSection/TechnologySection
- Navbar com scroll-aware background

### Dependencias
Nenhuma nova dependencia necessaria - tudo ja existe no projeto (framer-motion, lucide-react, etc.)

