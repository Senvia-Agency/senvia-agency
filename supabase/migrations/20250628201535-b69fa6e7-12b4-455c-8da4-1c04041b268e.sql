
-- Adicionar colunas necessárias para sincronização completa com Stripe
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS stripe_created INTEGER,
ADD COLUMN IF NOT EXISTS stripe_updated INTEGER,
ADD COLUMN IF NOT EXISTS stripe_url TEXT,
ADD COLUMN IF NOT EXISTS stripe_images TEXT[],
ADD COLUMN IF NOT EXISTS stripe_package_dimensions JSONB,
ADD COLUMN IF NOT EXISTS stripe_shippable BOOLEAN,
ADD COLUMN IF NOT EXISTS stripe_statement_descriptor TEXT,
ADD COLUMN IF NOT EXISTS stripe_tax_code TEXT,
ADD COLUMN IF NOT EXISTS stripe_unit_label TEXT,
ADD COLUMN IF NOT EXISTS stripe_default_price_id TEXT;

-- Melhorar a tabela product_plans para sincronização com preços do Stripe
ALTER TABLE public.product_plans 
ADD COLUMN IF NOT EXISTS stripe_created INTEGER,
ADD COLUMN IF NOT EXISTS stripe_updated INTEGER,
ADD COLUMN IF NOT EXISTS stripe_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS stripe_billing_scheme TEXT,
ADD COLUMN IF NOT EXISTS stripe_currency_options JSONB,
ADD COLUMN IF NOT EXISTS stripe_custom_unit_amount JSONB,
ADD COLUMN IF NOT EXISTS stripe_lookup_key TEXT,
ADD COLUMN IF NOT EXISTS stripe_metadata JSONB,
ADD COLUMN IF NOT EXISTS stripe_nickname TEXT,
ADD COLUMN IF NOT EXISTS stripe_product_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_recurring JSONB,
ADD COLUMN IF NOT EXISTS stripe_tax_behavior TEXT,
ADD COLUMN IF NOT EXISTS stripe_tiers JSONB,
ADD COLUMN IF NOT EXISTS stripe_tiers_mode TEXT,
ADD COLUMN IF NOT EXISTS stripe_transform_quantity JSONB,
ADD COLUMN IF NOT EXISTS stripe_type TEXT,
ADD COLUMN IF NOT EXISTS stripe_unit_amount INTEGER,
ADD COLUMN IF NOT EXISTS stripe_unit_amount_decimal TEXT;

-- Adicionar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_products_stripe_created ON public.products(stripe_created);
CREATE INDEX IF NOT EXISTS idx_products_stripe_updated ON public.products(stripe_updated);
CREATE INDEX IF NOT EXISTS idx_product_plans_stripe_product_id ON public.product_plans(stripe_product_id);
CREATE INDEX IF NOT EXISTS idx_product_plans_stripe_created ON public.product_plans(stripe_created);

-- Limpar dados existentes para nova sincronização
DELETE FROM public.product_plans WHERE product_id IN (SELECT id FROM public.products WHERE stripe_product_id IS NOT NULL);
DELETE FROM public.products WHERE stripe_product_id IS NOT NULL;
