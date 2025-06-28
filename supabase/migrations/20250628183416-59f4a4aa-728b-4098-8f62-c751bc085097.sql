
-- Criar nova tabela unificada de leads
CREATE TABLE public.unified_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Dados básicos
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country_code TEXT DEFAULT '+351',
  company_name TEXT,
  website TEXT,
  
  -- Origem e interesse
  source_page TEXT NOT NULL, -- 'landing_page_basic', 'landing_page_premium', 'other'
  interest_type TEXT NOT NULL, -- 'basic_landing_page', 'premium_landing_page', 'custom'
  objective TEXT,
  main_product_service TEXT,
  target_audience TEXT,
  
  -- Status e gestão
  lead_status TEXT NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted', 'lost'
  priority INTEGER DEFAULT 1,
  assigned_to TEXT,
  notes TEXT,
  last_contact TIMESTAMP WITH TIME ZONE,
  next_followup TIMESTAMP WITH TIME ZONE,
  
  -- Dados de conversão
  converted BOOLEAN DEFAULT false,
  conversion_date TIMESTAMP WITH TIME ZONE,
  conversion_value DECIMAL(10,2),
  
  -- Dados de pagamento (se aplicável)
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  stripe_session_id TEXT,
  stripe_customer_id TEXT,
  stripe_payment_id TEXT,
  
  -- Metadados
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_address TEXT,
  user_agent TEXT,
  
  -- Dados específicos do lead básico
  call_to_action TEXT,
  client_testimonials TEXT,
  competitive_advantage TEXT,
  desired_style TEXT,
  social_networks TEXT,
  contact_channels JSONB,
  logo_images JSONB,
  data_consent BOOLEAN DEFAULT false
);

-- Criar tabela de clientes (quem se tornou cliente efetivo)
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Dados básicos
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  company_name TEXT,
  website TEXT,
  
  -- Origem
  original_lead_id UUID REFERENCES public.unified_leads(id),
  acquisition_source TEXT, -- 'landing_page_basic', 'landing_page_premium', 'referral', 'direct'
  acquisition_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Status do cliente
  customer_status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'churned'
  customer_tier TEXT DEFAULT 'basic', -- 'basic', 'premium', 'enterprise'
  
  -- Dados do Stripe
  stripe_customer_id TEXT UNIQUE,
  
  -- Valor total gasto
  total_spent DECIMAL(10,2) DEFAULT 0,
  last_payment_date TIMESTAMP WITH TIME ZONE,
  
  -- Dados adicionais
  notes TEXT,
  tags TEXT[],
  
  -- Endereço (opcional)
  address JSONB,
  
  -- Preferências
  communication_preferences JSONB,
  
  CONSTRAINT unique_email UNIQUE (email)
);

-- Criar tabela de transações do cliente (histórico de pagamentos)
CREATE TABLE public.customer_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Relacionamentos
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.unified_leads(id),
  
  -- Dados da transação
  transaction_type TEXT NOT NULL, -- 'payment', 'refund', 'chargeback'
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  
  -- Dados do Stripe
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  stripe_invoice_id TEXT,
  
  -- Produto/Serviço
  product_type TEXT NOT NULL, -- 'landing_page_basic', 'landing_page_premium', 'subscription', 'custom'
  product_description TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  
  -- Metadados
  metadata JSONB,
  
  CONSTRAINT positive_amount CHECK (amount > 0)
);

-- Índices para performance
CREATE INDEX idx_unified_leads_email ON public.unified_leads(email);
CREATE INDEX idx_unified_leads_source ON public.unified_leads(source_page);
CREATE INDEX idx_unified_leads_status ON public.unified_leads(lead_status);
CREATE INDEX idx_unified_leads_created_at ON public.unified_leads(created_at);
CREATE INDEX idx_unified_leads_stripe_customer ON public.unified_leads(stripe_customer_id);

CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customers_stripe_id ON public.customers(stripe_customer_id);
CREATE INDEX idx_customers_status ON public.customers(customer_status);

CREATE INDEX idx_customer_transactions_customer_id ON public.customer_transactions(customer_id);
CREATE INDEX idx_customer_transactions_stripe_payment ON public.customer_transactions(stripe_payment_intent_id);
CREATE INDEX idx_customer_transactions_created_at ON public.customer_transactions(created_at);

-- Triggers para updated_at
CREATE TRIGGER update_unified_leads_updated_at
  BEFORE UPDATE ON public.unified_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies
ALTER TABLE public.unified_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas para unified_leads (apenas admins)
CREATE POLICY "Only admins can view all unified leads" 
ON public.unified_leads 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert unified leads" 
ON public.unified_leads 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update unified leads" 
ON public.unified_leads 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete unified leads" 
ON public.unified_leads 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Políticas para customers (apenas admins)
CREATE POLICY "Only admins can view all customers" 
ON public.customers 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert customers" 
ON public.customers 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update customers" 
ON public.customers 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete customers" 
ON public.customers 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Políticas para customer_transactions (apenas admins)
CREATE POLICY "Only admins can view all transactions" 
ON public.customer_transactions 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert transactions" 
ON public.customer_transactions 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update transactions" 
ON public.customer_transactions 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- Função para migrar dados existentes
CREATE OR REPLACE FUNCTION migrate_existing_leads()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Migrar dados da tabela leads (Landing Page €4.99)
  INSERT INTO public.unified_leads (
    full_name, email, phone, company_name, website,
    source_page, interest_type, objective, main_product_service, target_audience,
    lead_status, payment_status, stripe_session_id, stripe_customer_id, stripe_payment_id,
    call_to_action, client_testimonials, competitive_advantage, desired_style, social_networks,
    contact_channels, logo_images, data_consent, utm_source, created_at, updated_at
  )
  SELECT 
    COALESCE(company_name, email) as full_name,
    COALESCE(email, company_email) as email,
    COALESCE(whatsapp, company_whatsapp) as phone,
    company_name,
    website,
    'landing_page_basic' as source_page,
    'basic_landing_page' as interest_type,
    landing_page_objective as objective,
    main_product_service,
    target_audience,
    COALESCE(lead_status, 'new') as lead_status,
    COALESCE(payment_status, 'pending') as payment_status,
    stripe_session_id,
    stripe_customer_id,
    stripe_payment_id,
    call_to_action,
    client_testimonials,
    competitive_advantage,
    desired_style,
    social_networks,
    contact_channels,
    logo_images,
    data_consent,
    utm_source,
    created_at,
    updated_at
  FROM public.leads;

  -- Migrar dados da tabela landing_page_leads (Landing Page Premium)
  INSERT INTO public.unified_leads (
    full_name, email, phone, country_code, company_name, website,
    source_page, interest_type, objective,
    lead_status, priority, assigned_to, notes, last_contact, next_followup,
    converted, conversion_date, conversion_value,
    utm_source, utm_medium, utm_campaign, ip_address, user_agent,
    created_at, updated_at
  )
  SELECT 
    full_name,
    email,
    phone,
    country_code,
    business_name as company_name,
    website,
    'landing_page_premium' as source_page,
    'premium_landing_page' as interest_type,
    objective,
    status as lead_status,
    priority,
    assigned_to,
    notes,
    last_contact,
    next_followup,
    converted,
    conversion_date,
    conversion_value,
    utm_source,
    utm_medium,
    utm_campaign,
    ip_address,
    user_agent,
    created_at,
    updated_at
  FROM public.landing_page_leads;

  RAISE NOTICE 'Migration completed successfully';
END;
$$;

-- Função para converter lead em cliente
CREATE OR REPLACE FUNCTION convert_lead_to_customer(lead_id UUID)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  customer_id UUID;
  lead_record RECORD;
BEGIN
  -- Buscar dados do lead
  SELECT * INTO lead_record FROM public.unified_leads WHERE id = lead_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lead not found';
  END IF;
  
  -- Inserir cliente
  INSERT INTO public.customers (
    full_name, email, phone, company_name, website,
    original_lead_id, acquisition_source, stripe_customer_id
  )
  VALUES (
    lead_record.full_name,
    lead_record.email,
    lead_record.phone,
    lead_record.company_name,
    lead_record.website,
    lead_id,
    lead_record.source_page,
    lead_record.stripe_customer_id
  )
  RETURNING id INTO customer_id;
  
  -- Atualizar lead como convertido
  UPDATE public.unified_leads 
  SET 
    converted = true,
    conversion_date = now(),
    lead_status = 'converted'
  WHERE id = lead_id;
  
  RETURN customer_id;
END;
$$;
