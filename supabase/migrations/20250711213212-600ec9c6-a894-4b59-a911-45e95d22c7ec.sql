-- Criar tabela para log de notificações enviadas
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'sent',
  brevo_message_id TEXT,
  error_message TEXT,
  entity_id UUID,
  entity_type TEXT
);

-- Ativar RLS
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Política para administradores
CREATE POLICY "Only admins can view notification logs"
ON public.notification_logs
FOR SELECT
USING (is_admin(auth.uid()));

-- Função para enviar notificação via edge function
CREATE OR REPLACE FUNCTION public.send_notification(
  notification_type TEXT,
  notification_subject TEXT,
  notification_data JSONB,
  recipient_email TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  webhook_url TEXT;
BEGIN
  -- Construir URL da edge function
  webhook_url := 'https://rvrulhbgkdvnrkhzibif.supabase.co/functions/v1/send-notification-email';
  
  -- Fazer chamada HTTP para a edge function
  PERFORM net.http_post(
    url := webhook_url,
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cnVsaGJna2R2bnJraHppYmlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NjUwNTMsImV4cCI6MjA2NDI0MTA1M30.rdFmwp4AVzRXenUd_bx1-e90m8GPxHGLX_bk9rrzZtU"}'::JSONB,
    body := jsonb_build_object(
      'type', notification_type,
      'subject', notification_subject,
      'data', notification_data,
      'to_email', recipient_email
    )
  );
  
  -- Log da notificação
  INSERT INTO public.notification_logs (
    notification_type,
    recipient_email,
    subject,
    entity_type
  ) VALUES (
    notification_type,
    COALESCE(recipient_email, 'admin@senvia.pt'),
    notification_subject,
    'automated'
  );
  
EXCEPTION WHEN OTHERS THEN
  -- Log do erro
  INSERT INTO public.notification_logs (
    notification_type,
    recipient_email,
    subject,
    status,
    error_message,
    entity_type
  ) VALUES (
    notification_type,
    COALESCE(recipient_email, 'admin@senvia.pt'),
    notification_subject,
    'failed',
    SQLERRM,
    'automated'
  );
END;
$$;

-- Trigger para novos leads
CREATE OR REPLACE FUNCTION public.notify_new_lead()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Verificar se é um lead novo (não uma atualização)
  IF TG_OP = 'INSERT' THEN
    PERFORM public.send_notification(
      'new_lead',
      '🎯 Novo Lead Recebido: ' || NEW.full_name,
      jsonb_build_object(
        'id', NEW.id,
        'full_name', NEW.full_name,
        'email', NEW.email,
        'phone', NEW.phone,
        'company_name', NEW.company_name,
        'interest_type', NEW.interest_type,
        'source_page', NEW.source_page,
        'created_at', NEW.created_at
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger para vendas concluídas
CREATE OR REPLACE FUNCTION public.notify_sale_completed()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Notificar quando uma venda é marcada como concluída
  IF TG_OP = 'UPDATE' AND OLD.sale_status != 'completed' AND NEW.sale_status = 'completed' THEN
    PERFORM public.send_notification(
      'sale_completed',
      '💰 Venda Concluída: ' || NEW.sale_number,
      jsonb_build_object(
        'id', NEW.id,
        'sale_number', NEW.sale_number,
        'customer_name', (SELECT full_name FROM customers WHERE id = NEW.customer_id),
        'service_name', NEW.service_name,
        'total_value', NEW.total_value,
        'sale_status', NEW.sale_status,
        'completed_at', NEW.updated_at
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger para pagamentos recebidos
CREATE OR REPLACE FUNCTION public.notify_payment_received()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Notificar quando um pagamento é marcado como pago
  IF TG_OP = 'UPDATE' AND OLD.status != 'paid' AND NEW.status = 'paid' THEN
    PERFORM public.send_notification(
      'payment_received',
      '✅ Pagamento Recebido: €' || NEW.amount,
      jsonb_build_object(
        'id', NEW.id,
        'email', NEW.email,
        'amount', NEW.amount,
        'status', NEW.status,
        'created_at', NEW.created_at
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger para clientes atualizados importantes
CREATE OR REPLACE FUNCTION public.notify_customer_updated()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Notificar apenas para mudanças importantes (status, tier)
  IF TG_OP = 'UPDATE' AND (
    OLD.customer_status != NEW.customer_status OR 
    OLD.customer_tier != NEW.customer_tier
  ) THEN
    PERFORM public.send_notification(
      'customer_updated',
      '👤 Cliente Atualizado: ' || NEW.full_name,
      jsonb_build_object(
        'id', NEW.id,
        'full_name', NEW.full_name,
        'email', NEW.email,
        'customer_status', NEW.customer_status,
        'customer_tier', NEW.customer_tier,
        'updated_at', NEW.updated_at
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar os triggers
DROP TRIGGER IF EXISTS trigger_notify_new_lead ON public.unified_leads;
CREATE TRIGGER trigger_notify_new_lead
  AFTER INSERT ON public.unified_leads
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_lead();

DROP TRIGGER IF EXISTS trigger_notify_sale_completed ON public.sales;
CREATE TRIGGER trigger_notify_sale_completed
  AFTER UPDATE ON public.sales
  FOR EACH ROW EXECUTE FUNCTION public.notify_sale_completed();

DROP TRIGGER IF EXISTS trigger_notify_payment_received ON public.payments;
CREATE TRIGGER trigger_notify_payment_received
  AFTER UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.notify_payment_received();

DROP TRIGGER IF EXISTS trigger_notify_customer_updated ON public.customers;
CREATE TRIGGER trigger_notify_customer_updated
  AFTER UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.notify_customer_updated();