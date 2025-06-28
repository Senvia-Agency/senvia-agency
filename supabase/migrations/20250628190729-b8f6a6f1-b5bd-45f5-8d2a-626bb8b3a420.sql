
-- Criar tabela para movimentos financeiros
CREATE TABLE public.financial_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Dados do movimento
  movement_type TEXT NOT NULL, -- 'receita' ou 'despesa'
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  movement_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Relacionamentos
  customer_id UUID REFERENCES public.customers(id),
  
  -- Metadados
  notes TEXT,
  tags TEXT[],
  
  CONSTRAINT positive_amount CHECK (amount > 0),
  CONSTRAINT valid_movement_type CHECK (movement_type IN ('receita', 'despesa'))
);

-- Índices para performance
CREATE INDEX idx_financial_movements_type ON public.financial_movements(movement_type);
CREATE INDEX idx_financial_movements_date ON public.financial_movements(movement_date);
CREATE INDEX idx_financial_movements_customer ON public.financial_movements(customer_id);

-- RLS Policies
ALTER TABLE public.financial_movements ENABLE ROW LEVEL SECURITY;

-- Políticas para movimentos financeiros (apenas admins)
CREATE POLICY "Only admins can view all financial movements" 
ON public.financial_movements 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert financial movements" 
ON public.financial_movements 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update financial movements" 
ON public.financial_movements 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete financial movements" 
ON public.financial_movements 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Trigger para updated_at
CREATE TRIGGER update_financial_movements_updated_at
  BEFORE UPDATE ON public.financial_movements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
