
# Atualizar URL do formulario na pagina Sites

## Alteracao

Substituir o link do formulario generico pelo formulario especifico de sites em 2 ficheiros:

### 1. `src/components/servicos/sites/SitesHeroSection.tsx` (linha 6)
- **De:** `https://app.senvia.pt/c/senvia-agency/formulario-lp`
- **Para:** `https://app.senvia.pt/c/senvia-agency/formulario-site`

### 2. `src/components/servicos/sites/SitesCTASection.tsx` (linha 9)
- **De:** `https://app.senvia.pt/c/senvia-agency/formulario-lp`
- **Para:** `https://app.senvia.pt/c/senvia-agency/formulario-site`

## Resumo
- 2 ficheiros, 2 linhas alteradas
- Todos os CTAs da pagina `/sites` passam a apontar para o formulario dedicado ao servico de sites
