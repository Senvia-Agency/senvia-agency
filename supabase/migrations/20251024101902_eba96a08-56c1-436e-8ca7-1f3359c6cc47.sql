-- Criar função para criar automaticamente recurring_service quando uma venda recorrente é inserida
CREATE OR REPLACE FUNCTION public.auto_create_recurring_service()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_billing_date DATE;
BEGIN
  -- Só criar se for recorrente e tiver customer_id
  IF NEW.is_recurring AND NEW.customer_id IS NOT NULL AND NEW.recurring_billing_day IS NOT NULL THEN
    
    -- Calcular próxima data de cobrança
    IF NEW.recurring_start_date IS NOT NULL THEN
      next_billing_date := NEW.recurring_start_date;
    ELSE
      -- Se não tem data de início, usar o próximo billing_day
      next_billing_date := DATE_TRUNC('month', CURRENT_DATE) + (NEW.recurring_billing_day - 1) * INTERVAL '1 day';
      IF next_billing_date <= CURRENT_DATE THEN
        next_billing_date := next_billing_date + INTERVAL '1 month';
      END IF;
    END IF;
    
    -- Inserir recurring_service
    INSERT INTO public.recurring_services (
      recurrence_type,
      customer_id,
      sale_id,
      service_name,
      service_description,
      amount,
      billing_day,
      start_date,
      next_billing_date,
      status
    ) VALUES (
      'receita',
      NEW.customer_id,
      NEW.id,  -- Agora o NEW.id já existe porque é AFTER INSERT
      NEW.service_name,
      NEW.service_description,
      NEW.total_value,
      NEW.recurring_billing_day,
      COALESCE(NEW.recurring_start_date, next_billing_date),
      next_billing_date,
      'active'
    );
    
    -- Atualizar payment_status da venda para 'recurring'
    UPDATE public.sales 
    SET payment_status = 'recurring'
    WHERE id = NEW.id;
    
  END IF;
  
  RETURN NEW;
END;
$$;