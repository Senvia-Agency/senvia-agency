-- Primeiro, remover a função antiga
DROP FUNCTION IF EXISTS generate_recurring_receivables();

-- Criar nova função com cálculo correto de datas
CREATE OR REPLACE FUNCTION generate_recurring_receivables()
RETURNS INTEGER AS $$
DECLARE
  service_record RECORD;
  new_due_date DATE;
  generated_count INTEGER := 0;
BEGIN
  -- Iterar sobre todos os serviços recorrentes ativos
  FOR service_record IN 
    SELECT * FROM recurring_services 
    WHERE status = 'active'
    AND start_date <= CURRENT_DATE
  LOOP
    -- Calcular próxima data de vencimento baseada no billing_day
    IF service_record.next_billing_date IS NULL THEN
      -- Primeira cobrança: calcular data baseada no billing_day do mês de start_date
      new_due_date := DATE_TRUNC('month', service_record.start_date)::DATE + (service_record.billing_day - 1);
      
      -- Se a data calculada for anterior a start_date, mover para próximo mês
      IF new_due_date < service_record.start_date THEN
        new_due_date := (DATE_TRUNC('month', new_due_date) + INTERVAL '1 month')::DATE + (service_record.billing_day - 1);
      END IF;
    ELSE
      -- Cobranças subsequentes: usar next_billing_date
      new_due_date := service_record.next_billing_date;
    END IF;

    -- Se a data de vencimento ainda não chegou, pular
    IF new_due_date > CURRENT_DATE THEN
      CONTINUE;
    END IF;

    -- Verificar se já existe uma cobrança para esta data
    IF NOT EXISTS (
      SELECT 1 FROM recurring_receivables 
      WHERE recurring_service_id = service_record.id 
      AND due_date = new_due_date
    ) THEN
      -- Criar nova cobrança
      INSERT INTO recurring_receivables (
        recurring_service_id,
        customer_id,
        amount,
        due_date,
        payment_status,
        created_at,
        updated_at
      ) VALUES (
        service_record.id,
        service_record.customer_id,
        service_record.amount,
        new_due_date,
        'pending',
        NOW(),
        NOW()
      );
      
      generated_count := generated_count + 1;
    END IF;

    -- Calcular próxima data de cobrança (sempre para o próximo mês)
    UPDATE recurring_services
    SET next_billing_date = (DATE_TRUNC('month', new_due_date) + INTERVAL '1 month')::DATE + (service_record.billing_day - 1),
        updated_at = NOW()
    WHERE id = service_record.id;
  END LOOP;

  RETURN generated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Corrigir dados existentes: Encontrar e deletar contas duplicadas incorretas
DO $$
DECLARE
  rec RECORD;
  deleted_count INTEGER := 0;
BEGIN
  -- Para cada recurring_service, verificar se existe conta com data errada
  FOR rec IN 
    SELECT 
      rr.id as receivable_id,
      rs.id as service_id,
      rs.billing_day,
      rr.due_date,
      rs.start_date,
      s.sale_date
    FROM recurring_receivables rr
    JOIN recurring_services rs ON rs.id = rr.recurring_service_id
    LEFT JOIN sales s ON s.id = rs.sale_id
    WHERE rr.payment_status = 'pending'
    AND EXTRACT(DAY FROM rr.due_date) != rs.billing_day
    AND s.sale_date IS NOT NULL
    AND rr.due_date::DATE = s.sale_date::DATE
  LOOP
    -- Deletar a conta com data incorreta (data de criação da venda)
    DELETE FROM recurring_receivables WHERE id = rec.receivable_id;
    deleted_count := deleted_count + 1;
    
    RAISE NOTICE 'Deletada conta incorreta: receivable_id=%, due_date=%, billing_day=%', 
      rec.receivable_id, rec.due_date, rec.billing_day;
  END LOOP;
  
  RAISE NOTICE 'Total de contas incorretas deletadas: %', deleted_count;
END $$;