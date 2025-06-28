
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUnifiedLeads = (dateRange?: number) => {
  return useQuery({
    queryKey: ['unified-leads', dateRange],
    queryFn: async () => {
      let query = supabase
        .from('unified_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (dateRange) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - dateRange);
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar leads unificados:', error);
        throw error;
      }

      console.log('Leads unificados encontrados:', data?.length);
      return data || [];
    },
    refetchInterval: 10000,
  });
};

export const useUnifiedLeadsStats = (dateRange: number) => {
  return useQuery({
    queryKey: ['unified-leads-stats', dateRange],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      console.log('Buscando estatísticas de leads unificados desde:', startDate.toISOString());
      
      const { data: allLeads, error } = await supabase
        .from('unified_leads')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (error) {
        console.error('Erro ao buscar leads unificados:', error);
        throw error;
      }

      // Separar por origem
      const basicLeads = allLeads?.filter(lead => lead.source_page === 'landing_page_basic') || [];
      const premiumLeads = allLeads?.filter(lead => lead.source_page === 'landing_page_premium') || [];
      
      // Contar conversões por status de pagamento
      const basicPaidCount = basicLeads.filter(lead => lead.payment_status === 'paid').length;
      const premiumConvertedCount = premiumLeads.filter(lead => lead.converted === true).length;
      
      const totalLeads = allLeads?.length || 0;
      const totalConversions = basicPaidCount + premiumConvertedCount;
      
      console.log('Estatísticas dos leads unificados:', {
        totalLeads,
        basicLeads: basicLeads.length,
        premiumLeads: premiumLeads.length,
        basicPaidCount,
        premiumConvertedCount,
        totalConversions
      });
      
      return {
        total_leads: totalLeads,
        basic_leads: basicLeads.length,
        premium_leads: premiumLeads.length,
        basic_paid: basicPaidCount,
        premium_converted: premiumConvertedCount,
        total_conversions: totalConversions,
        conversion_rate: totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0
      };
    },
    refetchInterval: 10000,
  });
};
