

# Diagnóstico Completo: Build Errors + Acessibilidade para LLMs

## 1. Problema Crítico: Build Errors (Bloqueante)

Quando o Lovable Cloud foi ativado, foi criada uma **base de dados vazia**. O código existente referencia ~20 tabelas (`unified_leads`, `customers`, `products`, `sales`, `recurring_services`, `payments`, etc.) que não existem neste novo banco. O ficheiro `types.ts` gerado está vazio, causando centenas de erros TypeScript.

Existem **62 ficheiros de migração** no repositório (`supabase/migrations/`) que definem todas estas tabelas. Precisam de ser aplicados à nova base de dados do Cloud.

### Solução

Executar todas as migrações existentes na nova base de dados. Isto irá:
- Criar todas as tabelas necessárias (`unified_leads`, `customers`, `products`, `sales`, `recurring_services`, `recurring_receivables`, `financial_movements`, `payments`, `profiles`, `blog_posts`, `marketing_reports`, `admin_settings`, `activity_history`, `leads_ia`, `senvia_assistant_subscriptions`, `customer_subscriptions`, `entity_contacts`, `custom_services`, etc.)
- Criar as funções, triggers e políticas RLS
- Regenerar o `types.ts` automaticamente
- **Resolver todos os build errors**

Vou ler as migrações e aplicá-las sequencialmente usando a ferramenta de migração.

---

## 2. Acessibilidade para LLMs (Não é problema)

Testei o vosso site e **o conteúdo é perfeitamente legível** por crawlers e LLMs:
- A página principal (`senvia.pt/`) retorna todo o conteúdo (serviços, stats, reviews)
- A página `/sites` retorna todo o conteúdo (tipos de sites, processo, diferenciais)
- O `robots.txt` permite todos os crawlers
- O `sitemap.xml` lista todas as páginas
- Existe structured data JSON-LD
- Existe conteúdo `<noscript>` de fallback

O site **já é acessível a LLMs**. Se há algum problema específico, pode ser uma questão de cache ou de um crawler específico que não executa JavaScript — mas os principais (Google, Bing, ChatGPT) leem o conteúdo sem problemas.

---

## Plano de Acção

### Passo 1 — Aplicar as migrações existentes
Ler e executar as 62 migrações SQL na nova base de dados do Cloud, na ordem correcta. Isto é a prioridade máxima para o site voltar a compilar.

### Passo 2 — Verificar que o build passa
Após as migrações, o `types.ts` será regenerado com todas as tabelas e os erros desaparecerão.

### Ficheiros alterados
- Nenhum ficheiro de código alterado — apenas migrações SQL aplicadas à base de dados

