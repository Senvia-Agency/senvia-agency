-- Criar tabela para leads de IA
CREATE TABLE public.leads_ia (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT,
  lead_status TEXT NOT NULL DEFAULT 'new',
  source_page TEXT NOT NULL DEFAULT 'ai_landing',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.leads_ia ENABLE ROW LEVEL SECURITY;

-- Políticas para leads_ia
CREATE POLICY "Admins can view all ia leads" 
ON public.leads_ia 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert ia leads" 
ON public.leads_ia 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update ia leads" 
ON public.leads_ia 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete ia leads" 
ON public.leads_ia 
FOR DELETE 
USING (is_admin(auth.uid()));

CREATE POLICY "Allow public inserts for forms" 
ON public.leads_ia 
FOR INSERT 
WITH CHECK (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_leads_ia_updated_at
BEFORE UPDATE ON public.leads_ia
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();