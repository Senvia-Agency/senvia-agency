-- Corrigir transações inconsistentes
-- Atualizar o status das transações que não correspondem ao payment_status das vendas
UPDATE customer_transactions 
SET status = 'pending' 
WHERE id IN (
  SELECT ct.id 
  FROM customer_transactions ct
  LEFT JOIN sales s ON s.customer_id = ct.customer_id
  WHERE ct.status = 'completed' 
    AND (s.payment_status = 'pending' OR s.paid_amount = 0)
);

-- Criar função para sincronizar transações com vendas
CREATE OR REPLACE FUNCTION sync_customer_transaction_with_sale()
RETURNS TRIGGER AS $$
BEGIN
  -- Quando uma venda é marcada como paga, marcar a transação como completed
  IF NEW.payment_status = 'paid' AND NEW.paid_amount > 0 THEN
    UPDATE customer_transactions 
    SET status = 'completed'
    WHERE customer_id = NEW.customer_id 
      AND amount = NEW.paid_amount
      AND status = 'pending';
  END IF;
  
  -- Quando uma venda é marcada como pendente, marcar a transação como pending
  IF NEW.payment_status = 'pending' OR NEW.paid_amount = 0 THEN
    UPDATE customer_transactions 
    SET status = 'pending'
    WHERE customer_id = NEW.customer_id 
      AND status = 'completed';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para sincronizar automaticamente
CREATE TRIGGER sync_customer_transaction_status
  AFTER UPDATE ON sales
  FOR EACH ROW
  EXECUTE FUNCTION sync_customer_transaction_with_sale();