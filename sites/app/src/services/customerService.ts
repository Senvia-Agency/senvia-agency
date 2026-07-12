
import { supabase } from "@/integrations/supabase/client";
import { Customer, CustomerTransaction, CustomerSale } from "@/types/customer";

export const fetchCustomersWithTransactions = async (): Promise<Customer[]> => {
  console.log('Buscando clientes...');
  
  const { data: customers, error } = await supabase
    .from('customers')
    .select(`
      *,
      original_lead:unified_leads(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }

  // Buscar transações dos clientes para calcular o total gasto real
  const { data: transactions, error: transactionsError } = await supabase
    .from('customer_transactions')
    .select('customer_id, amount, status')
    .eq('status', 'completed');

  if (transactionsError) {
    console.error('Erro ao buscar transações:', transactionsError);
  }

  // Buscar vendas dos clientes para incluir valores pagos
  const { data: sales, error: salesError } = await supabase
    .from('sales')
    .select('customer_id, paid_amount');

  if (salesError) {
    console.error('Erro ao buscar vendas:', salesError);
  }

  // Calcular total gasto real para cada cliente
  const customersWithRealTotals = customers?.map(customer => {
    // Somar transações completadas
    const customerTransactions = transactions?.filter(t => t.customer_id === customer.id) || [];
    const transactionsTotal = customerTransactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);

    // Somar valores pagos das vendas
    const customerSales = sales?.filter(s => s.customer_id === customer.id) || [];
    const salesTotal = customerSales.reduce((sum, s) => sum + Number(s.paid_amount || 0), 0);

    const realTotalSpent = transactionsTotal + salesTotal;

    return {
      ...customer,
      total_spent: realTotalSpent // Usar o valor calculado em tempo real
    };
  }) || [];

  console.log('Clientes encontrados:', customersWithRealTotals?.length);
  return customersWithRealTotals;
};

export const fetchCustomerTransactions = async (customerId?: string) => {
  let query = supabase
    .from('customer_transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (customerId) {
    query = query.eq('customer_id', customerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar transações:', error);
    throw error;
  }

  return data || [];
};
