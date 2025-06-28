
-- Atualizar tabela products para melhor integração com Stripe
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stripe_product_id TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS service_type TEXT; -- 'landing_page', 'senvia_assistant', 'custom'

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_products_stripe_id ON public.products(stripe_product_id);
CREATE INDEX IF NOT EXISTS idx_products_service_type ON public.products(service_type);

-- Tabela para tracking de métricas do dashboard
CREATE TABLE IF NOT EXISTS public.admin_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL, -- 'revenue', 'leads', 'conversions', 'subscriptions'
  metric_value DECIMAL(10,2) NOT NULL,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para notas e follow-ups de leads
CREATE TABLE IF NOT EXISTS public.lead_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL, -- Pode referenciar leads de diferentes tabelas
  lead_type TEXT NOT NULL, -- 'landing_page', 'senvia_landing_page', 'custom'
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  note_type TEXT NOT NULL DEFAULT 'note', -- 'note', 'follow_up', 'call_scheduled', 'email_sent'
  content TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para configurações do admin
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  settings_key TEXT NOT NULL,
  settings_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(admin_user_id, settings_key)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_admin_metrics_type ON public.admin_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_admin_metrics_period ON public.admin_metrics(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON public.lead_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_notes_type ON public.lead_notes(lead_type);
CREATE INDEX IF NOT EXISTS idx_lead_notes_scheduled ON public.lead_notes(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_admin_settings_user ON public.admin_settings(admin_user_id);

-- Triggers para updated_at (syntax corrigida)
DROP TRIGGER IF EXISTS update_lead_notes_updated_at ON public.lead_notes;
CREATE TRIGGER update_lead_notes_updated_at
  BEFORE UPDATE ON public.lead_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_settings_updated_at ON public.admin_settings;
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies (apenas admins podem acessar)
ALTER TABLE public.admin_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para admin_metrics
CREATE POLICY "Only admins can view metrics" 
ON public.admin_metrics 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert metrics" 
ON public.admin_metrics 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

-- Políticas para lead_notes
CREATE POLICY "Only admins can view lead notes" 
ON public.lead_notes 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert lead notes" 
ON public.lead_notes 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update lead notes" 
ON public.lead_notes 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete lead notes" 
ON public.lead_notes 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Políticas para admin_settings
CREATE POLICY "Admins can view their own settings" 
ON public.admin_settings 
FOR SELECT 
USING (public.is_admin(auth.uid()) AND admin_user_id = auth.uid());

CREATE POLICY "Admins can insert their own settings" 
ON public.admin_settings 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()) AND admin_user_id = auth.uid());

CREATE POLICY "Admins can update their own settings" 
ON public.admin_settings 
FOR UPDATE 
USING (public.is_admin(auth.uid()) AND admin_user_id = auth.uid());

-- Função para calcular métricas de receita
CREATE OR REPLACE FUNCTION public.calculate_revenue_metrics(
  start_date TIMESTAMP WITH TIME ZONE DEFAULT (now() - interval '30 days'),
  end_date TIMESTAMP WITH TIME ZONE DEFAULT now()
)
RETURNS TABLE (
  total_revenue DECIMAL(10,2),
  landing_page_revenue DECIMAL(10,2),
  subscription_revenue DECIMAL(10,2),
  total_transactions INTEGER,
  avg_transaction_value DECIMAL(10,2)
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(p.amount)::DECIMAL(10,2) / 100, 0) as total_revenue,
    COALESCE(SUM(CASE WHEN p.amount = 499 THEN p.amount ELSE 0 END)::DECIMAL(10,2) / 100, 0) as landing_page_revenue,
    COALESCE(SUM(CASE WHEN p.amount = 2000 THEN p.amount ELSE 0 END)::DECIMAL(10,2) / 100, 0) as subscription_revenue,
    COUNT(*)::INTEGER as total_transactions,
    COALESCE(AVG(p.amount)::DECIMAL(10,2) / 100, 0) as avg_transaction_value
  FROM public.payments p
  WHERE p.created_at >= start_date 
    AND p.created_at <= end_date
    AND p.status = 'paid';
END;
$$;

-- Função para estatísticas de leads
CREATE OR REPLACE FUNCTION public.get_leads_stats(
  start_date TIMESTAMP WITH TIME ZONE DEFAULT (now() - interval '30 days'),
  end_date TIMESTAMP WITH TIME ZONE DEFAULT now()
)
RETURNS TABLE (
  total_leads INTEGER,
  landing_page_leads INTEGER,
  senvia_landing_leads INTEGER,
  conversion_rate DECIMAL(5,2),
  pending_leads INTEGER
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (
      (SELECT COUNT(*) FROM public.leads WHERE created_at >= start_date AND created_at <= end_date) +
      (SELECT COUNT(*) FROM public.landing_page_leads WHERE created_at >= start_date AND created_at <= end_date)
    )::INTEGER as total_leads,
    (SELECT COUNT(*) FROM public.leads WHERE created_at >= start_date AND created_at <= end_date)::INTEGER as landing_page_leads,
    (SELECT COUNT(*) FROM public.landing_page_leads WHERE created_at >= start_date AND created_at <= end_date)::INTEGER as senvia_landing_leads,
    CASE 
      WHEN (SELECT COUNT(*) FROM public.leads WHERE created_at >= start_date AND created_at <= end_date) > 0 
      THEN (SELECT COUNT(*) FROM public.payments WHERE created_at >= start_date AND created_at <= end_date AND status = 'paid')::DECIMAL / 
           (SELECT COUNT(*) FROM public.leads WHERE created_at >= start_date AND created_at <= end_date)::DECIMAL * 100
      ELSE 0
    END as conversion_rate,
    (
      (SELECT COUNT(*) FROM public.leads WHERE lead_status = 'new') +
      (SELECT COUNT(*) FROM public.landing_page_leads WHERE status = 'new')
    )::INTEGER as pending_leads;
END;
$$;
