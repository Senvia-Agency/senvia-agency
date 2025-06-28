
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminRevenue = (dateRange: number) => {
  return useQuery({
    queryKey: ['admin-revenue-metrics', dateRange],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      console.log('Buscando métricas de receita desde:', startDate.toISOString());
      
      // Buscar pagamentos confirmados da tabela payments (sistema antigo)
      const { data: legacyPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .gte('created_at', startDate.toISOString());

      // Buscar transações de clientes (sistema novo)
      const { data: customerTransactions, error: transactionsError } = await supabase
        .from('customer_transactions')
        .select('*')
        .eq('status', 'completed')
        .gte('created_at', startDate.toISOString());

      // Buscar assinaturas ativas
      const { data: activeSubscriptions, error: subsError } = await supabase
        .from('senvia_assistant_subscriptions')
        .select('*')
        .eq('status', 'active')
        .gte('created_at', startDate.toISOString());

      if (paymentsError || transactionsError || subsError) {
        console.error('Erro ao buscar dados de receita:', paymentsError || transactionsError || subsError);
        throw paymentsError || transactionsError || subsError;
      }

      console.log('Dados encontrados:', {
        legacyPayments: legacyPayments?.length,
        customerTransactions: customerTransactions?.length,
        activeSubscriptions: activeSubscriptions?.length
      });

      // Calcular receita dos pagamentos legacy (convertendo de centavos para euros)
      const legacyPaymentsRevenue = (legacyPayments || [])
        .reduce((sum, payment) => sum + (payment.amount / 100), 0);
      
      // Calcular receita das transações de clientes (já em euros)
      const customerTransactionsRevenue = (customerTransactions || [])
        .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
      
      // Receita das assinaturas
      const subscriptionsRevenue = (activeSubscriptions || [])
        .reduce((sum, subscription) => sum + (subscription.monthly_price || 20), 0);
      
      const totalLandingPageRevenue = legacyPaymentsRevenue + customerTransactionsRevenue;
      const totalRevenue = totalLandingPageRevenue + subscriptionsRevenue;
      const totalTransactions = (legacyPayments?.length || 0) + (customerTransactions?.length || 0) + (activeSubscriptions?.length || 0);
      
      console.log('Cálculo final das receitas:', {
        legacyPaymentsRevenue,
        customerTransactionsRevenue,
        totalLandingPageRevenue,
        subscriptionsRevenue,
        totalRevenue,
        totalTransactions
      });
      
      return {
        total_revenue: totalRevenue,
        landing_page_revenue: totalLandingPageRevenue,
        assistant_revenue: subscriptionsRevenue,
        total_transactions: totalTransactions,
        landing_page_sales: (legacyPayments?.length || 0) + (customerTransactions?.length || 0),
        active_subscriptions: activeSubscriptions?.length || 0
      };
    },
    refetchInterval: 10000,
  });
};
