
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminRevenue = (dateRange: number) => {
  return useQuery({
    queryKey: ['admin-revenue-metrics', dateRange],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      console.log('Buscando métricas de receita desde:', startDate.toISOString());
      
      // Buscar TODOS os pagamentos (independente do status primeiro para debug)
      const { data: allPayments, error: allPaymentsError } = await supabase
        .from('payments')
        .select('*')
        .gte('created_at', startDate.toISOString());

      console.log('TODOS os pagamentos encontrados:', allPayments);

      // Buscar apenas pagamentos confirmados (status = 'paid')
      const { data: paidPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .gte('created_at', startDate.toISOString());

      console.log('Pagamentos PAGOS encontrados:', paidPayments);

      // Buscar assinaturas ATIVAS
      const { data: activeSubscriptions, error: subsError } = await supabase
        .from('senvia_assistant_subscriptions')
        .select('*')
        .eq('status', 'active')
        .gte('created_at', startDate.toISOString());

      console.log('Assinaturas ativas encontradas:', activeSubscriptions);

      if (paymentsError || allPaymentsError) {
        console.error('Erro ao buscar pagamentos:', paymentsError || allPaymentsError);
        throw paymentsError || allPaymentsError;
      }
      if (subsError) {
        console.error('Erro ao buscar assinaturas:', subsError);
        throw subsError;
      }

      // Calcular receita dos pagamentos PAGOS (convertendo de centavos para euros)
      const totalPaymentsRevenue = (paidPayments || [])
        .reduce((sum, payment) => {
          const amountInEuros = payment.amount / 100; // Converter centavos para euros
          console.log(`Pagamento ${payment.id}: ${payment.amount} centavos = €${amountInEuros}`);
          return sum + amountInEuros;
        }, 0);
      
      // Receita das assinaturas (baseada no preço mensal)
      const totalSubscriptionsRevenue = (activeSubscriptions || [])
        .reduce((sum, subscription) => {
          const monthlyPrice = subscription.monthly_price || 20;
          console.log(`Assinatura ${subscription.id}: €${monthlyPrice}`);
          return sum + monthlyPrice;
        }, 0);
      
      const totalRevenue = totalPaymentsRevenue + totalSubscriptionsRevenue;
      const totalTransactions = (paidPayments?.length || 0) + (activeSubscriptions?.length || 0);
      
      console.log('Cálculo FINAL das receitas (CORRIGIDO):', {
        totalPaymentsRevenue,
        totalSubscriptionsRevenue,
        totalRevenue,
        totalTransactions,
        paidPaymentsCount: paidPayments?.length || 0,
        activeSubscriptionsCount: activeSubscriptions?.length || 0,
        allPaymentsCount: allPayments?.length || 0
      });
      
      return {
        total_revenue: totalRevenue,
        landing_page_revenue: totalPaymentsRevenue,
        assistant_revenue: totalSubscriptionsRevenue,
        total_transactions: totalTransactions,
        landing_page_sales: paidPayments?.length || 0,
        active_subscriptions: activeSubscriptions?.length || 0
      };
    },
    refetchInterval: 10000,
  });
};
