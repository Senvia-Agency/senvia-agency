
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
      
      // Contar conversões: payment_status = 'paid' OU converted = true
      const unifiedBasicConverted = unifiedBasicLeads.filter(lead => 
        lead.payment_status === 'paid' || lead.converted === true
      ).length;
      
      const unifiedPremiumConverted = unifiedPremiumLeads.filter(lead => 
        lead.converted === true
      ).length;

      const totalLeads = unifiedLeads?.length || 0;
      const totalConversions = unifiedBasicConverted + unifiedPremiumConverted;
      
      console.log('Estatísticas calculadas:', {
        totalLeads,
        basicLeads: unifiedBasicLeads.length,
        premiumLeads: unifiedPremiumLeads.length,
        basicConverted: unifiedBasicConverted,
        premiumConverted: unifiedPremiumConverted,
        totalConversions,
        conversionRate: totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0
      });
      
      return {
        total_leads: totalLeads,
        landing_page_basic_leads: unifiedBasicLeads.length,
        landing_page_basic_paid: unifiedBasicConverted,
        landing_page_premium_leads: unifiedPremiumLeads.length,
        landing_page_premium_paid: unifiedPremiumConverted,
        total_conversions: totalConversions,
        conversion_rate: totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0
      };
    },
    // REMOVIDO refetchInterval para evitar atualizações constantes
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 minuto
  });
};
