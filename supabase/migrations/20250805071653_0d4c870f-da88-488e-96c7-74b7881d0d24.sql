-- Adicionar coluna de temperatura do lead na tabela unified_leads
ALTER TABLE public.unified_leads 
ADD COLUMN temperature text DEFAULT 'cold' CHECK (temperature IN ('hot', 'warm', 'cold'));