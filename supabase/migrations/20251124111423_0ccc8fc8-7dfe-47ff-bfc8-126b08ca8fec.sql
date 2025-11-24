-- Atualizar função notify_sale_completed para usar payment_status
CREATE OR REPLACE FUNCTION public.notify_sale_completed()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Notificar quando uma venda é marcada como paga
  IF TG_OP = 'UPDATE' AND OLD.payment_status != 'paid' AND NEW.payment_status = 'paid' THEN
    PERFORM public.send_notification(
      'sale_completed',
      '💰 Venda Concluída: ' || NEW.sale_number,
      jsonb_build_object(
        'id', NEW.id,
        'sale_number', NEW.sale_number,
        'customer_name', (SELECT full_name FROM customers WHERE id = NEW.customer_id),
        'service_name', NEW.service_name,
        'total_value', NEW.total_value,
        'payment_status', NEW.payment_status,
        'completed_at', NEW.updated_at
      )
    );
  END IF;
  
  RETURN NEW;
END;
$function$;