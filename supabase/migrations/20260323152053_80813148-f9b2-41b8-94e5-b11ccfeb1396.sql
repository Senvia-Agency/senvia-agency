
-- Add missing columns to various tables
ALTER TABLE public.financial_movements ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'EUR';

ALTER TABLE public.customer_transactions ADD COLUMN IF NOT EXISTS product_description TEXT;

ALTER TABLE public.customer_calendar_integrations ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.sales ADD COLUMN IF NOT EXISTS due_date DATE;

-- Generate blog slug function
CREATE OR REPLACE FUNCTION public.generate_blog_slug(title TEXT)
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
DECLARE base_slug TEXT; final_slug TEXT; counter INTEGER := 0;
BEGIN
  base_slug := lower(trim(title));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(base_slug, '-');
  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  RETURN final_slug;
END;
$$;

-- Add sale_number default
ALTER TABLE public.sales ALTER COLUMN sale_number SET DEFAULT '';
