
-- Adicionar coluna de status do projeto na tabela customers
ALTER TABLE public.customers 
ADD COLUMN project_status TEXT DEFAULT 'pending';

-- Criar índice para performance
CREATE INDEX idx_customers_project_status ON public.customers(project_status);

-- Comentário explicativo da coluna
COMMENT ON COLUMN public.customers.project_status IS 'Status do projeto do cliente: pending, in_progress, completed, on_hold, cancelled';
