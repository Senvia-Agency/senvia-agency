-- Função para remover código do país do telefone
CREATE OR REPLACE FUNCTION clean_phone_number(phone_input text)
RETURNS text AS $$
BEGIN
  IF phone_input IS NULL OR phone_input = '' THEN
    RETURN phone_input;
  END IF;
  
  -- Remove códigos de país comuns (+351, +55, +1, etc.) e espaços/caracteres especiais
  RETURN regexp_replace(
    regexp_replace(phone_input, '^\+[0-9]{1,4}\s*', ''),
    '[^0-9]', '', 'g'
  );
END;
$$ LANGUAGE plpgsql;

-- Atualizar telefones existentes removendo códigos de país
UPDATE unified_leads 
SET phone = clean_phone_number(phone)
WHERE phone IS NOT NULL;

-- Trigger para limpar automaticamente novos telefones
CREATE OR REPLACE FUNCTION clean_phone_on_insert_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.phone = clean_phone_number(NEW.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger
DROP TRIGGER IF EXISTS clean_phone_trigger ON unified_leads;
CREATE TRIGGER clean_phone_trigger
  BEFORE INSERT OR UPDATE ON unified_leads
  FOR EACH ROW
  EXECUTE FUNCTION clean_phone_on_insert_update();