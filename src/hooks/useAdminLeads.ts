
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

      if (unifiedError) {
        console.error('Erro ao buscar leads:', unifiedError);
        throw unifiedError;
      }

      // Processar leads unificados
      const unifiedBasicLeads = unifiedLeads?.filter(lead => lead.source_page === 'landing_page_basic') || [];
      const unifiedPremiumLeads = unifiedLeads?.filter(lead => lead.source_page === 'landing_page_premium') || [];
      
      const unifiedBasicPaid = unifiedBasicLeads.filter(lead => lead.payment_status === 'paid').length;
      const unifiedPremiumConverted = unifiedPremiumLeads.filter(lead => lead.converted === true).length;

      const totalLeads = unifiedLeads?.length || 0;
      const totalConversions = unifiedBasicPaid + unifiedPremiumConverted;
      
      console.log('Estatísticas finais calculadas:', {
        unifiedLeads: unifiedLeads?.length || 0,
        totalLeads,
        totalConversions
      });
      
      return {
        total_leads: totalLeads,
        landing_page_basic_leads: unifiedBasicLeads.length,
        landing_page_basic_paid: unifiedBasicPaid,
        landing_page_premium_leads: unifiedPremiumLeads.length,
        landing_page_premium_paid: unifiedPremiumConverted,
        total_conversions: totalConversions,
        conversion_rate: totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0
      };
    },
    refetchInterval: 10000,
  });
};
