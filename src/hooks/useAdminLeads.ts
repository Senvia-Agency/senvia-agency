
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminLeads = (dateRange: number) => {
  return useQuery({
    queryKey: ['admin-leads-stats', dateRange],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      console.log('Buscando leads desde:', startDate.toISOString());
      
      // Buscar todos os leads da tabela leads (Landing Pages pagas)
      const { data: paidLeads, error: paidError } = await supabase
        .from('leads')
        .select('*')
        .gte('created_at', startDate.toISOString());

      // Buscar leads gratuitos (da tabela landing_page_leads)
      const { data: freeLeads, error: freeError } = await supabase
        .from('landing_page_leads')
        .select('*')
        .gte('created_at', startDate.toISOString());

      // Buscar pagamentos confirmados para verificar status real
      const { data: confirmedPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .gte('created_at', startDate.toISOString());

      console.log('Dados encontrados:', {
        paidLeads: paidLeads?.length,
        freeLeads: freeLeads?.length,
        confirmedPayments: confirmedPayments?.length
      });

      if (paidError || freeError || paymentsError) {
        console.error('Erro ao buscar leads:', paidError || freeError || paymentsError);
        throw paidError || freeError || paymentsError;
      }

      // Separar leads por valor/produto baseado nos pagamentos confirmados
      const basicLeads = paidLeads?.filter(lead => {
        // Verificar se existe pagamento confirmado de €4.99 (499 centavos)
        return confirmedPayments?.some(payment => 
          payment.email === lead.company_email && payment.amount === 499
        );
      }) || [];

      const premiumLeads = paidLeads?.filter(lead => {
        // Verificar se existe pagamento confirmado de valor premium (maior que €4.99)
        return confirmedPayments?.some(payment => 
          payment.email === lead.company_email && payment.amount > 499
        );
      }) || [];

      // Contar pagamentos confirmados por categoria
      const basicPaidCount = confirmedPayments?.filter(p => p.amount === 499).length || 0;
      const premiumPaidCount = confirmedPayments?.filter(p => p.amount > 499).length || 0;

      const totalLeads = (paidLeads?.length || 0) + (freeLeads?.length || 0);
      const totalConfirmedConversions = confirmedPayments?.length || 0;
      
      return {
        total_leads: totalLeads,
        landing_page_basic_leads: basicLeads.length,
        landing_page_basic_paid: basicPaidCount,
        landing_page_premium_leads: premiumLeads.length,
        landing_page_premium_paid: premiumPaidCount,
        free_leads: freeLeads?.length || 0,
        confirmed_conversions: totalConfirmedConversions,
        conversion_rate: totalLeads > 0 ? (totalConfirmedConversions / totalLeads) * 100 : 0
      };
    },
    refetchInterval: 10000,
  });
};
