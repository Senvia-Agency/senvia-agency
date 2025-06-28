
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
        .select('*')
        .gte('created_at', startDate.toISOString());

      // Buscar leads da Landing Page Premium (tabela landing_page_leads)
      const { data: premiumLeads, error: premiumError } = await supabase
        .from('landing_page_leads')
        .select('*')
        .gte('created_at', startDate.toISOString());

      // Buscar TODOS os pagamentos confirmados (status = 'paid')
      const { data: confirmedPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .gte('created_at', startDate.toISOString());

      console.log('Dados encontrados:', {
        basicLeads: basicLeads?.length,
        premiumLeads: premiumLeads?.length,
        confirmedPayments: confirmedPayments?.length,
        paymentsDetails: confirmedPayments?.map(p => ({ amount: p.amount, email: p.email }))
      });

      if (basicError || premiumError || paymentsError) {
        console.error('Erro ao buscar leads:', basicError || premiumError || paymentsError);
        throw basicError || premiumError || paymentsError;
      }

      // Contar pagamentos confirmados de €4.99 (499 centavos)
      const basicPaidCount = confirmedPayments?.filter(p => p.amount === 499).length || 0;
      
      // Contar pagamentos confirmados premium (valores superiores a €4.99)
      const premiumPaidCount = confirmedPayments?.filter(p => p.amount > 499).length || 0;

      const totalLeads = (basicLeads?.length || 0) + (premiumLeads?.length || 0);
      const totalConfirmedConversions = confirmedPayments?.length || 0;
      
      console.log('Contagens calculadas:', {
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
