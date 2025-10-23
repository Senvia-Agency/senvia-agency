-- Adicionar campo recurrence_type à tabela recurring_services
ALTER TABLE recurring_services 
ADD COLUMN recurrence_type TEXT NOT NULL DEFAULT 'receita' 
CHECK (recurrence_type IN ('receita', 'despesa'));

-- Tornar customer_id opcional (despesas podem não ter cliente)
ALTER TABLE recurring_services 
ALTER COLUMN customer_id DROP NOT NULL;

-- Remover função antiga
DROP FUNCTION IF EXISTS public.get_recurring_stats();

-- Criar nova função get_recurring_stats com novos campos
CREATE OR REPLACE FUNCTION public.get_recurring_stats()
RETURNS TABLE(
  total_active_services INTEGER,
  total_active_revenue_services INTEGER,
  total_active_expense_services INTEGER,
  total_monthly_revenue NUMERIC,
  total_monthly_expenses NUMERIC,
  net_monthly_balance NUMERIC,
  pending_receivables_count INTEGER,
  pending_receivables_amount NUMERIC,
  overdue_receivables_count INTEGER,
  overdue_receivables_amount NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*)::INTEGER FROM public.recurring_services WHERE status = 'active') as total_active_services,
    (SELECT COUNT(*)::INTEGER FROM public.recurring_services WHERE status = 'active' AND recurrence_type = 'receita') as total_active_revenue_services,
    (SELECT COUNT(*)::INTEGER FROM public.recurring_services WHERE status = 'active' AND recurrence_type = 'despesa') as total_active_expense_services,
    (SELECT COALESCE(SUM(amount), 0) FROM public.recurring_services WHERE status = 'active' AND recurrence_type = 'receita') as total_monthly_revenue,
    (SELECT COALESCE(SUM(amount), 0) FROM public.recurring_services WHERE status = 'active' AND recurrence_type = 'despesa') as total_monthly_expenses,
    (SELECT COALESCE(SUM(CASE WHEN recurrence_type = 'receita' THEN amount ELSE -amount END), 0) FROM public.recurring_services WHERE status = 'active') as net_monthly_balance,
    (SELECT COUNT(*)::INTEGER FROM public.recurring_receivables WHERE payment_status = 'pending') as pending_receivables_count,
    (SELECT COALESCE(SUM(amount), 0) FROM public.recurring_receivables WHERE payment_status = 'pending') as pending_receivables_amount,
    (SELECT COUNT(*)::INTEGER FROM public.recurring_receivables WHERE payment_status = 'overdue') as overdue_receivables_count,
    (SELECT COALESCE(SUM(amount), 0) FROM public.recurring_receivables WHERE payment_status = 'overdue') as overdue_receivables_amount;
END;
$$;

-- Adicionar comentários para documentação
COMMENT ON COLUMN recurring_services.recurrence_type IS 'Tipo de recorrência: receita (serviços/cobranças) ou despesa (pagamentos)';
COMMENT ON COLUMN recurring_services.customer_id IS 'Cliente associado (obrigatório para receitas, opcional para despesas)';