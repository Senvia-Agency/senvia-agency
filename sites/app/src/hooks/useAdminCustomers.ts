
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminCustomers = (dateRange: number = 30) => {
  return useQuery({
    queryKey: ['admin-customers', dateRange],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      console.log('Buscando dados de clientes desde:', startDate.toISOString());
      
      // Buscar clientes
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      // Buscar transações dos clientes
      const { data: transactions, error: transactionsError } = await supabase
        .from('customer_transactions')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (customersError || transactionsError) {
        console.error('Erro ao buscar dados de clientes:', customersError || transactionsError);
        throw customersError || transactionsError;
      }

      // Calcular estatísticas
      const totalCustomers = customers?.length || 0;
      const totalTransactions = transactions?.length || 0;
      const totalRevenue = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

      // Agrupar por tipo de produto
      const productBreakdown = transactions?.reduce((acc, transaction) => {
        const productType = transaction.product_type || 'outros';
        if (!acc[productType]) {
          acc[productType] = { count: 0, revenue: 0 };
        }
        acc[productType].count += 1;
        acc[productType].revenue += Number(transaction.amount);
        return acc;
      }, {} as Record<string, { count: number; revenue: number }>) || {};

      console.log('Estatísticas de clientes calculadas:', {
        totalCustomers,
        totalTransactions,
        totalRevenue,
        avgOrderValue,
        productBreakdown
      });

      return {
        customers: customers || [],
        transactions: transactions || [],
        stats: {
          total_customers: totalCustomers,
          total_transactions: totalTransactions,
          total_revenue: totalRevenue,
          avg_order_value: avgOrderValue,
          product_breakdown: productBreakdown
        }
      };
    },
    refetchInterval: 10000,
  });
};
