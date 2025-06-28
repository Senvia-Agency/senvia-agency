
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminLeads = (dateRange: number) => {
  return useQuery({
    queryKey: ['admin-leads-stats', dateRange],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      console.log('Buscando leads desde:', startDate.toISOString());
      
      // Buscar leads pagos (da tabela leads)
      const { data: paidLeads, error: paidError } = await supabase
        .from('leads')
        .select('*')
        .gte('created_at', startDate.toISOString());

      // Buscar leads orgânicos (da tabela landing_page_leads)
      const { data: organicLeads, error: organicError } = await supabase
        .from('landing_page_leads')
        .select('*')
        .gte('created_at', startDate.toISOString());

      // Buscar conversões REAIS (pagamentos confirmados)
      const { data: realConversions, error: conversionsError } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .gte('created_at', startDate.toISOString());

      console.log('Dados de leads encontrados:', {
        paidLeads: paidLeads?.length,
        organicLeads: organicLeads?.length,
        realConversions: realConversions?.length
      });

      if (paidError || organicError || conversionsError) {
        console.error('Erro ao buscar leads:', paidError || organicError || conversionsError);
        throw paidError || organicError || conversionsError;
      }

      const totalLeads = (paidLeads?.length || 0) + (organicLeads?.length || 0);
      const totalConversions = realConversions?.length || 0;
      
      return {
        total_leads: totalLeads,
        paid_leads: paidLeads?.length || 0,
        organic_leads: organicLeads?.length || 0,
        conversion_rate: totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0,
        total_conversions: totalConversions
      };
    },
    refetchInterval: 10000,
  });
};
