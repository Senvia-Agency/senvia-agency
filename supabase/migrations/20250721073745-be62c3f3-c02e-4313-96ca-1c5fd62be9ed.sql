-- Adicionar coluna 'plan' na tabela unified_leads para identificar qual plano o cliente escolheu
ALTER TABLE public.unified_leads 
ADD COLUMN plan text;

-- Criar índice para melhor performance nas consultas por plano
CREATE INDEX idx_unified_leads_plan ON public.unified_leads(plan);

-- Comentário para documentar a coluna
COMMENT ON COLUMN public.unified_leads.plan IS 'Plano escolhido pelo cliente: Starter, Pro, Premium, ou outro';