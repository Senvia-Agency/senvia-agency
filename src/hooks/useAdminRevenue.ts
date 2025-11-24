
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";

export const useAdminRevenue = (dateRange?: DateRange | undefined) => {
  return useQuery({
    queryKey: ['admin-revenue-metrics', dateRange],
    queryFn: async () => {
      const startDate = dateRange?.from ? new Date(dateRange.from) : null;
      const endDate = dateRange?.to ? new Date(dateRange.to) : null;

      const fromStr = startDate ? startDate.toISOString().split('T')[0] : null;

      // Use next day for end date to include full day
      let endDateStr: string | null = null;
      if (endDate) {
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        endDateStr = nextDay.toISOString().split('T')[0];
      }
      
      console.log('Buscando métricas de receita:', fromStr ? `de ${fromStr} até ${endDateStr}` : 'todos os dados');
      
      // Buscar transações de clientes (sistema novo - dados reais)
      let txQuery = supabase
        .from('customer_transactions')
        .select('*')
        .eq('status', 'completed');
      
      if (fromStr) {
        txQuery = txQuery.gte('created_at', fromStr);
      }
      if (endDateStr) {
        txQuery = txQuery.lt('created_at', endDateStr);
      }
      
      const { data: customerTransactions, error: transactionsError } = await txQuery;

      // Buscar pagamentos confirmados da tabela payments (sistema legado)
      let paymentsQuery = supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid');
      
      if (fromStr) {
        paymentsQuery = paymentsQuery.gte('created_at', fromStr);
      }
      if (endDateStr) {
        paymentsQuery = paymentsQuery.lt('created_at', endDateStr);
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
      
      if (fromStr) {
        salesQuery = salesQuery.gte('created_at', fromStr);
      }
      if (endDateStr) {
        salesQuery = salesQuery.lt('created_at', endDateStr);
      }
      
      const { data: salesData, error: salesError } = await salesQuery;

      // Buscar movimentos financeiros
      let movementsQuery = supabase
        .from('financial_movements')
        .select('*');
      
      if (fromStr) {
        movementsQuery = movementsQuery.gte('movement_date', fromStr);
      }
      if (endDateStr) {
        movementsQuery = movementsQuery.lt('movement_date', endDateStr);
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

      // Criar Map de financial_movements para deduplicação (customer_id|service_name|amount)
      const movementsByCustomerService = new Map();
      (financialMovements || []).forEach(m => {
        if (m.movement_type === 'receita' && m.customer_id) {
          // Extrair nome do serviço da descrição (formato: "Descrição - Nome do Serviço")
          const serviceName = m.description?.split(' - ')[1]?.trim() || m.description?.trim() || '';
          const normalizedAmount = Number(m.amount).toFixed(2);
          const key = `${m.customer_id}|${serviceName}|${normalizedAmount}`;
          movementsByCustomerService.set(key, true);
        }
      });

      // Separar vendas recorrentes das não-recorrentes COM DEDUPLICAÇÃO
      const oneTimeSales = (salesData || []).filter(sale => {
        // Se não tem service_id, é manual (consideramos não-recorrente)
        if (!sale.service_id) return true;
        
        // Se tem service_id, buscar no mapa e verificar se é one_time
        const service = servicesMap.get(sale.service_id);
        return !service || service.service_type === 'one_time';
      }).filter(sale => {
        // Deduplicar: remover vendas que já têm financial_movement
        if (!sale.customer_id) return true;
        const normalizedAmount = Number(sale.paid_amount || 0).toFixed(2);
        const key = `${sale.customer_id}|${sale.service_name.trim()}|${normalizedAmount}`;
        return !movementsByCustomerService.has(key);
      });

      const recurringSales = (salesData || []).filter(sale => {
        // Se tem service_id e é recurring
        if (!sale.service_id) return false;
        const service = servicesMap.get(sale.service_id);
        return service && service.service_type === 'recurring';
      }).filter(sale => {
        // Deduplicar: remover vendas que já têm financial_movement
        if (!sale.customer_id) return true;
        const normalizedAmount = Number(sale.paid_amount || 0).toFixed(2);
        const key = `${sale.customer_id}|${sale.service_name.trim()}|${normalizedAmount}`;
        return !movementsByCustomerService.has(key);
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
