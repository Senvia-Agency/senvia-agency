-- Função auxiliar para calcular próxima data de cobrança
CREATE OR REPLACE FUNCTION calculate_next_billing_date(billing_day INTEGER)
RETURNS DATE AS $$
DECLARE
  next_date DATE;
  current_month_date DATE;
BEGIN
  -- Calcular data no mês atual
  current_month_date := DATE_TRUNC('month', CURRENT_DATE) + (billing_day - 1) * INTERVAL '1 day';
  
  -- Se a data no mês atual já passou, usar próximo mês
  IF current_month_date <= CURRENT_DATE THEN
    next_date := DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') + (billing_day - 1) * INTERVAL '1 day';
  ELSE
    next_date := current_month_date;
  END IF;
  
  RETURN next_date;
END;
$$ LANGUAGE plpgsql;

-- Função de migração para criar recurring_services faltantes
CREATE OR REPLACE FUNCTION migrate_missing_recurring_services()
RETURNS INTEGER AS $$
DECLARE
  services_created INTEGER := 0;
BEGIN
  -- Inserir recurring_services para vendas recorrentes que não têm
  INSERT INTO public.recurring_services (
    customer_id,
    sale_id,
    service_name,
    service_description,
    amount,
    billing_day,
    start_date,
    next_billing_date,
    recurrence_type,
    status
  )
  SELECT 
    s.customer_id,
    s.id,
    s.service_name,
    COALESCE(s.service_description, s.service_name),
    s.total_value,
    s.recurring_billing_day,
    s.recurring_start_date,
    CASE 
      WHEN s.recurring_start_date > CURRENT_DATE THEN s.recurring_start_date
      ELSE calculate_next_billing_date(s.recurring_billing_day)
    END,
    'receita',
    'active'
  FROM public.sales s
  WHERE s.is_recurring = true
    AND s.customer_id IS NOT NULL
    AND s.recurring_billing_day IS NOT NULL
    AND s.recurring_start_date IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.recurring_services rs 
      WHERE rs.sale_id = s.id
    );
  
  GET DIAGNOSTICS services_created = ROW_COUNT;
  
  RAISE NOTICE 'Criados % recurring_services', services_created;
  RETURN services_created;
END;
$$ LANGUAGE plpgsql;

-- Trigger function para criar recurring_service automaticamente
CREATE OR REPLACE FUNCTION auto_create_recurring_service()
RETURNS TRIGGER AS $$
BEGIN
  -- Se a venda é recorrente e tem todos os dados necessários
  IF NEW.is_recurring = true 
     AND NEW.customer_id IS NOT NULL 
     AND NEW.recurring_billing_day IS NOT NULL 
     AND NEW.recurring_start_date IS NOT NULL THEN
    
    -- Verificar se já existe recurring_service para esta venda
    IF NOT EXISTS (
      SELECT 1 FROM public.recurring_services 
      WHERE sale_id = NEW.id
    ) THEN
      -- Criar recurring_service
      INSERT INTO public.recurring_services (
        customer_id,
        sale_id,
        service_name,
        service_description,
        amount,
        billing_day,
        start_date,
        next_billing_date,
        recurrence_type,
        status
      ) VALUES (
        NEW.customer_id,
        NEW.id,
        NEW.service_name,
        COALESCE(NEW.service_description, NEW.service_name),
        NEW.total_value,
        NEW.recurring_billing_day,
        NEW.recurring_start_date,
        CASE 
          WHEN NEW.recurring_start_date > CURRENT_DATE THEN NEW.recurring_start_date
          ELSE calculate_next_billing_date(NEW.recurring_billing_day)
        END,
        'receita',
        'active'
      );
      
      -- Atualizar payment_status da venda para 'recurring' se ainda estiver 'pending'
      IF NEW.payment_status = 'pending' THEN
        NEW.payment_status := 'recurring';
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger na tabela sales
DROP TRIGGER IF EXISTS trigger_auto_create_recurring_service ON public.sales;
CREATE TRIGGER trigger_auto_create_recurring_service
  BEFORE INSERT OR UPDATE ON public.sales
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_recurring_service();

-- Executar migração para corrigir dados históricos
SELECT migrate_missing_recurring_services();