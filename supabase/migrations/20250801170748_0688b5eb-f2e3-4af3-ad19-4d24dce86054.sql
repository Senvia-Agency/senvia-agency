-- Create trigger function to automatically migrate IA leads to unified_leads
CREATE OR REPLACE FUNCTION migrate_ia_lead_to_unified()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into unified_leads table
  INSERT INTO public.unified_leads (
    full_name,
    email, 
    phone,
    company_name,
    source_page,
    interest_type,
    lead_status,
    notes,
    created_at,
    updated_at
  ) VALUES (
    NEW.full_name,
    NEW.email,
    NEW.whatsapp,
    NEW.company_name,
    NEW.source_page,
    'ai_consultation',
    NEW.lead_status,
    NEW.notes,
    NEW.created_at,
    NEW.updated_at
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically migrate IA leads when inserted
CREATE TRIGGER migrate_ia_leads_trigger
  AFTER INSERT ON public.leads_ia
  FOR EACH ROW
  EXECUTE FUNCTION migrate_ia_lead_to_unified();

-- Migrate existing IA leads to unified_leads (only if they don't exist already)
INSERT INTO public.unified_leads (
  full_name,
  email,
  phone,
  company_name,
  source_page,
  interest_type,
  lead_status,
  notes,
  created_at,
  updated_at
)
SELECT 
  full_name,
  email,
  whatsapp as phone,
  company_name,
  source_page,
  'ai_consultation' as interest_type,
  lead_status,
  notes,
  created_at,
  updated_at
FROM public.leads_ia
WHERE NOT EXISTS (
  SELECT 1 FROM public.unified_leads 
  WHERE unified_leads.email = leads_ia.email 
  AND unified_leads.source_page = leads_ia.source_page
);

-- Also add trigger for notifications on IA leads
CREATE TRIGGER notify_new_ia_lead_trigger
  AFTER INSERT ON public.leads_ia
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_lead();