-- Criar trigger para notificar novos leads na tabela unified_leads
CREATE OR REPLACE TRIGGER trigger_notify_new_unified_lead
  AFTER INSERT ON public.unified_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_lead();

-- Verificar se o trigger já existe para a tabela payments
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'trigger_notify_payment_received' 
        AND tgrelid = 'public.payments'::regclass
    ) THEN
        CREATE TRIGGER trigger_notify_payment_received
        AFTER UPDATE ON public.payments
        FOR EACH ROW
        EXECUTE FUNCTION public.notify_payment_received();
    END IF;
END $$;

-- Verificar se o trigger já existe para a tabela sales
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'trigger_notify_sale_completed' 
        AND tgrelid = 'public.sales'::regclass
    ) THEN
        CREATE TRIGGER trigger_notify_sale_completed
        AFTER UPDATE ON public.sales
        FOR EACH ROW
        EXECUTE FUNCTION public.notify_sale_completed();
    END IF;
END $$;

-- Verificar se o trigger já existe para a tabela customers
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'trigger_notify_customer_updated' 
        AND tgrelid = 'public.customers'::regclass
    ) THEN
        CREATE TRIGGER trigger_notify_customer_updated
        AFTER UPDATE ON public.customers
        FOR EACH ROW
        EXECUTE FUNCTION public.notify_customer_updated();
    END IF;
END $$;