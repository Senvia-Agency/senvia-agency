-- Corrigir search_path nas funções criadas para segurança
CREATE OR REPLACE FUNCTION calculate_next_billing_date(billing_day INTEGER)
RETURNS DATE 
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  next_date DATE;
  current_month_date DATE;
BEGIN
  current_month_date := DATE_TRUNC('month', CURRENT_DATE) + (billing_day - 1) * INTERVAL '1 day';
  
  IF current_month_date <= CURRENT_DATE THEN
    next_date := DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') + (billing_day - 1) * INTERVAL '1 day';
  ELSE
    next_date := current_month_date;
  END IF;
  
  RETURN next_date;
END;
$$;

CREATE OR REPLACE FUNCTION migrate_missing_recurring_services()
RETURNS INTEGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  services_created INTEGER := 0;
BEGIN
  INSERT INTO public.recurring_services (
    customer_id, sale_id, service_name, service_description,
    amount, billing_day, start_date, next_billing_date,
    recurrence_type, status
  )
  SELECT 
    s.customer_id, s.id, s.service_name,
    COALESCE(s.service_description, s.service_name),
    s.total_value, s.recurring_billing_day, s.recurring_start_date,
    CASE 
      WHEN s.recurring_start_date > CURRENT_DATE THEN s.recurring_start_date
      ELSE calculate_next_billing_date(s.recurring_billing_day)
    END,
    'receita', 'active'
  FROM public.sales s
  WHERE s.is_recurring = true
    AND s.customer_id IS NOT NULL
    AND s.recurring_billing_day IS NOT NULL
    AND s.recurring_start_date IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.recurring_services rs WHERE rs.sale_id = s.id
    );
  
  GET DIAGNOSTICS services_created = ROW_COUNT;
  RAISE NOTICE 'Criados % recurring_services', services_created;
  RETURN services_created;
END;
$$;

CREATE OR REPLACE FUNCTION auto_create_recurring_service()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.is_recurring = true 
     AND NEW.customer_id IS NOT NULL 
     AND NEW.recurring_billing_day IS NOT NULL 
     AND NEW.recurring_start_date IS NOT NULL THEN
    
    IF NOT EXISTS (
      SELECT 1 FROM public.recurring_services WHERE sale_id = NEW.id
    ) THEN
      INSERT INTO public.recurring_services (
        customer_id, sale_id, service_name, service_description,
        amount, billing_day, start_date, next_billing_date,
        recurrence_type, status
      ) VALUES (
        NEW.customer_id, NEW.id, NEW.service_name,
        COALESCE(NEW.service_description, NEW.service_name),
        NEW.total_value, NEW.recurring_billing_day, NEW.recurring_start_date,
        CASE 
          WHEN NEW.recurring_start_date > CURRENT_DATE THEN NEW.recurring_start_date
          ELSE calculate_next_billing_date(NEW.recurring_billing_day)
        END,
        'receita', 'active'
      );
      
      IF NEW.payment_status = 'pending' THEN
        NEW.payment_status := 'recurring';
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;