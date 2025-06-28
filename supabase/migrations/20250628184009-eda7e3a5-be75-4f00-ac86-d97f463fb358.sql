
-- Corrigir a função de migração
CREATE OR REPLACE FUNCTION migrate_existing_leads()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Migrar dados da tabela leads (Landing Page €4.99)
  INSERT INTO public.unified_leads (
    full_name, email, phone, company_name,
    source_page, interest_type, objective, main_product_service, target_audience,
    lead_status, payment_status, stripe_session_id, stripe_customer_id, stripe_payment_id,
    call_to_action, client_testimonials, competitive_advantage, desired_style, social_networks,
    contact_channels, logo_images, data_consent, utm_source, created_at, updated_at
  )
  SELECT 
    COALESCE(company_name, email) as full_name,
    COALESCE(email, company_email) as email,
    COALESCE(whatsapp, company_whatsapp) as phone,
    company_name,
    'landing_page_basic' as source_page,
    'basic_landing_page' as interest_type,
    landing_page_objective as objective,
    main_product_service,
    target_audience,
    COALESCE(lead_status, 'new') as lead_status,
    COALESCE(payment_status, 'pending') as payment_status,
    stripe_session_id,
    stripe_customer_id,
    stripe_payment_id,
    call_to_action,
    client_testimonials,
    competitive_advantage,
    desired_style,
    social_networks,
    contact_channels,
    logo_images,
    data_consent,
    utm_source,
    created_at,
    updated_at
  FROM public.leads;

  -- Migrar dados da tabela landing_page_leads (Landing Page Premium)
  INSERT INTO public.unified_leads (
    full_name, email, phone, country_code, company_name, website,
    source_page, interest_type, objective,
    lead_status, priority, assigned_to, notes, last_contact, next_followup,
    converted, conversion_date, conversion_value,
    utm_source, utm_medium, utm_campaign, ip_address, user_agent,
    created_at, updated_at
  )
  SELECT 
    full_name,
    email,
    phone,
    country_code,
    business_name as company_name,
    website,
    'landing_page_premium' as source_page,
    'premium_landing_page' as interest_type,
    objective,
    status as lead_status,
    priority,
    assigned_to,
    notes,
    last_contact,
    next_followup,
    converted,
    conversion_date,
    conversion_value,
    utm_source,
    utm_medium,
    utm_campaign,
    ip_address,
    user_agent,
    created_at,
    updated_at
  FROM public.landing_page_leads;

  RAISE NOTICE 'Migration completed successfully';
END;
$$;

-- Executar a migração corrigida
SELECT migrate_existing_leads();
