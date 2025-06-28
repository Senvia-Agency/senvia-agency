
-- Criar função para migrar leads pagos para clientes automaticamente
CREATE OR REPLACE FUNCTION public.migrate_paid_leads_to_customers()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  lead_record RECORD;
  customer_id UUID;
BEGIN
  -- Migrar leads unificados com payment_status = 'paid' que ainda não foram convertidos
  FOR lead_record IN 
    SELECT * FROM public.unified_leads 
    WHERE payment_status = 'paid' 
    AND converted = false
  LOOP
    -- Verificar se já existe cliente com este email
    SELECT id INTO customer_id 
    FROM public.customers 
    WHERE email = lead_record.email;
    
    IF customer_id IS NULL THEN
      -- Criar novo cliente
      INSERT INTO public.customers (
        full_name, email, phone, company_name, website,
        original_lead_id, acquisition_source, stripe_customer_id,
        total_spent, last_payment_date, acquisition_date
      )
      VALUES (
        lead_record.full_name,
        lead_record.email,
        lead_record.phone,
        lead_record.company_name,
        lead_record.website,
        lead_record.id,
        lead_record.source_page,
        lead_record.stripe_customer_id,
        CASE 
          WHEN lead_record.source_page = 'landing_page_basic' THEN 4.99
          WHEN lead_record.source_page = 'landing_page_premium' THEN 49.99
          ELSE 0
        END,
        lead_record.updated_at,
        lead_record.created_at
      )
      RETURNING id INTO customer_id;
      
      -- Criar transação do cliente
      INSERT INTO public.customer_transactions (
        customer_id, lead_id, transaction_type, amount, currency,
        product_type, product_description, status,
        stripe_payment_intent_id, stripe_session_id
      )
      VALUES (
        customer_id,
        lead_record.id,
        'payment',
        CASE 
          WHEN lead_record.source_page = 'landing_page_basic' THEN 4.99
          WHEN lead_record.source_page = 'landing_page_premium' THEN 49.99
          ELSE 0
        END,
        'EUR',
        lead_record.source_page,
        CASE 
          WHEN lead_record.source_page = 'landing_page_basic' THEN 'Landing Page Básica'
          WHEN lead_record.source_page = 'landing_page_premium' THEN 'Landing Page Premium'
          ELSE 'Produto Desconhecido'
        END,
        'completed',
        lead_record.stripe_payment_id,
        lead_record.stripe_session_id
      );
    END IF;
    
    -- Marcar lead como convertido
    UPDATE public.unified_leads 
    SET 
      converted = true,
      conversion_date = COALESCE(conversion_date, now()),
      lead_status = 'converted'
    WHERE id = lead_record.id;
  END LOOP;
  
  -- Migrar dados da tabela payments para customer_transactions se ainda não existirem
  INSERT INTO public.customer_transactions (
    customer_id, transaction_type, amount, currency,
    product_type, product_description, status,
    stripe_payment_intent_id, stripe_session_id,
    created_at
  )
  SELECT 
    c.id as customer_id,
    'payment' as transaction_type,
    (p.amount / 100.0) as amount,
    'EUR' as currency,
    'landing_page_basic' as product_type,
    'Landing Page €4.99' as product_description,
    'completed' as status,
    p.stripe_payment_id,
    p.stripe_session_id,
    p.created_at
  FROM public.payments p
  LEFT JOIN public.customers c ON c.email = p.email
  WHERE p.status = 'paid'
  AND NOT EXISTS (
    SELECT 1 FROM public.customer_transactions ct 
    WHERE ct.stripe_session_id = p.stripe_session_id
  );

  RAISE NOTICE 'Migration of paid leads to customers completed successfully';
END;
$$;

-- Criar trigger para automaticamente converter leads quando payment_status muda para 'paid'
CREATE OR REPLACE FUNCTION public.auto_convert_paid_lead()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  customer_id UUID;
BEGIN
  -- Se o payment_status mudou para 'paid' e ainda não foi convertido
  IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' AND NEW.converted = false THEN
    -- Verificar se já existe cliente com este email
    SELECT id INTO customer_id 
    FROM public.customers 
    WHERE email = NEW.email;
    
    IF customer_id IS NULL THEN
      -- Criar novo cliente
      INSERT INTO public.customers (
        full_name, email, phone, company_name, website,
        original_lead_id, acquisition_source, stripe_customer_id,
        total_spent, last_payment_date, acquisition_date
      )
      VALUES (
        NEW.full_name,
        NEW.email,
        NEW.phone,
        NEW.company_name,
        NEW.website,
        NEW.id,
        NEW.source_page,
        NEW.stripe_customer_id,
        CASE 
          WHEN NEW.source_page = 'landing_page_basic' THEN 4.99
          WHEN NEW.source_page = 'landing_page_premium' THEN 49.99
          ELSE 0
        END,
        now(),
        NEW.created_at
      )
      RETURNING id INTO customer_id;
      
      -- Criar transação do cliente
      INSERT INTO public.customer_transactions (
        customer_id, lead_id, transaction_type, amount, currency,
        product_type, product_description, status,
        stripe_payment_intent_id, stripe_session_id
      )
      VALUES (
        customer_id,
        NEW.id,
        'payment',
        CASE 
          WHEN NEW.source_page = 'landing_page_basic' THEN 4.99
          WHEN NEW.source_page = 'landing_page_premium' THEN 49.99
          ELSE 0
        END,
        'EUR',
        NEW.source_page,
        CASE 
          WHEN NEW.source_page = 'landing_page_basic' THEN 'Landing Page Básica'
          WHEN NEW.source_page = 'landing_page_premium' THEN 'Landing Page Premium'
          ELSE 'Produto Desconhecido'
        END,
        'completed',
        NEW.stripe_payment_id,
        NEW.stripe_session_id
      );
    END IF;
    
    -- Marcar lead como convertido
    NEW.converted = true;
    NEW.conversion_date = COALESCE(NEW.conversion_date, now());
    NEW.lead_status = 'converted';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar o trigger
DROP TRIGGER IF EXISTS trigger_auto_convert_paid_lead ON public.unified_leads;
CREATE TRIGGER trigger_auto_convert_paid_lead
  BEFORE UPDATE ON public.unified_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_convert_paid_lead();

-- Executar migração inicial
SELECT public.migrate_paid_leads_to_customers();
