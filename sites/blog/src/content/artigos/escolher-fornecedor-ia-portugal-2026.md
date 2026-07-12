---
title: "Como escolher um fornecedor de IA em Portugal (2026)"
description: "Checklist prático para avaliar agências e consultoras de IA em Portugal: perguntas a fazer, sinalizadores de alarme e framework de decisão baseado em AI Act e RGPD."
pubDate: 2026-07-12
author: "Redação SENVIA"
category: ia
tags: ["fornecedores", "consultoria", "ai-act", "rgpd", "avaliação"]
readingTime: 7
---

Escolher um fornecedor de IA é uma das decisões mais arriscadas que uma PME portuguesa pode tomar em 2026. O mercado está cheio de "especialistas em IA" que apareceram nos últimos 12 meses, muitos sem portefólio verificável. Errar a escolha custa entre €10.000 e €50.000 em projetos que nunca chegam a produção, sem falar do tempo interno perdido.

Este artigo dá um framework concreto para avaliar fornecedores, com checklist de perguntas, sinalizadores de alarme e referências regulatórias que deve confirmar.

## O ecossistema português em 2026

### Tipos de fornecedor

Existem quatro categorias no mercado:

**1. Agências digitais tradicionais que adicionaram "IA"**

Anteriormente faziam sites e campanhas de marketing. Em 2024-2025 adicionaram "serviços de IA" sem alterar equipa técnica. Podem ser boas para chatbots de marketing simples, mas carecem de maturidade para integrações profundas.

**2. Consultoras enterprise**

Grandes player internacionais (Accenture, Deloitte, Capgemini) com presença em Portugal. Equipas fortes, mas custos altos (€1.500-€3.000/dia). Adequadas para projetos de €100K+, não para PMEs.

**3. Boutiques especializadas em IA**

Empresas pequenas (5-25 pessoas) fundadas em 2022-2024, focadas em IA e data science. Equilíbrio entre custo (€600-€1.200/dia) e especialização. Maioria dos projetos de PME bem-sucedidos em Portugal passam por aqui.

**4. Freelancers e one-man-bands**

Engenheiros individuais que saíram de startups grandes. Flexíveis, baixo custo (€300-€600/dia). Bom para MVPs e provas de conceito, mas risco de continuidade.

### Vermíficos de mercado

Antes de avaliar fornecedor individual, esteja atento a:

- **Case studies sem cliente identificável** — "ajudamos uma empresa do setor retalho a reduzir custos em 30%" não conta nada. Cliente com nome e contacto verificável sim.
- **Parcerias com Google/Microsoft/OpenAI** — qualquer empresa pode ser partner bronze sem mérito. Só partner status Gold/Platinum tem significado.
- **"Ex-colaboradores da OpenAI/Google"** — em Portugal, ninguém veio da OpenAI. Se dizem isto, é sinal vermelho.

## Checklist de avaliação: 7 perguntas obrigatórias

Antes de assinar contrato, faça estas sete perguntas. Se alguma resposta for vaga, é motivo para desconfiar.

### 1. "Quantos projetos de IA têm em produção há mais de 12 meses?"

A palavra-chave é **produção**. Pilotos, POCs e "projetos internos" não contam. Projetos em produção há 12+ meses mostram:

- Robustez técnica (não quebraram)
- Manutenção sustentada (cliente não cancelou)
- Resultado mensurável (justifica o custo recorrente)

Exija referências com nome e contacto. Se não quiserem partilhar,desconfie.

### 2. "Qual foi o último projeto que falhou e porque falhou?"

Fornecedores sérios têm falhas. A forma como falam delas revela maturidade. Resposta honesta: "Implementámos X para cliente Y, mas o ROI não apareceu porque o volume de dados era insuficiente. Aprendemos a validar data readiness antes de avançar."

Resposta vermelha: "Nunca tivemos um projeto que falhasse."

### 3. "Que modelos usam e porque?"

Devem conseguir explicar porque escolhem GPT vs Claude vs Llama vs Mistral para cada caso de uso. Se a resposta for "GPT para tudo", é ignorância. Critérios legítimos:

- Custo por token
- Comprimento de contexto
- Soberania de dados (Mistral para dados UE)
- Latência
- Tipo de tarefa (reasoning, code, visão)

### 4. "Como garantem conformidade com RGPD e AI Act?"

Respostas aceitáveis mencionam:

- DPA com cada subfornecedor (OpenAI, Anthropic, etc.)
- DPIA antes de projetos com dados pessoais
- Anonimização ou pseudonimização quando aplicável
- Classificação do sistema no AI Act (high-risk, limited-risk, minimal)
- Políticas de retenção e direito ao esquecimento

Respostas inaceitáveis: "Tratamos de tudo isso internamente" sem detalhe.

### 5. "Como é a vossa equipa técnica?"

Nomeie pessoas concretas com LinkedIn verificável. Se a apresentação é feita por commercial mas a equipa técnica é "flexível consoante disponibilidade", é um sinal de que subcontratam.

Confirme:

- Quantos engenheiros em W2/efetivos
- Senioridade média (anos de experiência)
- Especializações (NLP, visão, dados, infraestrutura)

### 6. "Que SLAs oferecem?"

SLA deve cobrir:

- Disponibilidade do sistema (mínimo 99,5%)
- Tempo de resposta a incidentes (máximo 4h em horário laboral)
- Atualizações de modelo (como lidam com deprecation)
- Suporte a mudanças de API (OpenAI mudou API 3 vezes em 2024)

### 7. "Como fica o contrato de propriedade intelectual?"

Crítico. Por defeito em Portugal (Código do Direito de Autor), obra encomendada pertence ao autor (fornecedor) salvo cláusula em contrário. Tem de estar explícito:

- Código fonte é seu
- Modelos fine-tuned com seus dados são seus
- Prompts e configurations são seus
- Direito de migrar para outro fornecedor sem dependência técnica

## Proposta técnica: o que deve conter

Uma proposta séria tem, no mínimo:

1. **Contexto e objetivos** — reformulação do problema em linguagem técnica
2. **Abordagem técnica** — arquitetura proposta, modelos, integrações
3. **Entregáveis por fase** — com definição concreta de "pronto"
4. **Cronograma** — com marcos e dependências
5. **Riscos e mitigações** — não só os óbvios, mas edge cases
6. **Métricas de sucesso** — como medir se o projeto correu bem
7. **Custos detalhados** — implementação, licenças, manutenção
8. **Equipa proposta** — nomes e CVs
9. **Referências** — clientes contactáveis com projetos similares

Propostas sem estes elementos são propostas de marketing, não técnicas.

## Cláusulas contratuais a exigir

### NDA mútuo

Protege ambos os lados. Standard.

### penalty por atraso

Se a data de entrega é X, por cada semana de atraso sem justificação aceite, desconto de 5% (max 25%).

### Aceitação por fases

Pagamento desdobrado: 30% assinatura, 30% entrega MVP, 30% UAT completo, 10% 60 dias pós-go-live.

### Garantia de funcionamento

90 dias pós-go-live com correções gratuitas de bugs.

### Clausula de saída

Direito de terminar contrato com aviso prévio de 60 dias, com handover técnico completo (código, documentação, conhecimento).

### Confidencialidade de dados

Cláusula RGPD com responsabilidade civil ilimitada em caso de breach causado por negligência do fornecedor.

## Orçamento: quanto custa um projeto sério

| Tipo de projeto | Custo típico | Duração |
|---|---|---|
| Chatbot RAG simples | €5.000-€12.000 | 4-6 semanas |
| Automação de processos (3-5 fluxos) | €8.000-€20.000 | 6-10 semanas |
| Integração IA em produto existente | €15.000-€50.000 | 8-16 semanas |
| Sistema de scoring/classificação própria | €25.000-€80.000 | 12-24 semanas |

Valores abaixo destes ranges sugerem inexperiência ouShortcut. Acima sugerem overhead de consultora grande.

## Erros que custam caro

### Escolher pelo preço mais baixo

Em IA, "barato" costuma significar: prompt básico num SaaS, sem arquitetura, sem manutenção. Vai parecer que funciona nas demos e falhar em produção.

### Não incluir custo total de propriedade

Fornecedor cobra €15.000 pelo projeto. Esquecem de dizer: custo mensal de APIs €800, manutenção €300/mês, atualizações de modelo cada 6 meses €5.000. TCO em 3 anos: €15.000 + €800×36 + €300×36 + €5.000×6 = €63.000.

### Assinar sem revisão legal

Contratos standard de fornecedores costumam ter:

- Clausulas de lock-in técnico
- IP do trabalho desenvolvido ficando com fornecedor
- Limitação de responsabilidade desproporcionada

Advogado especializado em IT custa €500-€1.500 para rever contrato. Vale a pena.

## Conclusão

Escolher fornecedor de IA é como escolher sócio técnico — vai estar com a sua empresa durante 2-5 anos. O cortejo inicial (proposta, demos) é o momento mais fácil. O que conta é a relação nos meses seguintes, quando problemas surgem e decisões técnicas precisam de ser tomadas em conjunto.

Use o checklist das 7 perguntas. Exija referências contactáveis. Inclua custos totais no ROI. E quando em dúvida entre dois fornecedores, escolha o que fala mais claramente dos riscos — é geralmente o mais competente.
