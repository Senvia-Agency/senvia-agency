import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRealFinancialData = (dateRange: number = 30) => {
  return useQuery({
    queryKey: ['real-financial-data', dateRange],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      console.log('Buscando dados financeiros reais desde:', startDate.toISOString());
      
      // Buscar transações de clientes (sistema novo)
      const { data: customerTransactions, error: transactionsError } = await supabase
        .from('customer_transactions')
        .select('*')
        .eq('status', 'completed')
        .gte('created_at', startDate.toISOString());

      // Buscar pagamentos confirmados (sistema legado)
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

      // Buscar vendas do módulo de vendas
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .gte('created_at', startDate.toISOString());

      // Buscar movimentos financeiros
      const { data: financialMovements, error: movementsError } = await supabase
        .from('financial_movements')
        .select('*')
        .gte('movement_date', startDate.toISOString().split('T')[0]);

      if (transactionsError || paymentsError || subsError || movementsError || salesError) {
        console.error('Erro ao buscar dados financeiros:', {
          transactionsError,
          paymentsError,
          subsError,
          movementsError,
          salesError
        });
        throw transactionsError || paymentsError || subsError || movementsError || salesError;
      }

      // Calcular receitas das transações (já em euros)
      const customerTransactionsRevenue = (customerTransactions || [])
        .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
      
      // Calcular receitas dos pagamentos legacy (convertendo de centavos)
      const legacyPaymentsRevenue = (legacyPayments || [])
        .reduce((sum, payment) => sum + (payment.amount / 100), 0);
      
      // Receitas das assinaturas
      const subscriptionsRevenue = (activeSubscriptions || [])
        .reduce((sum, subscription) => sum + (subscription.monthly_price || 20), 0);

      // Receitas das vendas do módulo
      const salesRevenue = (salesData || [])
        .reduce((sum, sale) => sum + Number(sale.paid_amount || 0), 0);
      
      // Receitas dos movimentos financeiros
      const movementsRevenue = (financialMovements || [])
        .filter(m => m.movement_type === 'receita')
        .reduce((sum, movement) => sum + Number(movement.amount), 0);
      
      // Despesas dos movimentos financeiros (excluindo estornos)
      const movementsExpenses = (financialMovements || [])
        .filter(m => m.movement_type === 'despesa' && m.category !== 'estorno')
        .reduce((sum, movement) => sum + Number(movement.amount), 0);
      
      // Calcular estornos separadamente
      const totalRefunds = (financialMovements || [])
        .filter(m => m.movement_type === 'despesa' && m.category === 'estorno')
        .reduce((sum, movement) => sum + Number(movement.amount), 0);
      
      const totalRevenue = customerTransactionsRevenue + legacyPaymentsRevenue + subscriptionsRevenue + salesRevenue + movementsRevenue;
      const totalExpenses = movementsExpenses;
      const netProfit = totalRevenue - totalExpenses;
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
      
      console.log('Dados financeiros calculados:', {
        customerTransactionsRevenue,
        legacyPaymentsRevenue,
        subscriptionsRevenue,
        salesRevenue,
        movementsRevenue,
        totalRevenue,
        totalExpenses,
        totalRefunds,
        netProfit,
        profitMargin
      });
      
      return {
        landing_pages: {
          count: (customerTransactions?.length || 0) + (legacyPayments?.length || 0),
          revenue: customerTransactionsRevenue + legacyPaymentsRevenue,
          transactions: [...(customerTransactions || []), ...(legacyPayments || [])]
        },
        senvia_assistant: {
          count: activeSubscriptions?.length || 0,
          revenue: subscriptionsRevenue,
          subscriptions: activeSubscriptions || []
        },
        sales_module: {
          count: salesData?.length || 0,
          revenue: salesRevenue,
          total_value: (salesData || []).filter(sale => sale.sale_status !== 'cancelled').reduce((sum, sale) => sum + Number(sale.total_value || 0), 0),
          pending_amount: (salesData || []).filter(sale => sale.sale_status !== 'cancelled').reduce((sum, sale) => sum + Number(sale.total_value || 0) - Number(sale.paid_amount || 0), 0),
          sales: salesData || []
        },
        financial_movements: {
          revenue: movementsRevenue,
          expenses: movementsExpenses,
          refunds: totalRefunds,
          movements: financialMovements || []
        },
        total_revenue: totalRevenue,
        total_expenses: totalExpenses,
        total_refunds: totalRefunds,
        net_profit: netProfit,
        profit_margin: profitMargin
      };
    },
    refetchInterval: 10000,
  });
};
