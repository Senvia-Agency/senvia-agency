-- Tabela de serviços recorrentes
CREATE TABLE IF NOT EXISTS public.recurring_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  sale_id UUID REFERENCES public.sales(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  service_description TEXT,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  billing_day INTEGER NOT NULL CHECK (billing_day >= 1 AND billing_day <= 28),
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  next_billing_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de cobranças recorrentes geradas
CREATE TABLE IF NOT EXISTS public.recurring_receivables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recurring_service_id UUID NOT NULL REFERENCES public.recurring_services(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  due_date DATE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue', 'cancelled')),
  paid_at TIMESTAMP WITH TIME ZONE,
  paid_amount NUMERIC(10,2) DEFAULT 0,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_recurring_services_customer ON public.recurring_services(customer_id);
CREATE INDEX IF NOT EXISTS idx_recurring_services_status ON public.recurring_services(status);
CREATE INDEX IF NOT EXISTS idx_recurring_services_next_billing ON public.recurring_services(next_billing_date);
CREATE INDEX IF NOT EXISTS idx_recurring_receivables_customer ON public.recurring_receivables(customer_id);
CREATE INDEX IF NOT EXISTS idx_recurring_receivables_status ON public.recurring_receivables(payment_status);
CREATE INDEX IF NOT EXISTS idx_recurring_receivables_due_date ON public.recurring_receivables(due_date);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_recurring_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_recurring_receivables_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS trigger_recurring_services_updated_at ON public.recurring_services;
CREATE TRIGGER trigger_recurring_services_updated_at
  BEFORE UPDATE ON public.recurring_services
  FOR EACH ROW
  EXECUTE FUNCTION update_recurring_services_updated_at();

DROP TRIGGER IF EXISTS trigger_recurring_receivables_updated_at ON public.recurring_receivables;
CREATE TRIGGER trigger_recurring_receivables_updated_at
  BEFORE UPDATE ON public.recurring_receivables
  FOR EACH ROW
  EXECUTE FUNCTION update_recurring_receivables_updated_at();

-- Função para gerar cobranças recorrentes
CREATE OR REPLACE FUNCTION generate_recurring_receivables()
RETURNS TABLE(generated_count INTEGER, service_id UUID, customer_id UUID, due_date DATE, amount NUMERIC) AS $$
DECLARE
  service_record RECORD;
  new_due_date DATE;
  generated INTEGER := 0;
BEGIN
  -- Procurar serviços ativos que precisam gerar cobrança
  FOR service_record IN 
    SELECT * FROM public.recurring_services
    WHERE status = 'active'
    AND (next_billing_date IS NULL OR next_billing_date <= CURRENT_DATE)
    AND (end_date IS NULL OR end_date >= CURRENT_DATE)
  LOOP
    -- Calcular próxima data de vencimento
    IF service_record.next_billing_date IS NULL THEN
      -- Primeira cobrança
      new_due_date := service_record.start_date;
    ELSE
      -- Próxima cobrança (próximo mês, mesmo dia)
      new_due_date := (service_record.next_billing_date + INTERVAL '1 month')::DATE;
      
      -- Ajustar se o dia não existe no próximo mês
      IF EXTRACT(DAY FROM new_due_date) != service_record.billing_day THEN
        new_due_date := DATE_TRUNC('month', new_due_date + INTERVAL '1 month') + (service_record.billing_day - 1) * INTERVAL '1 day';
      END IF;
    END IF;

    -- Criar a cobrança
    INSERT INTO public.recurring_receivables (
      recurring_service_id,
      customer_id,
      due_date,
      amount,
      payment_status
    ) VALUES (
      service_record.id,
      service_record.customer_id,
      new_due_date,
      service_record.amount,
      'pending'
    );

    -- Atualizar next_billing_date do serviço
    UPDATE public.recurring_services
    SET next_billing_date = (new_due_date + INTERVAL '1 month')::DATE
    WHERE id = service_record.id;

    generated := generated + 1;

    RETURN QUERY SELECT 
      generated, 
      service_record.id, 
      service_record.customer_id, 
      new_due_date, 
      service_record.amount;
  END LOOP;

  IF generated = 0 THEN
    RETURN QUERY SELECT 0, NULL::UUID, NULL::UUID, NULL::DATE, NULL::NUMERIC;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Função para obter estatísticas de recorrências
CREATE OR REPLACE FUNCTION get_recurring_stats()
RETURNS TABLE(
  total_active_services INTEGER,
  total_monthly_revenue NUMERIC,
  pending_receivables_count INTEGER,
  pending_receivables_amount NUMERIC,
  overdue_receivables_count INTEGER,
  overdue_receivables_amount NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*)::INTEGER FROM public.recurring_services WHERE status = 'active'),
    (SELECT COALESCE(SUM(amount), 0) FROM public.recurring_services WHERE status = 'active'),
    (SELECT COUNT(*)::INTEGER FROM public.recurring_receivables WHERE payment_status = 'pending'),
    (SELECT COALESCE(SUM(amount), 0) FROM public.recurring_receivables WHERE payment_status = 'pending'),
    (SELECT COUNT(*)::INTEGER FROM public.recurring_receivables WHERE payment_status = 'overdue'),
    (SELECT COALESCE(SUM(amount), 0) FROM public.recurring_receivables WHERE payment_status = 'overdue');
END;
$$ LANGUAGE plpgsql;

-- RLS Policies para recurring_services
ALTER TABLE public.recurring_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only admins can view recurring services" ON public.recurring_services;
CREATE POLICY "Only admins can view recurring services"
  ON public.recurring_services FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Only admins can insert recurring services" ON public.recurring_services;
CREATE POLICY "Only admins can insert recurring services"
  ON public.recurring_services FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Only admins can update recurring services" ON public.recurring_services;
CREATE POLICY "Only admins can update recurring services"
  ON public.recurring_services FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Only admins can delete recurring services" ON public.recurring_services;
CREATE POLICY "Only admins can delete recurring services"
  ON public.recurring_services FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- RLS Policies para recurring_receivables
ALTER TABLE public.recurring_receivables ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only admins can view recurring receivables" ON public.recurring_receivables;
CREATE POLICY "Only admins can view recurring receivables"
  ON public.recurring_receivables FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Only admins can insert recurring receivables" ON public.recurring_receivables;
CREATE POLICY "Only admins can insert recurring receivables"
  ON public.recurring_receivables FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Only admins can update recurring receivables" ON public.recurring_receivables;
CREATE POLICY "Only admins can update recurring receivables"
  ON public.recurring_receivables FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Only admins can delete recurring receivables" ON public.recurring_receivables;
CREATE POLICY "Only admins can delete recurring receivables"
  ON public.recurring_receivables FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));