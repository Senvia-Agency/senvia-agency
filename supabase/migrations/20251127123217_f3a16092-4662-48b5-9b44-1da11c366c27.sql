-- Adicionar colunas para qualificação e tracking do agente WhatsApp na tabela leads_ia
ALTER TABLE public.leads_ia 
ADD COLUMN IF NOT EXISTS segment TEXT,
ADD COLUMN IF NOT EXISTS monthly_clients INTEGER,
ADD COLUMN IF NOT EXISTS qualification_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS agent_conversation_status TEXT DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS diagnostic_answers JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS utm_source TEXT,
ADD COLUMN IF NOT EXISTS utm_medium TEXT,
ADD COLUMN IF NOT EXISTS utm_campaign TEXT;