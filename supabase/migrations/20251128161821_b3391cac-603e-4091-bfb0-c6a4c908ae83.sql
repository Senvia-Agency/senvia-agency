-- Remover trigger que limpa código de país dos telefones
DROP TRIGGER IF EXISTS clean_phone_trigger ON public.unified_leads;

-- Atualizar telefones existentes copiando da leads_ia
UPDATE public.unified_leads ul
SET phone = lia.whatsapp
FROM public.leads_ia lia
WHERE ul.email = lia.email
AND ul.source_page = 'promo_agente_whatsapp'
AND lia.whatsapp IS NOT NULL;