-- Atualizar next_billing_date dos serviços recorrentes do João para 2025-12-01
UPDATE recurring_services
SET next_billing_date = '2025-12-01'
WHERE id IN ('ca8b5879-98d7-4103-b511-c71ef320ffdf', '09063869-cb6d-4846-9cde-9e658b5efe89');