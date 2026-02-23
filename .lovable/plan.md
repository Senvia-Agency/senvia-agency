
# Reestruturacao: SENVIA - AI Software House (Pagina Principal)

## O Problema
A pagina atual em `/` esta demasiado focada no SENVIA OS (o produto CRM). O utilizador quer uma pagina principal que represente a **SENVIA como empresa** — uma AI Software House completa — e mover a pagina do SENVIA OS para `/senvia-os`.

## Nova Estrutura de Rotas

| Rota | Conteudo |
|------|----------|
| `/` | **NOVA** - SENVIA AI Software House (empresa) |
| `/senvia-os` | Pagina atual do SENVIA OS (CRM + Planos) |
| `/funis` | Landing pages de funis (sem alteracao) |
| Restantes | Sem alteracoes |

## Nova Pagina Principal (`/`) — Foco na EMPRESA

A pagina sera sobre a SENVIA como um todo: quem somos, o que fazemos, porque somos diferentes.

### Seccoes:

**1. Hero Section — "Construimos o Futuro Digital"**
- Foco na SENVIA como AI Software House
- Texto forte sobre a empresa (nao sobre um produto especifico)
- Fundo com particulas, aurora e efeitos 3D
- CTAs: "Falar com Especialista" + "Ver os Nossos Servicos"
- Stats animados: +50 Projetos, +120 Automacoes, 95% Satisfacao

**2. Servicos Principais — O que fazemos**
- 4 blocos grandes com efeitos premium:
  - **Desenvolvimento de Software a Medida** — Sistemas de gestao, portais, apps
  - **Sites, Landing Pages & E-commerces** — Design premium, performance de topo
  - **Automacao de Processos (IA + n8n)** — Chatbots, integracoes, workflows
  - **SENVIA OS (CRM com IA)** — Link para `/senvia-os` com destaque especial
- Cada bloco com icone animado, descricao e CTA

**3. Porque a SENVIA — Diferenciais**
- Secao visual com 3 a 4 pontos fortes:
  - IA em tudo o que construimos
  - Entrega rapida (semanas, nao meses)
  - Equipa dedicada a cada projeto
  - Suporte continuo pos-entrega
- Cards com efeitos glass e glow

**4. Nichos que Atendemos**
- Reutilizar NichosSection existente (Clinicas, Construcao, Telecom, E-commerce, Imobiliario)
- Mostra versatilidade da empresa

**5. Prova Social / Stats**
- Reutilizar StatsSection existente
- Numeros animados

**6. CTA Final + Footer**
- "Pronto para transformar o seu negocio?"
- CTA para agendar consultoria
- Footer com links atualizados incluindo `/senvia-os`

## Arquivos a Criar

1. **`src/pages/SenviaHome.tsx`** — Nova pagina principal da empresa
2. **`src/components/senvia/SenviaHeroSection.tsx`** — Hero focado na empresa
3. **`src/components/senvia/SenviaServicesSection.tsx`** — 4 servicos principais (inclui link ao SENVIA OS)
4. **`src/components/senvia/SenviaWhyUsSection.tsx`** — Diferenciais da empresa
5. **`src/components/senvia/SenviaNavbar.tsx`** — Navbar com links da empresa

## Arquivos a Modificar

1. **`src/App.tsx`** — Rotas:
   - `/` aponta para `SenviaHome` (nova)
   - `/senvia-os` aponta para `Home` (pagina atual do SENVIA OS)
   - `/funis` continua igual
2. **`src/components/home/HomeFooter.tsx`** — Adicionar link para `/senvia-os` nas solucoes

## Detalhes Tecnicos

- Todos os efeitos visuais reutilizam os CSS existentes: `aurora-bg`, `glass-premium`, `gradient-text-animated`, `shimmer`, `glow-pulse`, `floating`
- Animacoes com `framer-motion` (useInView, scroll-triggered)
- Componentes `NichosSection` e `StatsSection` reutilizados diretamente
- Nenhuma nova dependencia necessaria
- Navbar da nova pagina tera links internos (Servicos, Porque Nos, Nichos) + link externo para `/senvia-os`
