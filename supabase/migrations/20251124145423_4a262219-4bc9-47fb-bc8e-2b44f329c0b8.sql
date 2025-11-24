-- Passo 1: Corrigir função generate_sale_number() com SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.generate_sale_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER  -- ✅ Permite criar sequences
SET search_path = public  -- ✅ Segurança
AS $$
DECLARE
  current_year TEXT;
  sequence_name TEXT;
  sale_count INTEGER;
  sale_number TEXT;
BEGIN
  current_year := EXTRACT(YEAR FROM NOW())::TEXT;
  sequence_name := 'sale_number_' || current_year || '_seq';
  
  -- Criar sequence para o ano atual se não existir
  EXECUTE format('CREATE SEQUENCE IF NOT EXISTS %I START WITH 1', sequence_name);
  
  -- Usar nextval() que é thread-safe e atômico
  EXECUTE format('SELECT nextval(%L)', sequence_name) INTO sale_count;
  
  sale_number := 'VD' || current_year || '-' || LPAD(sale_count::TEXT, 4, '0');
  
  RETURN sale_number;
END;
$$;

-- Passo 2: Adicionar DEFAULT à coluna sale_number
ALTER TABLE public.sales 
ALTER COLUMN sale_number 
SET DEFAULT generate_sale_number();