-- Migration: Restrict public INSERT on unified_leads
-- Auditoria 2026-07-16 CRIT-6
--
-- Antes: WITH CHECK (true) permitia INSERT com dados arbitrários de qualquer origem.
-- Agora: valida email + source_page em whitelist; demais campos ficam à responsabilidade
-- do Edge Function webhook-new-ia-lead (que é o caminho legítimo de entrada de leads).
--
-- Nota: esta migration não bloqueia spam determinado (rate-limiting deve ser feito
-- em camada de Edge Function / Cloudflare), mas fecha o hole mais óbvio.

-- 1) Drop da policy permissiva anterior
DROP POLICY IF EXISTS "Allow public inserts for forms" ON public.unified_leads;

-- 2) Helper function: valida formato básico de email
CREATE OR REPLACE FUNCTION public.is_valid_lead_email(email text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT email IS NOT NULL
    AND length(email) <= 254
    AND email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
$$;

-- 3) Helper function: valida source_page contra whitelist de landing pages conhecidas
--    Adicionar novas landing pages aqui quando surgirem.
CREATE OR REPLACE FUNCTION public.is_allowed_lead_source(source text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT source IS NOT NULL
    AND source IN (
      'senvia-agency',
      'senvia-site',
      'senvia-os',
      'formulario-lp',
      'formulario-site',
      'landing-chatbots',
      'landing-softwares',
      'landing-sites',
      'webhook-ia',
      'admin-manual'
    );
$$;

-- 4) Nova policy: INSERT público só com email válido + source whitelisted
CREATE POLICY "Allow public inserts for forms with validation"
ON public.unified_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  public.is_valid_lead_email(email)
  AND public.is_allowed_lead_source(source_page)
);

COMMENT ON POLICY "Allow public inserts for forms with validation"
ON public.unified_leads
IS 'Permite INSERT público apenas quando email passa regex e source_page está em whitelist. Auditoria 2026-07-16 CRIT-6.';

-- 5) Comentário na coluna source_page para documentar a whitelist
COMMENT ON COLUMN public.unified_leads.source_page IS
  'Origem do lead. Valores permitidos validados por is_allowed_lead_source(): senvia-agency, senvia-site, senvia-os, formulario-lp, formulario-site, landing-chatbots, landing-softwares, landing-sites, webhook-ia, admin-manual.';

-- 6) Grant mínimo (RLS ainda aplica)
-- Já existente por default; mantido aqui para clareza.
REVOKE ALL ON public.unified_leads FROM anon;
GRANT INSERT ON public.unified_leads TO anon, authenticated;
