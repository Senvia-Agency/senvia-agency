-- Criar trigger para webhook automático quando lead_ia é criado
CREATE OR REPLACE FUNCTION public.notify_new_ia_lead()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  webhook_url TEXT;
BEGIN
  -- URL da edge function webhook
  webhook_url := 'https://rvrulhbgkdvnrkhzibif.supabase.co/functions/v1/webhook-new-ia-lead';
  
  -- Chamar edge function via HTTP POST
  PERFORM net.http_post(
    url := webhook_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cnVsaGJna2R2bnJraHppYmlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NjUwNTMsImV4cCI6MjA2NDI0MTA1M30.rdFmwp4AVzRXenUd_bx1-e90m8GPxHGLX_bk9rrzZtU'
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'record', row_to_json(NEW)
    )
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log erro mas não bloqueia inserção
  RAISE WARNING 'Erro ao chamar webhook: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Criar trigger
DROP TRIGGER IF EXISTS on_ia_lead_created ON public.leads_ia;
CREATE TRIGGER on_ia_lead_created
  AFTER INSERT ON public.leads_ia
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_ia_lead();