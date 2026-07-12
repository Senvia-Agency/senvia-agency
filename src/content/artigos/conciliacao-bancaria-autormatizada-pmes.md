---
title: "Conciliação bancária automatizada para PMEs"
description: "Como automatizar a conciliação bancária com Primavera, PHC e APIs PSD2. IA casa transações com faturas em segundos e reduz 75% do tempo administrativo."
pubDate: 2026-07-12
author: "Redação SENVIA"
category: financas
tags: ["conciliação", "psd2", "primavera", "automação", "tesouraria"]
readingTime: 8
coverImage: /images/artigos/conciliacao-bancaria-autormatizada-pmes.jpg
---

A conciliação bancária é uma das tarefas mais repetitivas e necessárias na contabilidade de uma PME.
Em Portugal, com a chegada da diretiva PSD2 e o amadurecimento dos sistemas de IA, deixou de fazer sentido fazê-la manualmente.
Este artigo descreve como implementar conciliação automatizada, que ferramentas usar em Portugal e que resultados reais esperar.

## O que é conciliação bancária

Conciliação bancária é o processo de comparar os movimentos do extrato bancário com os lançamentos contabilísticos para garantir que correspondem.
Cada movimento bancário deve ter um documento suporte (fatura, recibo, nota de débito/crédito) e estar lançado corretamente no sistema de contabilidade.

### Porque é crítica

- **Obrigação fiscal**: código contabilístico exige lançamentos fiéis à realidade
- **Deteção de erros**: pagamentos duplicados, recibos não lançados, faturas recebidas mas não pagas
- **Posição de tesouraria**: sem conciliação em dia, não se sabe o saldo real disponível
- **Auditoria**: em caso de inspeção da AT, conciliação em atraso gera coimas

### Tempo tradicional

Para uma PME média com 200-500 movimentos bancários mensais:
- Conciliação manual: 4-10 horas/mês
- Lançamento de documentos: 8-15 horas/mês adicionais
- Total: 12-25 horas/mês em tarefas administrativas

## Como a IA muda o jogo

A conciliação automatizada usa três camadas de tecnologia:

### Camada 1: leitura automática (OCR + IA)

Sistema lê documentos:
- Faturas em PDF recebidas por email
- Faturas em papel digitalizadas
- Recibos de cartão corporativo
- Notas de débito e crédito

Extrai dados estruturados: fornecedor, NIF, data, valor, IVA, itens.

### Camada 2: matching inteligente

IA casa documentos com movimentos bancários usando múltiplos critérios:
- Valor (com tolerância para diferenças de câmbio)
- Data (proximidade, não exata)
- Fornecedor (nome no banco vs nome na fatura)
- Descrição livre do movimento

Confiança do match é scoreada 0-100%. Acima de 90%, processo automaticamente. Entre 60-90%, fila para validação humana. Abaixo de 60%, fica pendente.

### Camada 3: aprendizagem contínua

Cada validação humana corrige o modelo. Quando o TOC confirma um match "duvidoso", sistema aprende que aquele padrão é correto e nos próximos meses faz automaticamente.

## Ferramentas disponíveis em Portugal

### Primavera Banking Sync

Integração nativa do Primavera ERP com principais bancos portugueses (CGD, BCP, BPI, Santander, Novobanco, ActivoBank).

**Features**:
- Download automático do extrato (diário ou intra-dia)
- Matching automático baseado em regras configuráveis
- Importação de faturas por OCR
- Painel de pendentes para validação

**Custo**: €40-€100/mês adicional ao Primavera ERP base.

**Limitação**: matching baseado em regras mais do que IA generativa. Funciona bem para padrões regulares, menos para casos únicos.

### PHC Banking

Módulo do PHC Software com funcionalidades similares. Forte integração com o resto do ERP.

**Custo**: incluso em planos superiores; addon em planos básicos (€30-€60/mês).

### Jasmin Banking

Versão cloud do Primavera, com módulo banking incluído em planos superiores.

**Custo**: €25-€70/utilizador/mês.

### Make + API PSD2 (DIY)

Para PME técnica ou com recursos de IT, solução custom:

- Conectar a banco via API PSD2 (Nordigen, Tink, Salt Edge como agregadores)
- Make orquestra fluxos
- OpenAI ou Anthropic para matching de descrições
- Lançamentos via API do software contabilístico

**Custo**: €30-€150/mês em APIs + custo de implementação (€3K-€10K uma única vez).

**Vantagem**: customização total, sem mensalidades altas.
**Desvantagem**: manutenção contínua, sem suporte quando algo quebra.

### Ferramentas verticais

- **Datis**: plataforma portuguesa focada em conciliação para gestão de tesouraria
- **Sidernet**: ERP com módulo de banking integrado
- **ContaBank**: ferramenta independente, integra com Primavera/PHC

## Como funciona a integração PSD2

A Diretiva PSD2 (em vigor desde 2019) obriga bancos europeus a disponibilizar APIs padronizadas para acesso a contas com consentimento do titular.

### Passo a passo

1. **Empresa dá consentimento** via interface do agregador (Tink, Nordigen, etc.)
2. **Agregador conecta à API do banco** e descarrega extrato
3. **Dados normalizados** em formato comum (independente do banco)
4. **Software contabilístico** recebe dados via webhook

### Limitações

- Consentimento expira a cada 90 dias (reautenticação necessária)
- Bancos podem limitar frequência de pedidos (rate limits)
- Algumas operações (como splits de movimento) não vêm via API

### Agregadores populares em Portugal

- **Tink** (sueco, líder europeu)
- **Nordigen** (letão, foco em open banking)
- **Salt Edge** (britânico, cobertura global)
- **Plaid** (americano, expansão europeia)

## Caso prático: implementação em 4 semanas

Para PME com 50 colaboradores, faturação €3M/ano, 350 movimentos bancários/mês.

### Semana 1: Diagnóstico

- Avaliação do software atual (Primavera ERP sem Banking Sync)
- Mapeamento de tipos de movimento (recorrentes vs únicos)
- Identificação de faturas duplicadas no histórico (havia ~5/mês)

### Semana 2: Setup técnico

- Subscrição do Primavera Banking Sync
- Conexão com conta bancária via PSD2 (CGD, BCP, Santander)
- Configuração de regras de matching básicas (fornecedor + valor)
- Formation inicial do contabilista interno (8 horas)

### Semana 3: Migração e testes

- Importação das últimas 50 faturas para treino do sistema
- Teste com dados dos últimos 3 meses
- Ajuste de regras (5-10 casos que não bateram)
- Marcação de limite de confiança para auto-aprovação (90%)

### Semana 4: Go-live

- Ativação em produção
- Contabilista valida fila diariamente (15 min)
- Acompanhamento diário de KPIs:
  - % movimentos auto-conciliados
  - Tempo médio de validação humana
  - Casos pendentes (sem match)

### Resultados após 3 meses

- **65% dos movimentos** conciliados automaticamente
- **30% dos movimentos** validados em < 1 min cada
- **5% dos movimentos** ficam pendentes (casos únicos)
- **Tempo total**: de 12 horas/mês para 2 horas/mês (83% redução)
- **Erros detetados**: 2 faturas duplicadas (uma de €1.200, outra de €3.400) identificadas pelo sistema
- **ROI**: €1.800/mês em tempo poupado vs €80/mês de licença

## Limitações e cuidados

### Nem tudo é automatizável

Casos que ainda exigem intervenção humana:

- Movimentos sem documento claro (levantamentos em ATM)
- Transferências internas entre contas da empresa
- Erros do banco (raro mas acontece)
- Movimentos em moeda estrangeira com diferenças de câmbio
- Reembolsos a colaboradores (sem fatura direta)

Sistema tipicamente deixa 5-15% dos movimentos para revisão manual.

### Configuração inicial demora

Não é plug-and-play. Exige:
- 8-16 horas de setup técnico
- 4-8 horas deFormation
- 1-2 meses de ajuste fino

### Matching imperfeito tem custos

Se score de confiança está mal calibrado:
- **Muito permissivo (>95%)**: erros passam, contabilidade errada
- **Muito conservador (<70%)**: pouco automatizado, ROI não aparece

Recomendado começar em 90% e ir ajustando conforme dados reais.

### Dependência de fornecedor

Se software escolhido descontinua módulo banking, processo todo quebra. Diversificação ou contrato com SLA ajudam.

## Quando automatizar vs esperar

### Vale a pena automatizar agora se

- Volume mensal > 150 movimentos
- Empresa já usa Primavera/PHC (addon simples)
- TOC interno ou externo reclama de tempo gasto em tarefas manuais
- Histórico de erros por digitação

### Não vale a pena se

- Volume < 50 movimentos/mês (overhead técnico não compensa)
- Empresa ainda trabalha em Excel: migrar para software primeiro
- Falta de recursos internos paraFormation e configuração

## Tendências 2026-2027

### IA generativa para descrições ambíguas

Em vez de regras, LLMs interpretam descrições livres do banco:
- "TRF SENVIA LDA NIF 514. " → "Transferência recebida de Senvia"
- "DD EDP COMERCIAL" → "Débito direto EDP"
- "POS CAFE CENTRALIS" → "Pagamento cartão Café Central"

Melhora matching em 15-25%.

### Conciiação multi-moeda automática

Empresas com operações em €, USD, GBP deixam de precisar cálculo manual de câmbio. Sistema converte usando taxa do dia do movimento.

### Integração com facturação eletrónica

Quando fatura eletrónica B2B for obrigatória em PT (previsto 2025-2026), sistema recebe faturas diretamente via API da AT, sem necessidade de OCR.

## Erros comuns na implementação

### Não limpar histórico antes

Sistema precisa de aprender com dados passados. Se histórico tem erros, sistema aprende errado. Rever 3-6 meses de lançamentos antes de implementar.

### Esperar 100% de automação

Não existe. Aceitar 80-90% e focar na otimização dos 10-20% que ficam manuais.

### Não envolver TOC externo

Se TOC externo não é incluído na decisão eFormation, adoção é fraca e ROI não aparece.

### Não rever regras periodicamente

Padrões de negócio mudam (novos fornecedores, novos tipos de despesa). Regras de matching precisam de revisão trimestral.

## Checklist antes de investir

- [ ] Volume mensal de movimentos medido
- [ ] Tempo atual gasto em conciliação medido
- [ ] Software atual identificado e compatibilidade verificada
- [ ] Orçamento mensal disponível (incl. Addon + setup)
- [ ] Recurso interno designado para Formation
- [ ] TOC externo consultado e em acordo
- [ ] Histórico dos últimos 6 meses limpo
- [ ] Plano de medição de ROI definido (baseline + meta)

## Conclusão

Para uma PME portuguesa com volume bancário significativo, automatização da conciliação é uma das decisões com melhor ROI financeiro em 2026.
Investimento de €40-€100/mês em software adicional, mais custo de setup de algumas horas, liberta entre 8-20 horas/mês de trabalho administrativo.

A questão não é se vale a pena. É se a empresa consegue esperar mais 6-12 meses sem perder competitividade.
Concorrentes que automatizaram contabilidade operam com estruturas mais leves e têm visibilidade financeira em tempo real, enquanto os outros ainda esperam pelo extrato mensal em PDF.

Para começar sem grande risco: contactar o atual fornecedor de software (Primavera, PHC, Jasmin), pedir demo do módulo banking e fazer piloto de 60 dias.
Resultados são visíveis em 4 semanas e reversíveis se não convencerem.

---

**💡 Dica prática:** Comece com um limite de confiança de 90% para aprovação automática. Nas primeiras semanas, reveja todos os matches manualmente para calibrar o sistema. Ao fim de 2-3 meses, pode subir para 95% com confiança.