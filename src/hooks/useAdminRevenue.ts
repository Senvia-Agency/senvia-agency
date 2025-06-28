
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminRevenue = (dateRange: number) => {
  return useQuery({
    queryKey: ['admin-revenue-metrics', dateRange],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      console.log('Buscando métricas de receita desde:', startDate.toISOString());
      
      // Buscar APENAS pagamentos confirmados (status = 'paid')
      const { data: paidPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .gte('created_at', startDate.toISOString());

      console.log('Pagamentos confirmados encontrados:', paidPayments);

      // Buscar assinaturas ATIVAS
      const { data: activeSubscriptions, error: subsError } = await supabase
        .from('senvia_assistant_subscriptions')
        .select('*')
        .eq('status', 'active')
        .gte('created_at', startDate.toISOString());

      console.log('Assinaturas ativas encontradas:', activeSubscriptions);

      if (paymentsError) {
        console.error('Erro ao buscar pagamentos:', paymentsError);
        throw paymentsError;
      }
      if (subsError) {
        console.error('Erro ao buscar assinaturas:', subsError);
        throw subsError;
      }

      // Calcular receita total REAL dos pagamentos (convertendo de centavos para euros)
      const totalPaymentsRevenue = (paidPayments || [])
        .reduce((sum, p) => {
          console.log('Processando pagamento:', p.id, 'Amount:', p.amount, 'Convertido:', p.amount / 100);
          return sum + (p.amount / 100);
        }, 0);
      
      // Receita das assinaturas (baseada no preço mensal)
      const totalSubscriptionsRevenue = (activeSubscriptions || [])
        .reduce((sum, s) => sum + (s.monthly_price || 20), 0);
      
      const totalRevenue = totalPaymentsRevenue + totalSubscriptionsRevenue;
      
      console.log('Cálculo FINAL das receitas:', {
        totalPaymentsRevenue,
        totalSubscriptionsRevenue,
        totalRevenue,
        totalPayments: paidPayments?.length || 0,
        totalSubscriptions: activeSubscriptions?.length || 0
      });
      
      return {
        total_revenue: totalRevenue,
        landing_page_revenue: totalPaymentsRevenue,
        assistant_revenue: totalSubscriptionsRevenue,
        total_transactions: (paidPayments?.length || 0) + (activeSubscriptions?.length || 0),
        landing_page_sales: paidPayments?.length || 0,
        active_subscriptions: activeSubscriptions?.length || 0
      };
    },
    refetchInterval: 10000,
  });
};
