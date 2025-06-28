
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminLeads = (dateRange: number) => {
  return useQuery({
    queryKey: ['admin-leads-stats', dateRange],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      console.log('Buscando estatísticas de leads desde:', startDate.toISOString());
      
      // Buscar leads unificados
      const { data: unifiedLeads, error: unifiedError } = await supabase
        .from('unified_leads')
        .select('*')
        .gte('created_at', startDate.toISOString());

      // Buscar leads legacy básicos para compatibilidade
      const { data: legacyBasicLeads, error: basicError } = await supabase
        .from('leads')
        .select('id, payment_status')
        .gte('created_at', startDate.toISOString());

      // Buscar leads legacy premium para compatibilidade
      const { data: legacyPremiumLeads, error: premiumError } = await supabase
        .from('landing_page_leads')
        .select('id, status')
        .gte('created_at', startDate.toISOString());

      if (unifiedError || basicError || premiumError) {
        console.error('Erro ao buscar leads:', unifiedError || basicError || premiumError);
        throw unifiedError || basicError || premiumError;
      }

      // Contar leads unificados
      const unifiedBasicLeads = unifiedLeads?.filter(lead => lead.source_page === 'landing_page_basic') || [];
      const unifiedPremiumLeads = unifiedLeads?.filter(lead => lead.source_page === 'landing_page_premium') || [];
      
      const unifiedBasicPaid = unifiedBasicLeads.filter(lead => lead.payment_status === 'paid').length;
      const unifiedPremiumConverted = unifiedPremiumLeads.filter(lead => lead.converted === true).length;

      // Contar leads legacy para compatibilidade
      const legacyBasicPaid = legacyBasicLeads?.filter(lead => lead.payment_status === 'paid').length || 0;
      const legacyPremiumPaid = legacyPremiumLeads?.filter(lead => lead.status === 'paid').length || 0;

      const totalLeads = (unifiedLeads?.length || 0) + (legacyBasicLeads?.length || 0) + (legacyPremiumLeads?.length || 0);
      const totalConversions = unifiedBasicPaid + unifiedPremiumConverted + legacyBasicPaid + legacyPremiumPaid;
      
      console.log('Estatísticas finais calculadas:', {
        unifiedLeads: unifiedLeads?.length || 0,
        legacyBasicLeads: legacyBasicLeads?.length || 0,
        legacyPremiumLeads: legacyPremiumLeads?.length || 0,
        totalLeads,
        totalConversions
      });
      
      return {
        total_leads: totalLeads,
        landing_page_basic_leads: unifiedBasicLeads.length + (legacyBasicLeads?.length || 0),
        landing_page_basic_paid: unifiedBasicPaid + legacyBasicPaid,
        landing_page_premium_leads: unifiedPremiumLeads.length + (legacyPremiumLeads?.length || 0),
        landing_page_premium_paid: unifiedPremiumConverted + legacyPremiumPaid,
        total_conversions: totalConversions,
        conversion_rate: totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0
      };
    },
    refetchInterval: 10000,
  });
};
