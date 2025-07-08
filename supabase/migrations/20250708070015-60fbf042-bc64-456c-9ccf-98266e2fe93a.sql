
-- Criar tabela para relatórios de marketing
CREATE TABLE public.marketing_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  report_period_start DATE NOT NULL,
  report_period_end DATE NOT NULL,
  report_type TEXT NOT NULL DEFAULT 'weekly', -- 'weekly' ou 'monthly'
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
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'final'
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS
ALTER TABLE public.marketing_reports ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para admins
CREATE POLICY "Only admins can view marketing reports" 
  ON public.marketing_reports 
  FOR SELECT 
  USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can insert marketing reports" 
  ON public.marketing_reports 
  FOR INSERT 
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update marketing reports" 
  ON public.marketing_reports 
  FOR UPDATE 
  USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete marketing reports" 
  ON public.marketing_reports 
  FOR DELETE 
  USING (is_admin(auth.uid()));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_marketing_reports_updated_at
  BEFORE UPDATE ON public.marketing_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
