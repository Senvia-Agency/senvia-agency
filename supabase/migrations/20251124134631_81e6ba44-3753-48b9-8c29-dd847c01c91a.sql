-- Limpeza manual: Excluir recurring_services órfãos do Tiago Pereira
-- Estes serviços recorrentes ficaram sem sale_id após exclusão da venda

DELETE FROM recurring_services
WHERE id IN (
  '2da12c1e-1524-4963-a752-9c63add8376d',  -- Tráfego Pago
  '5f9544cc-341f-4505-8d03-2aacbf01a48f'   -- Hospedagem Site
);