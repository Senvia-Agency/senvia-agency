-- Remove the problematic trigger that's causing the "phone" field error
DROP TRIGGER IF EXISTS notify_new_ia_lead_trigger ON public.leads_ia;

-- The migrate_ia_leads_trigger should handle the migration to unified_leads
-- where the notification trigger will properly work