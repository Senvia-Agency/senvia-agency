
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminRevenue = (dateRange: number) => {
  return useQuery({
    queryKey: ['admin-revenue-metrics', dateRange],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      console.log('Buscando métricas de receita desde:', startDate.toISOString());
      
      // Buscar transações de clientes (sistema novo - dados reais)
      const { data: customerTransactions, error: transactionsError } = await supabase
        .from('customer_transactions')
        .select('*')
        .eq('status', 'completed')
        .gte('created_at', startDate.toISOString());

      // Buscar pagamentos confirmados da tabela payments (sistema legado)
      const { data: legacyPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .gte('created_at', startDate.toISOString());

      // Buscar assinaturas ativas do Senvia Assistant
      const { data: activeSubscriptions, error: subsError } = await supabase
        .from('senvia_assistant_subscriptions')
        .select('*')
        .eq('status', 'active')
        .gte('created_at', startDate.toISOString());

      if (transactionsError || paymentsError || subsError) {
        console.error('Erro ao buscar dados de receita:', transactionsError || paymentsError || subsError);
        throw transactionsError || paymentsError || subsError;
      }

      console.log('Dados encontrados:', {
        customerTransactions: customerTransactions?.length,
        legacyPayments: legacyPayments?.length,
        activeSubscriptions: activeSubscriptions?.length
      });

      // Calcular receita das transações de clientes (já em euros)
      const customerTransactionsRevenue = (customerTransactions || [])
        .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
      
      // Calcular receita dos pagamentos legacy (convertendo de centavos para euros)
      const legacyPaymentsRevenue = (legacyPayments || [])
        .reduce((sum, payment) => sum + (payment.amount / 100), 0);
      
      // Receita das assinaturas do Senvia Assistant
      const subscriptionsRevenue = (activeSubscriptions || [])
        .reduce((sum, subscription) => sum + (subscription.monthly_price || 20), 0);
      
      const totalLandingPageRevenue = customerTransactionsRevenue + legacyPaymentsRevenue;
      const totalRevenue = totalLandingPageRevenue + subscriptionsRevenue;
      const totalTransactions = (customerTransactions?.length || 0) + (legacyPayments?.length || 0) + (activeSubscriptions?.length || 0);
      
      console.log('Cálculo final das receitas:', {
        customerTransactionsRevenue,
        legacyPaymentsRevenue,
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
        landing_page_sales: (customerTransactions?.length || 0) + (legacyPayments?.length || 0),
        active_subscriptions: activeSubscriptions?.length || 0
      };
    },
    refetchInterval: 10000,
  });
};
