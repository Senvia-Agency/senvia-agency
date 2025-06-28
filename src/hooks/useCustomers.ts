
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      console.log('Buscando clientes...');
      
      const { data, error } = await supabase
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

      console.log('Clientes encontrados:', data?.length);
      return data || [];
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
    mutationFn: async (leadId: string) => {
      console.log('Convertendo lead para cliente:', leadId);
      
      const { data, error } = await supabase.rpc('convert_lead_to_customer', {
        lead_id: leadId
      });

      if (error) {
        console.error('Erro ao converter lead:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Refetch leads e clientes
      queryClient.invalidateQueries({ queryKey: ['unified-leads'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      console.log('Lead convertido com sucesso!');
    },
    onError: (error) => {
      console.error('Erro na conversão:', error);
    }
  });
};
