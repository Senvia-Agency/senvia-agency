

# Redesign completo da pagina /senvia-os

A pagina vai ser totalmente reescrita com 5 blocos focados em agencias de telecomunicacoes e energia. Todo o conteudo antigo (Hero2Section, SenviaOSSection, PricingSection, NichosSection, StatsSection) sera substituido.

**Sem framer-motion** — tudo com CSS puro para manter a performance.

---

## Estrutura

### `src/pages/Home.tsx`
- Remover imports antigos (Hero2Section, SenviaOSSection, PricingSection, NichosSection, StatsSection)
- Importar 5 novos componentes: `OSHeroSection`, `OSProcessSection`, `OSBenefitsSection`, `OSFAQSection`, `OSFinalCTASection`
- Manter Home2Navbar e HomeFooter
- Atualizar meta tags SEO para o novo posicionamento (telecomunicacoes/energia)

### `src/components/senvia-os/OSHeroSection.tsx` (novo)
**Bloco 1 — A Promessa**
- Titulo: "Abandone o Excel. O Sistema Definitivo para Agencias de Telecomunicacoes e Energia."
- Subtitulo: "Calcule comissoes, multiplos e estornos de forma 100% automatica..."
- Lado direito: imagem fotorealista (usaremos uma das imagens existentes em lovable-uploads ou placeholder para o mockup do dashboard)
- Botao CTA grande: "Comecar os meus 14 Dias Gratis" → link para https://app.senvia.pt/
- Gatilho de confianca: "Sem fidelizacao. Zero risco. Nao exigimos cartao de credito."
- HTML nativo com Tailwind, sem Button component, sem framer-motion

### `src/components/senvia-os/OSProcessSection.tsx` (novo)
**Bloco 2 — O Mecanismo (3 Passos)**
- Titulo: "Do terreno para a sua conta bancaria em 3 passos logicos."
- 3 cards com icones (Smartphone, Calculator/Cpu, CheckCircle):
  - Passo 1: O Comercial Submete
  - Passo 2: A Matriz Calcula
  - Passo 3: O Gestor Aprova
- Layout grid 3 colunas no desktop, stack no mobile

### `src/components/senvia-os/OSBenefitsSection.tsx` (novo)
**Bloco 3 — Beneficios Reais**
- Titulo: "Uma operacao blindada, desenhada para escalar."
- 2 cards grandes lado a lado:
  - Sem Limites: utilizadores e formularios ilimitados
  - Seguranca Total: perfis restritos e estanques
- Icones: Users e Shield

### `src/components/senvia-os/OSFAQSection.tsx` (novo)
**Bloco 4 — FAQ Rapido**
- Titulo: "Perguntas Frequentes"
- 2 perguntas em Accordion (reutilizando o componente ui/accordion existente):
  - Cartao de credito?
  - Dificil de implementar?

### `src/components/senvia-os/OSFinalCTASection.tsx` (novo)
**Bloco 5 — CTA Final**
- Titulo: "A sua concorrencia ja esta a automatizar as vendas. Vai continuar a perder dinheiro no Excel?"
- Botao grande: "Criar a Minha Conta Gratuita Agora" → https://app.senvia.pt/
- Fundo escuro com gradiente

### `src/components/home2/Home2Navbar.tsx`
- Remover framer-motion, substituir por CSS transitions
- Remover Button import, usar `<button>` e `<a>` com Tailwind
- Atualizar navItems para as novas seccoes: "Como Funciona", "Beneficios", "FAQ"

---

## Notas tecnicas
- Zero framer-motion em toda a pagina
- Zero imports de `Button` do ui — tudo `<button>` ou `<a>` com Tailwind
- Accordion do shadcn/ui reutilizado no FAQ (unico componente UI importado, e leve)
- CTA buttons linkam para `https://app.senvia.pt/`

