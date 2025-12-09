-- 1. Primeiro remover duplicados em leads_ia (manter o mais antigo)
DELETE FROM leads_ia a
USING leads_ia b
WHERE a.email = b.email 
  AND a.source_page = b.source_page
  AND a.created_at > b.created_at;

-- 2. Remover duplicados em unified_leads para promo_agente_whatsapp
DELETE FROM unified_leads a
USING unified_leads b
WHERE a.email = b.email 
  AND a.source_page = 'promo_agente_whatsapp'
  AND b.source_page = 'promo_agente_whatsapp'
  AND a.created_at > b.created_at;

-- 3. Agora criar índice único para leads_ia
CREATE UNIQUE INDEX IF NOT EXISTS leads_ia_email_source_unique 
ON leads_ia (email, source_page);

-- 4. Criar índice único para unified_leads (promo_agente_whatsapp)
CREATE UNIQUE INDEX IF NOT EXISTS unified_leads_email_promo_unique 
ON unified_leads (email) 
WHERE source_page = 'promo_agente_whatsapp';

-- 5. Atualizar função migrate_ia_lead_to_unified para copiar segment e UTMs
CREATE OR REPLACE FUNCTION migrate_ia_lead_to_unified()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.unified_leads (
    full_name,
    email, 
    phone,
    company_name,
    source_page,
    interest_type,
    main_product_service,
    lead_status,
    notes,
    utm_source,
    utm_medium,
    utm_campaign,
    created_at,
    updated_at
  ) VALUES (
    NEW.full_name,
    NEW.email,
    NEW.whatsapp,
    NEW.company_name,
    NEW.source_page,
    COALESCE(NEW.segment, 'ai_consultation'),
    NEW.segment,
    NEW.lead_status,
    NEW.notes,
    NEW.utm_source,
    NEW.utm_medium,
    NEW.utm_campaign,
    NEW.created_at,
    NEW.updated_at
  )
  ON CONFLICT (email) WHERE source_page = 'promo_agente_whatsapp'
  DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    company_name = EXCLUDED.company_name,
    main_product_service = EXCLUDED.main_product_service,
    interest_type = EXCLUDED.interest_type,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

-- 6. Corrigir leads existentes - preencher main_product_service com segment
UPDATE unified_leads ul
SET 
  main_product_service = li.segment,
  interest_type = COALESCE(li.segment, ul.interest_type)
FROM leads_ia li
WHERE ul.email = li.email
  AND ul.source_page = 'promo_agente_whatsapp'
  AND li.source_page = 'promo_agente_whatsapp'
  AND ul.main_product_service IS NULL;