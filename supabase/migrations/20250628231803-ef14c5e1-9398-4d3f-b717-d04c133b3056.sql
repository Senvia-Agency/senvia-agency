
-- Adicionar políticas RLS para permitir atualizações automáticas na tabela unified_leads

-- Política para permitir que edge functions (usando service role) atualizem leads
CREATE POLICY "Service role can update leads" 
ON public.unified_leads 
FOR UPDATE 
USING (true);

-- Política para permitir que edge functions (usando service role) insiram leads
CREATE POLICY "Service role can insert leads" 
ON public.unified_leads 
FOR INSERT 
WITH CHECK (true);

-- Política para permitir que edge functions (usando service role) selecionem leads
CREATE POLICY "Service role can select leads" 
ON public.unified_leads 
FOR SELECT 
USING (true);

-- Remover as políticas antigas que estavam muito restritivas (se existirem)
DROP POLICY IF EXISTS "Only admins can view all unified leads" ON public.unified_leads;
DROP POLICY IF EXISTS "Only admins can insert unified leads" ON public.unified_leads;
DROP POLICY IF EXISTS "Only admins can update unified leads" ON public.unified_leads;
DROP POLICY IF EXISTS "Only admins can delete unified leads" ON public.unified_leads;

-- Recriar políticas mais específicas para admins
CREATE POLICY "Admins can view all unified leads" 
ON public.unified_leads 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert unified leads" 
ON public.unified_leads 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update unified leads" 
ON public.unified_leads 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete unified leads" 
ON public.unified_leads 
FOR DELETE 
USING (public.is_admin(auth.uid()));
