-- Passo 1: Criar sequence para 2025 (começando com 1, vamos ajustar depois)
CREATE SEQUENCE IF NOT EXISTS sale_number_2025_seq START WITH 1;

-- Passo 2: Ajustar sequence para o próximo número disponível
-- Buscar o maior número de venda de 2025 e definir a sequence para o próximo
SELECT setval('sale_number_2025_seq', 
  COALESCE(
    (SELECT MAX(CAST(SUBSTRING(sale_number FROM 'VD\d{4}-(\d+)') AS INTEGER))
     FROM sales 
     WHERE EXTRACT(YEAR FROM created_at) = 2025), 
    0
  )
);

-- Passo 3: Reescrever a função para usar SEQUENCE (thread-safe!)
CREATE OR REPLACE FUNCTION public.generate_sale_number()
RETURNS text
LANGUAGE plpgsql
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
  
  -- ✅ SOLUÇÃO: Usar nextval() que é thread-safe e atômico!
  EXECUTE format('SELECT nextval(%L)', sequence_name) INTO sale_count;
  
  sale_number := 'VD' || current_year || '-' || LPAD(sale_count::TEXT, 4, '0');
  
  RETURN sale_number;
END;
$$;