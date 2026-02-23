

# Criar Pagina Dedicada ao Servico "Sites"

## Resumo
Criar uma nova pagina `/sites` com design consistente com a SenviaHome, focada no servico de criacao de Sites, Landing Pages e E-commerces.

## Estrutura da Pagina

A pagina tera as seguintes secoes:

1. **Hero** - Titulo forte sobre criacao de sites, subtitulo focado em conversao e performance, CTA "Pedir Orcamento"
2. **Tipos de Sites** - Cards para: Sites Institucionais, Landing Pages de Alta Conversao, Lojas Online (E-commerce), Portfolios/Blogs
3. **Processo** - 4 passos: Briefing, Design, Desenvolvimento, Lancamento e Suporte
4. **Diferenciais** - Porque escolher a SENVIA para sites (Performance, SEO, Design Premium, Responsivo, Rapido)
5. **CTA Final** - Chamada para acao com formulario externo
6. **Footer** - Reutilizar o HomeFooter existente

## Ficheiros a Criar/Editar

### 1. Novo: `src/pages/ServicoSites.tsx`
- Pagina principal com Helmet (SEO), SenviaNavbar, secoes do servico, HomeFooter

### 2. Novos componentes em `src/components/servicos/sites/`:
- `SitesHeroSection.tsx` - Hero com estilo semelhante ao SenviaHeroSection
- `SitesTypesSection.tsx` - Grid de cards com tipos de sites
- `SitesProcessSection.tsx` - Timeline/passos do processo
- `SitesDifferentialsSection.tsx` - Diferenciais (performance, SEO, etc.)
- `SitesCTASection.tsx` - CTA final

### 3. Editar: `src/App.tsx`
- Adicionar rota `/sites` com lazy load do `ServicoSites`

### 4. Editar: `src/components/senvia/SenviaNavbar.tsx`
- Atualizar o submenu "Serviços > Sites" para apontar para `/sites` em vez de `#`

### 5. Editar: `src/components/senvia/SenviaServicesSection.tsx`
- No card "Sites, Landing Pages & E-commerces", adicionar link para `/sites` (como ja e feito no card SENVIA OS)

## Detalhes Tecnicos

- Todos os componentes usam `framer-motion` para animacoes (padrao do projeto)
- Estilo visual dark com gradientes e efeitos glass/aurora (consistente com SenviaHome)
- Cores primary (cyan/teal) e accent do tema existente
- CTA externo: `https://app.senvia.pt/c/senvia-agency/formulario-lp`
- SEO com `react-helmet-async`
- Lazy loading da pagina no App.tsx

