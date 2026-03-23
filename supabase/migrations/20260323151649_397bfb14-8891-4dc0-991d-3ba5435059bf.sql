
CREATE TABLE public.landing_page_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country_code TEXT NOT NULL,
  business_name TEXT,
  website TEXT,
  objective TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  priority INTEGER DEFAULT 1,
  assigned_to TEXT,
  source TEXT DEFAULT 'landing_page',
  notes TEXT,
  last_contact TIMESTAMP WITH TIME ZONE,
  next_followup TIMESTAMP WITH TIME ZONE,
  converted BOOLEAN DEFAULT false,
  conversion_date TIMESTAMP WITH TIME ZONE,
  conversion_value DECIMAL(10,2),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX idx_landing_page_leads_status ON public.landing_page_leads(status);
CREATE INDEX idx_landing_page_leads_created_at ON public.landing_page_leads(created_at);
CREATE INDEX idx_landing_page_leads_email ON public.landing_page_leads(email);
CREATE INDEX idx_landing_page_leads_priority ON public.landing_page_leads(priority);
CREATE INDEX idx_landing_page_leads_assigned_to ON public.landing_page_leads(assigned_to);

CREATE TRIGGER update_landing_page_leads_updated_at
  BEFORE UPDATE ON public.landing_page_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.landing_page_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to landing_page_leads" 
ON public.landing_page_leads 
FOR ALL 
USING (true) 
WITH CHECK (true);
