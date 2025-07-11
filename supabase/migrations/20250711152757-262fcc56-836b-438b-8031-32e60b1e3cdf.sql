-- Remover transações da Ilda que foram criadas indevidamente
DELETE FROM customer_transactions 
WHERE customer_id = 'adc6bbca-a448-43ea-9ae9-a3cca22085fd'
AND id IN ('0bc6abdb-9797-4a04-8d9d-8a8338eb666c', 'df4ae526-260a-4291-90ee-833fc3d28093');