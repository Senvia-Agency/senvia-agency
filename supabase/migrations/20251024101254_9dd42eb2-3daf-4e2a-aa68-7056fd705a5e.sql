-- Corrigir timing do trigger para AFTER INSERT
-- Isso garante que o sale_id já existe quando o recurring_service é criado

-- 1. Dropar o trigger atual (BEFORE)
DROP TRIGGER IF EXISTS trigger_auto_create_recurring_service ON public.sales;

-- 2. Recriar como AFTER INSERT para evitar erro de foreign key
CREATE TRIGGER trigger_auto_create_recurring_service
  AFTER INSERT ON public.sales
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_recurring_service();

-- Com AFTER INSERT:
-- ✅ A venda é inserida primeiro (id gerado)
-- ✅ Depois o trigger cria o recurring_service com sale_id válido
-- ✅ Tudo acontece na mesma transação (atômico)
-- ✅ Se algo falhar, tudo é revertido