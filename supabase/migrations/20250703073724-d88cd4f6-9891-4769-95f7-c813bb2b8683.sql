
-- Criar tabela para armazenar recorrências de serviços
CREATE TABLE public.recurring_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) NOT NULL,
  service_id UUID REFERENCES public.custom_services(id),
  service_name TEXT NOT NULL,
  service_description TEXT,
  monthly_amount NUMERIC NOT NULL DEFAULT 0,
  billing_day INTEGER NOT NULL DEFAULT 1, -- Dia do mês para cobrança (1-28)
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE, -- NULL = indefinido
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  next_billing_date DATE NOT NULL,
  last_billed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Criar tabela para armazenar as contas recorrentes geradas
CREATE TABLE public.recurring_receivables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recurring_service_id UUID REFERENCES public.recurring_services(id) NOT NULL,
  customer_id UUID REFERENCES public.customers(id) NOT NULL,
  amount NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  paid_date DATE,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS para recurring_services
ALTER TABLE public.recurring_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage recurring services"
  ON public.recurring_services
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Adicionar RLS para recurring_receivables
ALTER TABLE public.recurring_receivables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage recurring receivables"
  ON public.recurring_receivables
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Função para calcular próxima data de cobrança
CREATE OR REPLACE FUNCTION public.calculate_next_billing_date(
  current_date DATE,
  billing_day INTEGER
) RETURNS DATE
LANGUAGE plpgsql
AS $$
DECLARE
  next_date DATE;
  current_month INTEGER;
  current_year INTEGER;
BEGIN
  current_month := EXTRACT(MONTH FROM current_date);
  current_year := EXTRACT(YEAR FROM current_date);
  
  -- Tentar criar data com o dia de cobrança no mês atual
  next_date := make_date(current_year, current_month, LEAST(billing_day, 28));
  
  -- Se a data já passou, usar o próximo mês
  IF next_date <= current_date THEN
    IF current_month = 12 THEN
      next_date := make_date(current_year + 1, 1, LEAST(billing_day, 28));
    ELSE
      next_date := make_date(current_year, current_month + 1, LEAST(billing_day, 28));
    END IF;
  END IF;
  
  RETURN next_date;
END;
$$;

-- Função para gerar contas recorrentes
CREATE OR REPLACE FUNCTION public.generate_recurring_receivables()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  recurring_service RECORD;
  generated_count INTEGER := 0;
  period_start DATE;
  period_end DATE;
BEGIN
  -- Buscar serviços recorrentes ativos que precisam de cobrança
  FOR recurring_service IN
    SELECT *
    FROM public.recurring_services
    WHERE status = 'active'
    AND next_billing_date <= CURRENT_DATE
    AND (end_date IS NULL OR end_date >= CURRENT_DATE)
  LOOP
    -- Calcular período da cobrança
    period_start := recurring_service.next_billing_date;
    period_end := (period_start + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
    
    -- Verificar se já existe uma conta para este período
    IF NOT EXISTS (
      SELECT 1 FROM public.recurring_receivables
      WHERE recurring_service_id = recurring_service.id
      AND billing_period_start = period_start
    ) THEN
      -- Criar nova conta a receber
      INSERT INTO public.recurring_receivables (
        recurring_service_id,
        customer_id,
        amount,
        due_date,
        billing_period_start,
        billing_period_end,
        status
      ) VALUES (
        recurring_service.id,
        recurring_service.customer_id,
        recurring_service.monthly_amount,
        recurring_service.next_billing_date,
        period_start,
        period_end,
        'pending'
      );
      
      generated_count := generated_count + 1;
    END IF;
    
    -- Atualizar próxima data de cobrança
    UPDATE public.recurring_services
    SET 
      next_billing_date = calculate_next_billing_date(next_billing_date, billing_day),
      last_billed_date = recurring_service.next_billing_date,
      updated_at = now()
    WHERE id = recurring_service.id;
  END LOOP;
  
  -- Atualizar status para overdue das contas em atraso
  UPDATE public.recurring_receivables
  SET status = 'overdue', updated_at = now()
  WHERE status = 'pending'
  AND due_date < CURRENT_DATE;
  
  RETURN generated_count;
END;
$$;

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_recurring_services_updated_at
  BEFORE UPDATE ON public.recurring_services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recurring_receivables_updated_at
  BEFORE UPDATE ON public.recurring_receivables
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Função para buscar estatísticas de recorrências
CREATE OR REPLACE FUNCTION public.get_recurring_stats()
RETURNS TABLE(
  total_active_services INTEGER,
  total_monthly_revenue NUMERIC,
  overdue_count INTEGER,
  overdue_amount NUMERIC,
  next_week_due_count INTEGER,
  next_week_due_amount NUMERIC
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::INTEGER FROM public.recurring_services WHERE status = 'active') as total_active_services,
    (SELECT COALESCE(SUM(monthly_amount), 0) FROM public.recurring_services WHERE status = 'active') as total_monthly_revenue,
    (SELECT COUNT(*)::INTEGER FROM public.recurring_receivables WHERE status = 'overdue') as overdue_count,
    (SELECT COALESCE(SUM(amount), 0) FROM public.recurring_receivables WHERE status = 'overdue') as overdue_amount,
    (SELECT COUNT(*)::INTEGER FROM public.recurring_receivables WHERE status = 'pending' AND due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days') as next_week_due_count,
    (SELECT COALESCE(SUM(amount), 0) FROM public.recurring_receivables WHERE status = 'pending' AND due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days') as next_week_due_amount;
END;
$$;
