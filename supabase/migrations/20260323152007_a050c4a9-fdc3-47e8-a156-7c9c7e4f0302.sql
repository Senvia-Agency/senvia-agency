
-- Blog posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_name TEXT NOT NULL DEFAULT 'Equipa SENVIA',
  category TEXT NOT NULL DEFAULT 'Marketing Digital',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users,
  seo_title TEXT,
  seo_description TEXT,
  reading_time INTEGER DEFAULT 5
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Published posts are publicly visible" ON public.blog_posts FOR SELECT USING (status = 'published');

-- Custom services
CREATE TABLE IF NOT EXISTS public.custom_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'custom',
  service_type TEXT NOT NULL DEFAULT 'one_time',
  pricing_model TEXT NOT NULL DEFAULT 'fixed',
  estimated_hours INTEGER,
  includes_features JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.custom_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage custom services" ON public.custom_services FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Anyone can view active custom services" ON public.custom_services FOR SELECT USING (status = 'active');

-- Sales
CREATE TABLE IF NOT EXISTS public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id),
  lead_id UUID,
  sale_number TEXT NOT NULL UNIQUE,
  sale_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  service_id UUID,
  service_type TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_description TEXT,
  total_value NUMERIC NOT NULL DEFAULT 0,
  paid_amount NUMERIC NOT NULL DEFAULT 0,
  remaining_amount NUMERIC GENERATED ALWAYS AS (total_value - paid_amount) STORED,
  sale_status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  expected_delivery_date TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  internal_notes TEXT,
  commission_rate NUMERIC DEFAULT 0,
  assigned_to TEXT,
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  stripe_customer_id TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_billing_day INTEGER,
  recurring_start_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage sales" ON public.sales FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Sale payments
CREATE TABLE IF NOT EXISTS public.sale_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  payment_reference TEXT,
  payment_status TEXT NOT NULL DEFAULT 'completed',
  notes TEXT,
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.sale_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage sale payments" ON public.sale_payments FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Activity history
CREATE TABLE IF NOT EXISTS public.activity_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  performed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage activity history" ON public.activity_history FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Entity contacts
CREATE TABLE IF NOT EXISTS public.entity_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  contact_name TEXT NOT NULL,
  contact_role TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  is_primary BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.entity_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage entity contacts" ON public.entity_contacts FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Recurring services
CREATE TABLE IF NOT EXISTS public.recurring_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  sale_id UUID REFERENCES public.sales(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  service_description TEXT,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  monthly_amount NUMERIC DEFAULT 0,
  billing_day INTEGER NOT NULL DEFAULT 1,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  next_billing_date DATE,
  last_billed_date DATE,
  recurrence_type TEXT NOT NULL DEFAULT 'receita',
  service_id UUID REFERENCES public.custom_services(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.recurring_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can manage recurring services" ON public.recurring_services FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Recurring receivables
CREATE TABLE IF NOT EXISTS public.recurring_receivables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recurring_service_id UUID NOT NULL REFERENCES public.recurring_services(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  due_date DATE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  paid_amount NUMERIC(10,2) DEFAULT 0,
  payment_method TEXT,
  notes TEXT,
  billing_period_start DATE,
  billing_period_end DATE,
  status TEXT DEFAULT 'pending',
  paid_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.recurring_receivables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can manage recurring receivables" ON public.recurring_receivables FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Marketing reports
CREATE TABLE IF NOT EXISTS public.marketing_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  report_period_start DATE NOT NULL,
  report_period_end DATE NOT NULL,
  report_type TEXT NOT NULL DEFAULT 'weekly',
  ad_sets_count INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr DECIMAL(5,2) DEFAULT 0,
  cpc DECIMAL(10,2) DEFAULT 0,
  spend DECIMAL(10,2) DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  cost_per_conversion DECIMAL(10,2) DEFAULT 0,
  roas DECIMAL(5,2) DEFAULT 0,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.marketing_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage marketing reports" ON public.marketing_reports FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Leads IA
CREATE TABLE IF NOT EXISTS public.leads_ia (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT,
  lead_status TEXT NOT NULL DEFAULT 'new',
  source_page TEXT NOT NULL DEFAULT 'ai_landing',
  notes TEXT,
  segment TEXT,
  monthly_clients INTEGER,
  qualification_score INTEGER DEFAULT 0,
  agent_conversation_status TEXT DEFAULT 'not_started',
  diagnostic_answers JSONB DEFAULT '{}'::jsonb,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.leads_ia ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage ia leads" ON public.leads_ia FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Allow public inserts for ia forms" ON public.leads_ia FOR INSERT WITH CHECK (true);

-- System settings
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage system settings" ON public.system_settings FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Notification logs
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  data JSONB,
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view notification logs" ON public.notification_logs FOR SELECT USING (public.is_admin(auth.uid()));

-- Senvia assistant subscriptions
CREATE TABLE IF NOT EXISTS public.senvia_assistant_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  plan_type TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.senvia_assistant_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage assistant subs" ON public.senvia_assistant_subscriptions FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Customer calendar integrations
CREATE TABLE IF NOT EXISTS public.customer_calendar_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL DEFAULT 'google',
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  calendar_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.customer_calendar_integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own calendar" ON public.customer_calendar_integrations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Sale number generation function
CREATE OR REPLACE FUNCTION public.generate_sale_number()
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  current_year TEXT;
  sale_count INTEGER;
  sale_number TEXT;
BEGIN
  current_year := EXTRACT(YEAR FROM NOW())::TEXT;
  SELECT COUNT(*) + 1 INTO sale_count FROM public.sales WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  sale_number := 'VD' || current_year || '-' || LPAD(sale_count::TEXT, 4, '0');
  RETURN sale_number;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_sale_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.sale_number IS NULL OR NEW.sale_number = '' THEN
    NEW.sale_number := public.generate_sale_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_sale_number BEFORE INSERT ON public.sales FOR EACH ROW EXECUTE FUNCTION public.set_sale_number();

-- Add admin policy for products (admin full access)
CREATE POLICY "Admins can manage all products" ON public.products FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage all plans" ON public.product_plans FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage all subscriptions" ON public.customer_subscriptions FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Realtime for unified_leads
ALTER PUBLICATION supabase_realtime ADD TABLE public.unified_leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales;
