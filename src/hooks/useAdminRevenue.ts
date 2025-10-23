
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminRevenue = (dateRange: number) => {
  return useQuery({
    queryKey: ['admin-revenue-metrics', dateRange],
    queryFn: async () => {
      const hasRange = dateRange > 0;
      const startDate = new Date();
      if (hasRange) {
        startDate.setDate(startDate.getDate() - dateRange);
      }
      
      console.log('Buscando métricas de receita:', hasRange ? `desde ${startDate.toISOString()}` : 'todos os dados');
      
      // Buscar transações de clientes (sistema novo - dados reais)
      let txQuery = supabase
        .from('customer_transactions')
        .select('*')
        .eq('status', 'completed');
      
      if (hasRange) {
        txQuery = txQuery.gte('created_at', startDate.toISOString());
      }
      
      const { data: customerTransactions, error: transactionsError } = await txQuery;

      // Buscar pagamentos confirmados da tabela payments (sistema legado)
      let paymentsQuery = supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid');
      
      if (hasRange) {
        paymentsQuery = paymentsQuery.gte('created_at', startDate.toISOString());
      }
      
      const { data: legacyPayments, error: paymentsError } = await paymentsQuery;

      // Buscar assinaturas ativas do Senvia Assistant (sempre sem filtro de data)
      const { data: activeSubscriptions, error: subsError } = await supabase
        .from('senvia_assistant_subscriptions')
        .select('*')
        .eq('status', 'active');

      // Buscar vendas do módulo de vendas
      let salesQuery = supabase
        .from('sales')
        .select('*');
      
      if (hasRange) {
        salesQuery = salesQuery.gte('created_at', startDate.toISOString());
      }
      
      const { data: salesData, error: salesError } = await salesQuery;

      // Buscar movimentos financeiros
      let movementsQuery = supabase
        .from('financial_movements')
        .select('*');
      
      if (hasRange) {
        movementsQuery = movementsQuery.gte('movement_date', startDate.toISOString().split('T')[0]);
      }
      
      const { data: financialMovements, error: movementsError } = await movementsQuery;

      // Buscar todos os custom_services para fazer o join manualmente
      const { data: customServices, error: servicesError } = await supabase
        .from('custom_services')
        .select('id, service_type, pricing_model');

      if (transactionsError || paymentsError || subsError || salesError || movementsError || servicesError) {
        console.error('Erro ao buscar dados de receita:', transactionsError || paymentsError || subsError || salesError || movementsError || servicesError);
        throw transactionsError || paymentsError || subsError || salesError || movementsError || servicesError;
      }

      console.log('Dados encontrados:', {
        customerTransactions: customerTransactions?.length,
        legacyPayments: legacyPayments?.length,
        activeSubscriptions: activeSubscriptions?.length,
        salesData: salesData?.length
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

      // Criar um mapa dos custom_services para facilitar o lookup
      const servicesMap = new Map();
      (customServices || []).forEach(service => {
        servicesMap.set(service.id, service);
      });

      // Separar vendas recorrentes das não-recorrentes
      const oneTimeSales = (salesData || []).filter(sale => {
        // Se não tem service_id, é manual (consideramos não-recorrente)
        if (!sale.service_id) return true;
        
        // Se tem service_id, buscar no mapa e verificar se é one_time
        const service = servicesMap.get(sale.service_id);
        return !service || service.service_type === 'one_time';
      });

      const recurringSales = (salesData || []).filter(sale => {
        // Se tem service_id e é recurring
        if (!sale.service_id) return false;
        const service = servicesMap.get(sale.service_id);
        return service && service.service_type === 'recurring';
      });

      // Receita das vendas não-recorrentes (únicas/fixas)
      const oneTimeSalesRevenue = oneTimeSales
        .reduce((sum, sale) => sum + Number(sale.paid_amount || 0), 0);
      
      // Receita das vendas recorrentes
      const recurringSalesRevenue = recurringSales
        .reduce((sum, sale) => sum + Number(sale.paid_amount || 0), 0);
      
      // Receitas dos movimentos financeiros
      const movementsRevenue = (financialMovements || [])
        .filter(m => m.movement_type === 'receita')
        .reduce((sum, movement) => sum + Number(movement.amount), 0);
      
      // Total de receitas de assinaturas (Senvia Assistant + vendas recorrentes)
      const totalSubscriptionRevenue = subscriptionsRevenue + recurringSalesRevenue;
      
      // Total de vendas não-recorrentes (Landing Pages + vendas únicas + movimentos financeiros)
      const totalOneTimeRevenue = customerTransactionsRevenue + legacyPaymentsRevenue + oneTimeSalesRevenue + movementsRevenue;
      
      const totalRevenue = totalOneTimeRevenue + totalSubscriptionRevenue;
      const totalTransactions = (customerTransactions?.length || 0) + (legacyPayments?.length || 0) + (activeSubscriptions?.length || 0) + (salesData?.length || 0);
      
      console.log('Cálculo final das receitas:', {
        customerTransactionsRevenue,
        legacyPaymentsRevenue,
        subscriptionsRevenue,
        oneTimeSalesRevenue,
        recurringSalesRevenue,
        movementsRevenue,
        totalOneTimeRevenue,
        totalSubscriptionRevenue,
        totalRevenue,
        oneTimeSalesCount: oneTimeSales.length,
        recurringSalesCount: recurringSales.length
      });
      
      return {
        total_revenue: totalRevenue,
        landing_page_revenue: customerTransactionsRevenue + legacyPaymentsRevenue, // Mantém para compatibilidade
        assistant_revenue: subscriptionsRevenue, // Mantém para compatibilidade
        sales_revenue: oneTimeSalesRevenue + recurringSalesRevenue, // Mantém para compatibilidade
        // Novos campos separados
        one_time_sales_revenue: totalOneTimeRevenue,
        subscription_revenue: totalSubscriptionRevenue,
        total_transactions: totalTransactions,
        landing_page_sales: (customerTransactions?.length || 0) + (legacyPayments?.length || 0),
        active_subscriptions: activeSubscriptions?.length || 0,
        sales_count: salesData?.length || 0,
        one_time_sales_count: oneTimeSales.length,
        recurring_sales_count: recurringSales.length
      };
    },
    refetchInterval: 10000,
  });
};
