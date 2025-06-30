
-- Adicionar apenas as foreign keys que não existem
ALTER TABLE public.sales 
ADD CONSTRAINT sales_customer_id_fkey 
FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL;

ALTER TABLE public.sales 
ADD CONSTRAINT sales_lead_id_fkey 
FOREIGN KEY (lead_id) REFERENCES public.unified_leads(id) ON DELETE SET NULL;

-- Adicionar RLS policies para a tabela sales (estava faltando)
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Políticas para sales (apenas admins)
CREATE POLICY "Only admins can view all sales" 
ON public.sales 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert sales" 
ON public.sales 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update sales" 
ON public.sales 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete sales" 
ON public.sales 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Refresh do schema cache para garantir que as relações sejam reconhecidas
NOTIFY pgrst, 'reload schema';
