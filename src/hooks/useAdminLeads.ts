
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminLeads = (dateRange: number) => {
  return useQuery({
    queryKey: ['admin-leads-stats', dateRange],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      console.log('Buscando leads desde:', startDate.toISOString());
      
      // Buscar leads da Landing Page €4.99 (tabela leads)
      const { data: basicLeads, error: basicError } = await supabase
        .from('leads')
        .select('id')
        .gte('created_at', startDate.toISOString());

      // Buscar leads da Landing Page Premium (tabela landing_page_leads)
      const { data: premiumLeads, error: premiumError } = await supabase
        .from('landing_page_leads')
        .select('id')
        .gte('created_at', startDate.toISOString());

      console.log('Leads encontrados:', {
        basicLeads: basicLeads?.length,
        premiumLeads: premiumLeads?.length
      });

      if (basicError || premiumError) {
        console.error('Erro ao buscar leads:', basicError || premiumError);
        throw basicError || premiumError;
      }

      // Extrair IDs dos leads
      const basicLeadIds = basicLeads?.map(lead => lead.id) || [];
      const premiumLeadIds = premiumLeads?.map(lead => lead.id) || [];

      // Buscar pagamentos confirmados relacionados aos leads básicos
      let basicPaidCount = 0;
      if (basicLeadIds.length > 0) {
        const { data: basicPayments, error: basicPaymentsError } = await supabase
          .from('payments')
          .select('*')
          .eq('status', 'paid')
          .in('lead_id', basicLeadIds)
          .gte('created_at', startDate.toISOString());

        if (basicPaymentsError) {
          console.error('Erro ao buscar pagamentos básicos:', basicPaymentsError);
        } else {
          basicPaidCount = basicPayments?.length || 0;
          console.log('Pagamentos básicos encontrados:', basicPayments);
        }
      }

      // Buscar pagamentos confirmados relacionados aos leads premium
      let premiumPaidCount = 0;
      if (premiumLeadIds.length > 0) {
        const { data: premiumPayments, error: premiumPaymentsError } = await supabase
          .from('payments')
          .select('*')
          .eq('status', 'paid')
          .in('lead_id', premiumLeadIds)
          .gte('created_at', startDate.toISOString());

        if (premiumPaymentsError) {
          console.error('Erro ao buscar pagamentos premium:', premiumPaymentsError);
        } else {
          premiumPaidCount = premiumPayments?.length || 0;
          console.log('Pagamentos premium encontrados:', premiumPayments);
        }
      }

      const totalLeads = (basicLeads?.length || 0) + (premiumLeads?.length || 0);
      const totalConfirmedConversions = basicPaidCount + premiumPaidCount;
      
      console.log('Contagens finais calculadas:', {
        basicPaidCount,
        premiumPaidCount,
        totalConfirmedConversions
      });
      
      return {
        total_leads: totalLeads,
        landing_page_basic_leads: basicLeads?.length || 0,
        landing_page_basic_paid: basicPaidCount,
        landing_page_premium_leads: premiumLeads?.length || 0,
        landing_page_premium_paid: premiumPaidCount,
        confirmed_conversions: totalConfirmedConversions,
        conversion_rate: totalLeads > 0 ? (totalConfirmedConversions / totalLeads) * 100 : 0
      };
    },
    refetchInterval: 10000,
  });
};
