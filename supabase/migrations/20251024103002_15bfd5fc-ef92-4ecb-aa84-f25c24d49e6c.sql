-- Primeiro, migrar vendas com sale_status = 'cancelled' para payment_status = 'cancelled'
UPDATE public.sales 
SET payment_status = 'cancelled' 
WHERE sale_status = 'cancelled' AND payment_status != 'cancelled';

-- Remover coluna sale_status da tabela sales
ALTER TABLE public.sales 
DROP COLUMN IF EXISTS sale_status;