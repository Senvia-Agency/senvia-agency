-- Adicionar colunas de recorrência na tabela sales
ALTER TABLE public.sales
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS recurring_billing_day INTEGER CHECK (recurring_billing_day >= 1 AND recurring_billing_day <= 28),
ADD COLUMN IF NOT EXISTS recurring_start_date DATE;

-- Criar índice para melhorar performance de queries de vendas recorrentes
CREATE INDEX IF NOT EXISTS idx_sales_is_recurring ON public.sales(is_recurring) WHERE is_recurring = TRUE;

-- Adicionar comentários para documentação
COMMENT ON COLUMN public.sales.is_recurring IS 'Indica se esta venda gera pagamentos recorrentes';
COMMENT ON COLUMN public.sales.recurring_billing_day IS 'Dia do mês para cobrança (1-28)';
COMMENT ON COLUMN public.sales.recurring_start_date IS 'Data de início das cobranças recorrentes';