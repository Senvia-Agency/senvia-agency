
# Atualizar Pagina SENVIA OS com Integracoes Reais

## Resumo
Adicionar as integracoes reais do SENVIA OS (Faturacao com InvoiceXpress e KeyInvoice, E-mail com Brevo, Pagamentos com Stripe) na pagina `/senvia-os`.

## Alteracoes

### 1. `src/components/home2/SenviaOSSection.tsx`

**Atualizar o card "Faturacao"** (linha 14):
- De: `"InvoiceXpress integrado"`
- Para: `"InvoiceXpress & KeyInvoice"`

**Adicionar nova secao de Integracoes** abaixo da grid de modulos:
- Titulo: "Integracoes Nativas" ou similar
- 3 cards/badges horizontais para:
  - **Faturacao**: InvoiceXpress + KeyInvoice (icone Receipt)
  - **E-mail Marketing**: Brevo (icone Mail)
  - **Pagamentos**: Stripe (icone CreditCard)
- Design mais compacto que os modulos, tipo badges ou cards menores com logos/nomes das plataformas
- Mesmo estilo visual (glass-premium, animacoes framer-motion)

## Detalhes Tecnicos

- Usar icones lucide-react: `Receipt`, `Mail`, `CreditCard`
- Manter o padrao de animacoes com `useInView` ja existente
- Layout responsivo: 3 colunas em desktop, stack em mobile
- Estilo diferenciado dos modulos para separar visualmente "modulos" de "integracoes"
