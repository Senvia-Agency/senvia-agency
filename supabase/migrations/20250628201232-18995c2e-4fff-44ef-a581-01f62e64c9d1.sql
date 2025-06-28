
-- Verificar se a tabela products tem as constraints corretas
-- Primeiro, vamos adicionar um índice único para stripe_product_id se não existir
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_stripe_product_id 
ON public.products (stripe_product_id) 
WHERE stripe_product_id IS NOT NULL;

-- Verificar se a tabela product_plans tem constraints corretas
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_plans_unique_name_per_product 
ON public.product_plans (product_id, name);

-- Verificar dados atuais
SELECT 'products' as table_name, count(*) as total_rows FROM public.products
UNION ALL
SELECT 'product_plans' as table_name, count(*) as total_rows FROM public.product_plans;

-- Verificar se há produtos com stripe_product_id
SELECT stripe_product_id, name, active, status FROM public.products WHERE stripe_product_id IS NOT NULL;
