
-- Criar tabela para serviços personalizados
CREATE TABLE public.custom_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'custom',
  service_type TEXT NOT NULL DEFAULT 'one_time', -- 'one_time', 'recurring', 'custom'
  pricing_model TEXT NOT NULL DEFAULT 'fixed', -- 'fixed', 'hourly', 'project'
  estimated_hours INTEGER,
  includes_features JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para vendas
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID,
  lead_id UUID,
  sale_number TEXT NOT NULL UNIQUE,
  sale_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Informações do produto/serviço
  service_id UUID, -- Referência para custom_services ou products
  service_type TEXT NOT NULL, -- 'stripe_product', 'custom_service', 'manual'
  service_name TEXT NOT NULL,
  service_description TEXT,
  
  -- Valores
  total_value NUMERIC NOT NULL DEFAULT 0,
  paid_amount NUMERIC NOT NULL DEFAULT 0,
  remaining_amount NUMERIC GENERATED ALWAYS AS (total_value - paid_amount) STORED,
  
  -- Status
  sale_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'partial', 'paid', 'overdue'
  payment_method TEXT,
  
  -- Datas importantes
  expected_delivery_date TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- Observações e metadados
  notes TEXT,
  internal_notes TEXT,
  commission_rate NUMERIC DEFAULT 0,
  assigned_to TEXT,
  
  -- Integração com Stripe (quando aplicável)
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  stripe_customer_id TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para pagamentos das vendas
CREATE TABLE public.sale_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  payment_reference TEXT,
  
  -- Status e observações
  payment_status TEXT NOT NULL DEFAULT 'completed',
  notes TEXT,
  
  -- Integração com Stripe
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Função para gerar número de venda único
CREATE OR REPLACE FUNCTION generate_sale_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  current_year TEXT;
  sale_count INTEGER;
  sale_number TEXT;
BEGIN
  current_year := EXTRACT(YEAR FROM NOW())::TEXT;
  
  SELECT COUNT(*) + 1 INTO sale_count
  FROM public.sales
  WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  
  sale_number := 'VD' || current_year || '-' || LPAD(sale_count::TEXT, 4, '0');
  
  RETURN sale_number;
END;
$$;

-- Trigger para gerar número de venda automaticamente
CREATE OR REPLACE FUNCTION set_sale_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.sale_number IS NULL OR NEW.sale_number = '' THEN
    NEW.sale_number := generate_sale_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_sale_number
  BEFORE INSERT ON public.sales
  FOR EACH ROW
  EXECUTE FUNCTION set_sale_number();

-- Trigger para atualizar updated_at
CREATE TRIGGER trigger_update_sales_updated_at
  BEFORE UPDATE ON public.sales
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_custom_services_updated_at
  BEFORE UPDATE ON public.custom_services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_sale_payments_updated_at
  BEFORE UPDATE ON public.sale_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para converter lead em venda
CREATE OR REPLACE FUNCTION convert_lead_to_sale(
  p_lead_id UUID,
  p_service_id UUID DEFAULT NULL,
  p_service_type TEXT DEFAULT 'manual',
  p_service_name TEXT DEFAULT NULL,
  p_total_value NUMERIC DEFAULT 0,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_customer_id UUID;
  v_sale_id UUID;
  v_lead_record RECORD;
BEGIN
  -- Buscar dados do lead
  SELECT * INTO v_lead_record FROM public.unified_leads WHERE id = p_lead_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lead não encontrado';
  END IF;
  
  -- Verificar se já existe cliente com este email
  SELECT id INTO v_customer_id 
  FROM public.customers 
  WHERE email = v_lead_record.email;
  
  -- Se não existe cliente, criar um novo
  IF v_customer_id IS NULL THEN
    INSERT INTO public.customers (
      full_name, email, phone, company_name, website,
      original_lead_id, acquisition_source, stripe_customer_id
    )
    VALUES (
      v_lead_record.full_name,
      v_lead_record.email,
      v_lead_record.phone,
      v_lead_record.company_name,
      v_lead_record.website,
      p_lead_id,
      v_lead_record.source_page,
      v_lead_record.stripe_customer_id
    )
    RETURNING id INTO v_customer_id;
  END IF;
  
  -- Criar a venda
  INSERT INTO public.sales (
    customer_id,
    lead_id,
    service_id,
    service_type,
    service_name,
    service_description,
    total_value,
    notes,
    stripe_customer_id,
    stripe_session_id,
    stripe_payment_intent_id
  )
  VALUES (
    v_customer_id,
    p_lead_id,
    p_service_id,
    p_service_type,
    COALESCE(p_service_name, 'Serviço baseado em lead'),
    CASE 
      WHEN v_lead_record.source_page = 'landing_page_basic' THEN 'Landing Page Básica'
      WHEN v_lead_record.source_page = 'landing_page_premium' THEN 'Landing Page Premium'
      ELSE 'Serviço personalizado'
    END,
    p_total_value,
    p_notes,
    v_lead_record.stripe_customer_id,
    v_lead_record.stripe_session_id,
    v_lead_record.stripe_payment_id
  )
  RETURNING id INTO v_sale_id;
  
  -- Atualizar lead como convertido
  UPDATE public.unified_leads 
  SET 
    converted = true,
    conversion_date = now(),
    lead_status = 'converted',
    conversion_value = p_total_value
  WHERE id = p_lead_id;
  
  RETURN v_sale_id;
END;
$$;

-- Adicionar índices para performance
CREATE INDEX idx_sales_customer_id ON public.sales(customer_id);
CREATE INDEX idx_sales_lead_id ON public.sales(lead_id);
CREATE INDEX idx_sales_service_id ON public.sales(service_id);
CREATE INDEX idx_sales_status ON public.sales(sale_status);
CREATE INDEX idx_sales_payment_status ON public.sales(payment_status);
CREATE INDEX idx_sales_date ON public.sales(sale_date);
CREATE INDEX idx_sale_payments_sale_id ON public.sale_payments(sale_id);
CREATE INDEX idx_custom_services_status ON public.custom_services(status);
