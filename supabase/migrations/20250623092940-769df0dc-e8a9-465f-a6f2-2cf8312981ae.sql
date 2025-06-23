
-- Criar política RLS para a tabela landing_page_leads para que apenas admins possam acessar
ALTER TABLE public.landing_page_leads ENABLE ROW LEVEL SECURITY;

-- Política para que apenas admins possam visualizar todos os leads
CREATE POLICY "Only admins can view all leads" 
ON public.landing_page_leads 
FOR SELECT 
USING (public.is_admin(auth.uid()));

-- Política para que apenas admins possam atualizar leads
CREATE POLICY "Only admins can update leads" 
ON public.landing_page_leads 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- Política para que apenas admins possam inserir leads (caso necessário)
CREATE POLICY "Only admins can insert leads" 
ON public.landing_page_leads 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

-- Política para que apenas admins possam deletar leads
CREATE POLICY "Only admins can delete leads" 
ON public.landing_page_leads 
FOR DELETE 
USING (public.is_admin(auth.uid()));
