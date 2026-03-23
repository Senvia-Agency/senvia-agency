
-- Add missing columns to financial_movements
ALTER TABLE public.financial_movements ADD COLUMN IF NOT EXISTS movement_type TEXT;
ALTER TABLE public.financial_movements ADD COLUMN IF NOT EXISTS movement_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.financial_movements ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.financial_movements ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false;

-- Add missing columns to senvia_assistant_subscriptions
ALTER TABLE public.senvia_assistant_subscriptions ADD COLUMN IF NOT EXISTS monthly_price NUMERIC(10,2) DEFAULT 0;

-- Add missing columns to customer_transactions
ALTER TABLE public.customer_transactions ADD COLUMN IF NOT EXISTS product_type TEXT;

-- Add missing columns to activity_history
ALTER TABLE public.activity_history ADD COLUMN IF NOT EXISTS activity_type TEXT;
ALTER TABLE public.activity_history ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.activity_history ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add missing columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add FK relationship between sales and unified_leads
ALTER TABLE public.sales ADD COLUMN IF NOT EXISTS unified_lead_id UUID REFERENCES public.unified_leads(id);

-- Add missing DB function convert_lead_to_sale
CREATE OR REPLACE FUNCTION public.convert_lead_to_sale(
  p_lead_id UUID,
  p_service_type TEXT DEFAULT 'manual',
  p_service_name TEXT DEFAULT NULL,
  p_total_value NUMERIC DEFAULT 0,
  p_notes TEXT DEFAULT NULL,
  p_service_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_customer_id UUID;
  v_sale_id UUID;
  v_lead_record RECORD;
BEGIN
  SELECT * INTO v_lead_record FROM public.unified_leads WHERE id = p_lead_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Lead não encontrado'; END IF;

  SELECT id INTO v_customer_id FROM public.customers WHERE email = v_lead_record.email;

  IF v_customer_id IS NULL THEN
    INSERT INTO public.customers (full_name, email, phone, company_name, website, original_lead_id, acquisition_source)
    VALUES (v_lead_record.full_name, v_lead_record.email, v_lead_record.phone, v_lead_record.company_name, v_lead_record.website, p_lead_id, v_lead_record.source_page)
    RETURNING id INTO v_customer_id;
  END IF;

  INSERT INTO public.sales (customer_id, lead_id, service_type, service_name, total_value, notes, sale_number)
  VALUES (v_customer_id, p_lead_id, p_service_type, COALESCE(p_service_name, 'Serviço'), p_total_value, p_notes, public.generate_sale_number())
  RETURNING id INTO v_sale_id;

  UPDATE public.unified_leads SET lead_status = 'converted', converted = true, conversion_date = now() WHERE id = p_lead_id;

  RETURN v_sale_id;
END;
$$;

-- Add send_notification function stub
CREATE OR REPLACE FUNCTION public.send_notification(p_type TEXT, p_title TEXT, p_data JSONB DEFAULT '{}'::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.notification_logs (notification_type, title, data) VALUES (p_type, p_title, p_data);
END;
$$;

-- Add notify functions stubs
CREATE OR REPLACE FUNCTION public.notify_new_lead() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  PERFORM public.send_notification('new_lead', 'Novo Lead: ' || NEW.full_name);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_payment_received() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN RETURN NEW; END;
$$;

CREATE OR REPLACE FUNCTION public.notify_sale_completed() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN RETURN NEW; END;
$$;

CREATE OR REPLACE FUNCTION public.notify_customer_updated() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN RETURN NEW; END;
$$;

-- Add admin policy for profiles (admin can see all profiles)
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin(auth.uid()));
