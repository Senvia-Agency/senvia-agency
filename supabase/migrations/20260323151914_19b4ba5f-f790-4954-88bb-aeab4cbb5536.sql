
-- Add stripe columns to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stripe_product_id TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS service_type TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images TEXT[];

CREATE INDEX IF NOT EXISTS idx_products_stripe_id ON public.products(stripe_product_id);
CREATE INDEX IF NOT EXISTS idx_products_service_type ON public.products(service_type);

-- Admin metrics
CREATE TABLE IF NOT EXISTS public.admin_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL,
  metric_value DECIMAL(10,2) NOT NULL,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view metrics" ON public.admin_metrics FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Only admins can insert metrics" ON public.admin_metrics FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- Lead notes
CREATE TABLE IF NOT EXISTS public.lead_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL,
  lead_type TEXT NOT NULL,
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  note_type TEXT NOT NULL DEFAULT 'note',
  content TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can manage lead notes" ON public.lead_notes FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Admin settings
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  settings_key TEXT NOT NULL,
  settings_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(admin_user_id, settings_key)
);
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage their own settings" ON public.admin_settings FOR ALL USING (public.is_admin(auth.uid()) AND admin_user_id = auth.uid()) WITH CHECK (public.is_admin(auth.uid()) AND admin_user_id = auth.uid());

-- Unified leads
CREATE TABLE public.unified_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country_code TEXT DEFAULT '+351',
  company_name TEXT,
  website TEXT,
  source_page TEXT NOT NULL,
  interest_type TEXT NOT NULL,
  objective TEXT,
  main_product_service TEXT,
  target_audience TEXT,
  lead_status TEXT NOT NULL DEFAULT 'new',
  priority INTEGER DEFAULT 1,
  assigned_to TEXT,
  notes TEXT,
  last_contact TIMESTAMP WITH TIME ZONE,
  next_followup TIMESTAMP WITH TIME ZONE,
  converted BOOLEAN DEFAULT false,
  conversion_date TIMESTAMP WITH TIME ZONE,
  conversion_value DECIMAL(10,2),
  payment_status TEXT DEFAULT 'pending',
  stripe_session_id TEXT,
  stripe_customer_id TEXT,
  stripe_payment_id TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_address TEXT,
  user_agent TEXT,
  call_to_action TEXT,
  client_testimonials TEXT,
  competitive_advantage TEXT,
  desired_style TEXT,
  social_networks TEXT,
  contact_channels JSONB,
  logo_images JSONB,
  data_consent BOOLEAN DEFAULT false,
  plan TEXT,
  temperature TEXT DEFAULT 'cold'
);
ALTER TABLE public.unified_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view unified_leads" ON public.unified_leads FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Only admins can update unified_leads" ON public.unified_leads FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Only admins can delete unified_leads" ON public.unified_leads FOR DELETE USING (public.is_admin(auth.uid()));
CREATE POLICY "Allow public inserts for forms" ON public.unified_leads FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE INDEX idx_unified_leads_status ON public.unified_leads(lead_status);
CREATE INDEX idx_unified_leads_source ON public.unified_leads(source_page);
CREATE INDEX idx_unified_leads_email ON public.unified_leads(email);
CREATE INDEX idx_unified_leads_plan ON public.unified_leads(plan);

CREATE TRIGGER update_unified_leads_updated_at BEFORE UPDATE ON public.unified_leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Customers
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  company_name TEXT,
  website TEXT,
  original_lead_id UUID REFERENCES public.unified_leads(id),
  acquisition_source TEXT,
  acquisition_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  customer_status TEXT NOT NULL DEFAULT 'active',
  customer_tier TEXT NOT NULL DEFAULT 'standard',
  total_spent DECIMAL(10,2) DEFAULT 0,
  project_status TEXT DEFAULT 'pending',
  stripe_customer_id TEXT,
  notes TEXT,
  objective TEXT,
  main_product_service TEXT
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can manage customers" ON public.customers FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE INDEX idx_customers_status ON public.customers(customer_status);
CREATE INDEX idx_customers_email ON public.customers(email);

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Customer transactions
CREATE TABLE public.customer_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'pending',
  description TEXT,
  stripe_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.customer_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can manage customer_transactions" ON public.customer_transactions FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Payments
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_type TEXT,
  stripe_payment_id TEXT,
  stripe_session_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Only admins can manage all payments" ON public.payments FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Financial movements
CREATE TABLE public.financial_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  customer_id UUID REFERENCES public.customers(id),
  reference_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.financial_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can manage financial_movements" ON public.financial_movements FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER update_financial_movements_updated_at BEFORE UPDATE ON public.financial_movements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
