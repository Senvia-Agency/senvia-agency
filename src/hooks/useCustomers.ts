import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
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
    },
    refetchInterval: 10000,
  });
};

export const useCustomerTransactions = (customerId?: string) => {
  return useQuery({
    queryKey: ['customer-transactions', customerId],
    queryFn: async () => {
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
    },
    refetchInterval: 10000,
  });
};

export const useConvertLeadToCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ leadId, customerData }: { 
      leadId: string; 
      customerData: {
        full_name: string;
        email: string;
        phone?: string;
        company_name?: string;
        website?: string;
        project_status: string;
        customer_tier: string;
        conversion_value: number;
        notes?: string;
      }
    }) => {
      console.log('Convertendo lead para cliente:', leadId, customerData);
      
      // Buscar dados do lead
      const { data: leadData, error: leadError } = await supabase
        .from('unified_leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (leadError) {
        console.error('Erro ao buscar lead:', leadError);
        throw leadError;
      }

      // Verificar se já existe cliente com este email
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', customerData.email)
        .maybeSingle();

      let customerId;

      if (existingCustomer) {
        // Atualizar cliente existente
        const { data: updatedCustomer, error: updateError } = await supabase
          .from('customers')
          .update({
            full_name: customerData.full_name,
            phone: customerData.phone,
            company_name: customerData.company_name,
            website: customerData.website,
            customer_tier: customerData.customer_tier,
            project_status: customerData.project_status,
            notes: customerData.notes,
            total_spent: customerData.conversion_value,
            last_payment_date: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingCustomer.id)
          .select()
          .single();

        if (updateError) {
          console.error('Erro ao atualizar cliente:', updateError);
          throw updateError;
        }

        customerId = updatedCustomer.id;
      } else {
        // Criar novo cliente
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            full_name: customerData.full_name,
            email: customerData.email,
            phone: customerData.phone,
            company_name: customerData.company_name,
            website: customerData.website,
            original_lead_id: leadId,
            acquisition_source: leadData.source_page,
            stripe_customer_id: leadData.stripe_customer_id,
            customer_tier: customerData.customer_tier,
            project_status: customerData.project_status,
            notes: customerData.notes,
            total_spent: customerData.conversion_value,
            last_payment_date: new Date().toISOString(),
            acquisition_date: leadData.created_at
          })
          .select()
          .single();

        if (customerError) {
          console.error('Erro ao criar cliente:', customerError);
          throw customerError;
        }

        customerId = newCustomer.id;
      }

      // Criar transação do cliente
      const { error: transactionError } = await supabase
        .from('customer_transactions')
        .insert({
          customer_id: customerId,
          lead_id: leadId,
          transaction_type: 'payment',
          amount: customerData.conversion_value,
          currency: 'EUR',
          product_type: leadData.source_page,
          product_description: leadData.source_page === 'landing_page_basic' 
            ? 'Landing Page Básica' 
            : 'Landing Page Premium',
          status: 'completed',
          stripe_payment_intent_id: leadData.stripe_payment_id,
          stripe_session_id: leadData.stripe_session_id
        });

      if (transactionError) {
        console.error('Erro ao criar transação:', transactionError);
        throw transactionError;
      }

      // Atualizar lead como convertido
      const { error: leadUpdateError } = await supabase
        .from('unified_leads')
        .update({
          converted: true,
          conversion_date: new Date().toISOString(),
          conversion_value: customerData.conversion_value,
          lead_status: 'converted',
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (leadUpdateError) {
        console.error('Erro ao atualizar lead:', leadUpdateError);
        throw leadUpdateError;
      }

      return { customerId, leadId };
    },
    onSuccess: () => {
      // Refetch todas as queries relevantes
      queryClient.invalidateQueries({ queryKey: ['unified-leads'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-revenue-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['admin-leads-stats'] });
      console.log('Lead convertido com sucesso!');
    },
    onError: (error) => {
      console.error('Erro na conversão:', error);
    }
  });
};
