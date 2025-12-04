-- Função que sincroniza unified_leads -> leads_ia
CREATE OR REPLACE FUNCTION sync_unified_to_leads_ia()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Se o lead veio da página promo_agente_whatsapp, sincronizar com leads_ia
  IF NEW.source_page = 'promo_agente_whatsapp' THEN
    UPDATE leads_ia 
    SET 
      lead_status = NEW.lead_status,
      notes = COALESCE(NEW.notes, leads_ia.notes),
      updated_at = NOW()
    WHERE email = NEW.email
      AND source_page = 'promo_agente_whatsapp';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger que dispara após UPDATE em unified_leads
DROP TRIGGER IF EXISTS sync_unified_lead_to_ia ON unified_leads;
CREATE TRIGGER sync_unified_lead_to_ia
AFTER UPDATE ON unified_leads
FOR EACH ROW
EXECUTE FUNCTION sync_unified_to_leads_ia();

-- Corrigir leads existentes que estão dessincronizados
UPDATE leads_ia li
SET 
  lead_status = ul.lead_status,
  updated_at = NOW()
FROM unified_leads ul
WHERE li.email = ul.email
  AND ul.source_page = 'promo_agente_whatsapp'
  AND li.source_page = 'promo_agente_whatsapp'
  AND li.lead_status != ul.lead_status;