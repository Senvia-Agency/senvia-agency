import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";

// Helper to normalize description for deduplication
const slugify = (text: string): string => {
  return text.toLowerCase().trim().replace(/\s+/g, '-');
};

// Helper to generate monthly occurrences of recurring services
const generateRecurringOccurrences = (
  service: any,
  periodStart: Date | null,
  periodEnd: Date | null
): Array<{ date: string; amount: number; description: string }> => {
  const occurrences: Array<{ date: string; amount: number; description: string }> = [];
  
  const serviceStart = new Date(service.start_date);
  const serviceEnd = service.end_date ? new Date(service.end_date) : new Date();
  const billingDay = service.billing_day;
  
  // Determine bounds
  const startBound = periodStart && periodStart > serviceStart ? periodStart : serviceStart;
  const endBound = periodEnd && periodEnd < serviceEnd ? periodEnd : serviceEnd;
  
  // Start from the first billing date in range
  let current = new Date(startBound);
  current.setDate(billingDay);
  
  // If billing day already passed in start month, move to next month
  if (current < startBound) {
    current.setMonth(current.getMonth() + 1);
  }
  
  // Generate occurrences
  while (current <= endBound) {
    const dateStr = current.toISOString().split('T')[0];
    occurrences.push({
      date: dateStr,
      amount: Number(service.amount),
      description: service.service_name
    });
    current.setMonth(current.getMonth() + 1);
  }
  
  return occurrences;
};

export const useRealFinancialData = (dateRange: DateRange | undefined) => {
  return useQuery({
    queryKey: ['real-financial-data', dateRange],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      const startDate = dateRange?.from ? new Date(dateRange.from) : null;
      const endDate = dateRange?.to ? new Date(dateRange.to) : null;
      
      console.log('Buscando dados financeiros reais desde:', startDate ? startDate.toISOString() : 'todos os tempos');
      
      // Buscar transações de clientes (sistema novo)
      let customerTransactionsQuery = supabase
        .from('customer_transactions')
        .select('*')
        .eq('status', 'completed');
        
      if (startDate) {
        customerTransactionsQuery = customerTransactionsQuery.gte('created_at', startDate.toISOString());
      }
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        customerTransactionsQuery = customerTransactionsQuery.lte('created_at', endOfDay.toISOString());
      }
      
      const { data: customerTransactions, error: transactionsError } = await customerTransactionsQuery;

      // Buscar pagamentos confirmados (sistema legado)
      let legacyPaymentsQuery = supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid');
        
      if (startDate) {
        legacyPaymentsQuery = legacyPaymentsQuery.gte('created_at', startDate.toISOString());
      }
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        legacyPaymentsQuery = legacyPaymentsQuery.lte('created_at', endOfDay.toISOString());
      }
      
      const { data: legacyPayments, error: paymentsError } = await legacyPaymentsQuery;

      // Buscar assinaturas ativas do Senvia Assistant
      let subscriptionsQuery = supabase
        .from('senvia_assistant_subscriptions')
        .select('*')
        .eq('status', 'active');
        
      if (startDate) {
        subscriptionsQuery = subscriptionsQuery.gte('created_at', startDate.toISOString());
      }
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        subscriptionsQuery = subscriptionsQuery.lte('created_at', endOfDay.toISOString());
      }
      
      const { data: activeSubscriptions, error: subsError } = await subscriptionsQuery;

      // Buscar vendas pagas do módulo de vendas (usar sale_date)
      let salesQuery = supabase
        .from('sales')
        .select('*')
        .in('payment_status', ['paid', 'completed', 'partial'])
        .gt('paid_amount', 0);
        
      if (startDate) {
        salesQuery = salesQuery.gte('sale_date', startDate.toISOString().split('T')[0]);
      }
      if (endDate) {
        salesQuery = salesQuery.lte('sale_date', endDate.toISOString().split('T')[0]);
      }
      
      const { data: salesData, error: salesError } = await salesQuery;
      
      // Buscar TODAS as vendas não-canceladas para cálculo de total faturado
      let allSalesQuery = supabase
        .from('sales')
        .select('*')
        .neq('payment_status', 'cancelled');
        
      if (startDate) {
        allSalesQuery = allSalesQuery.gte('sale_date', startDate.toISOString().split('T')[0]);
      }
      if (endDate) {
        allSalesQuery = allSalesQuery.lte('sale_date', endDate.toISOString().split('T')[0]);
      }
      
      const { data: allSalesData, error: allSalesError } = await allSalesQuery;

      // Buscar movimentos financeiros
      let movementsQuery = supabase
        .from('financial_movements')
        .select('*');
        
      if (startDate) {
        movementsQuery = movementsQuery.gte('movement_date', startDate.toISOString().split('T')[0]);
      }
      if (endDate) {
        movementsQuery = movementsQuery.lte('movement_date', endDate.toISOString().split('T')[0]);
      }
      
      const { data: financialMovements, error: movementsError } = await movementsQuery;

      if (transactionsError || paymentsError || subsError || movementsError || salesError || allSalesError) {
        console.error('Erro ao buscar dados financeiros:', {
          transactionsError,
          paymentsError,
          subsError,
          movementsError,
          salesError,
          allSalesError
        });
        throw transactionsError || paymentsError || subsError || movementsError || salesError || allSalesError;
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
      
      // Calcular total faturado (todas as vendas não-canceladas)
      const totalInvoicedAmount = (allSalesData || [])
        .reduce((sum, sale) => sum + Number(sale.total_value || 0), 0);
      
      // Calcular valor efetivamente recebido (pago) no período
      const totalPaidAmount = 
        (customerTransactions || [])
          .filter(t => t.status === 'completed')
          .reduce((sum, t) => sum + Number(t.amount), 0) +
        (legacyPayments || [])
          .filter(p => p.status === 'paid')
          .reduce((sum, p) => sum + (p.amount / 100), 0) +
        (salesData || [])
          .reduce((sum, s) => sum + Number(s.paid_amount || 0), 0);
      
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
        movementsExpenses,
        totalExpenses,
        totalRefunds,
        totalInvoicedAmount,
        totalPaidAmount,
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
          total_value: totalInvoicedAmount,
          pending_amount: (allSalesData || []).reduce((sum, sale) => sum + Number(sale.total_value || 0) - Number(sale.paid_amount || 0), 0),
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
        total_invoiced_amount: totalInvoicedAmount,
        total_paid_amount: totalPaidAmount,
        net_profit: netProfit,
        profit_margin: profitMargin
      };
    },
    staleTime: 60000, // Dados considerados "fresh" por 1 minuto
    gcTime: 5 * 60 * 1000, // Cache mantido por 5 minutos
    refetchInterval: false, // Desabilitar refetch automático
    refetchOnWindowFocus: false, // Não refetch ao voltar para aba
  });
};
