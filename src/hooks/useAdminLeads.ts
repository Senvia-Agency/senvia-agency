
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
        .select('id, payment_status')
        .gte('created_at', startDate.toISOString());

      // Buscar leads da Landing Page Premium (tabela landing_page_leads) 
      // Verificar se tem campo de status de pagamento ou usar campo 'status'
      const { data: premiumLeads, error: premiumError } = await supabase
        .from('landing_page_leads')
        .select('id, status')
        .gte('created_at', startDate.toISOString());

      console.log('Leads encontrados:', {
        basicLeads: basicLeads?.length,
        premiumLeads: premiumLeads?.length
      });

      if (basicError || premiumError) {
        console.error('Erro ao buscar leads:', basicError || premiumError);
        throw basicError || premiumError;
      }

      // Contar leads básicos pagos (payment_status = 'paid')
      const basicPaidCount = basicLeads?.filter(lead => lead.payment_status === 'paid').length || 0;
      
      // Contar leads premium pagos (status = 'paid' ou similar)
      const premiumPaidCount = premiumLeads?.filter(lead => lead.status === 'paid').length || 0;

      const totalLeads = (basicLeads?.length || 0) + (premiumLeads?.length || 0);
      const totalConfirmedConversions = basicPaidCount + premiumPaidCount;
      
      console.log('Contagens finais calculadas:', {
        basicPaidCount,
        premiumPaidCount,
        totalConfirmedConversions,
        basicLeadsWithStatus: basicLeads?.map(l => ({ id: l.id, payment_status: l.payment_status })),
        premiumLeadsWithStatus: premiumLeads?.map(l => ({ id: l.id, status: l.status }))
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
