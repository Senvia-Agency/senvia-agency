
-- Habilitar RLS na tabela custom_services
ALTER TABLE public.custom_services ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para custom_services (apenas admins podem acessar)
CREATE POLICY "Only admins can view custom services" 
ON public.custom_services 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert custom services" 
ON public.custom_services 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update custom services" 
ON public.custom_services 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete custom services" 
ON public.custom_services 
FOR DELETE 
USING (public.is_admin(auth.uid()));
