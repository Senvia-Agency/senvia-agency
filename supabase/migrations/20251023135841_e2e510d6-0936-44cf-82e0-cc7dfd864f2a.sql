-- Step 2: Corrigir dados existentes - limpar vendas recorrentes da lista de atrasos
-- Note: remaining_amount é uma coluna gerada, não pode ser atualizada diretamente
UPDATE public.sales 
SET 
  payment_status = 'recurring'
WHERE 
  is_recurring = true 
  AND payment_status IN ('pending', 'partial', 'overdue');

-- Step 4: Criar índice único para prevenir duplicados em recurring_receivables
CREATE UNIQUE INDEX IF NOT EXISTS uniq_rec_receivable 
ON public.recurring_receivables(recurring_service_id, due_date);

-- Opcional: Remover duplicados exatos se existirem (mantém o mais antigo)
WITH duplicates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY recurring_service_id, due_date 
      ORDER BY created_at ASC
    ) as rn
  FROM public.recurring_receivables
)
DELETE FROM public.recurring_receivables
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);