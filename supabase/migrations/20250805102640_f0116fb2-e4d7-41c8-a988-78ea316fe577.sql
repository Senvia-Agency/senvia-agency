-- Resetar todas as temperaturas dos leads para 'cold'
UPDATE unified_leads 
SET temperature = 'cold'
WHERE temperature IS NOT NULL;