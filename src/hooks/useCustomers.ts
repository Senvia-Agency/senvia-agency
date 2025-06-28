
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
    refetchInterval: 5000, // Reduzido para 5 segundos para sincronização mais rápida
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

// Hook para sincronizar automaticamente leads convertidos
export const useSyncConvertedLeads = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      console.log('Sincronizando leads convertidos...');
      
      // Buscar leads com payment_status = 'paid' que ainda não foram convertidos
      const { data: paidLeads, error: leadsError } = await supabase
        .from('unified_leads')
        .select('*')
        .eq('payment_status', 'paid')
        .eq('converted', false);

      if (leadsError) throw leadsError;

      console.log('Leads pagos encontrados para conversão:', paidLeads?.length);

      // Processar cada lead pago
      const results = [];
      for (const lead of paidLeads || []) {
        try {
          // Verificar se já existe cliente com este email
          const { data: existingCustomer } = await supabase
            .from('customers')
            .select('id')
            .eq('email', lead.email)
            .maybeSingle();

          if (!existingCustomer) {
            // Usar a função RPC para converter
            const { data: customerId } = await supabase.rpc('convert_lead_to_customer', {
              lead_id: lead.id
            });
            
            results.push({ leadId: lead.id, customerId, status: 'converted' });
            console.log(`Lead ${lead.id} convertido para cliente ${customerId}`);
          } else {
            // Apenas marcar como convertido se o cliente já existe
            await supabase
              .from('unified_leads')
              .update({
                converted: true,
                conversion_date: new Date().toISOString(),
                lead_status: 'converted'
              })
              .eq('id', lead.id);
              
            results.push({ leadId: lead.id, customerId: existingCustomer.id, status: 'already_exists' });
            console.log(`Lead ${lead.id} marcado como convertido (cliente já existia)`);
          }
        } catch (error) {
          console.error(`Erro ao processar lead ${lead.id}:`, error);
          results.push({ leadId: lead.id, status: 'error', error: error.message });
        }
      }

      return results;
    },
    onSuccess: (results) => {
      const convertedCount = results?.filter(r => r.status === 'converted').length || 0;
      const alreadyExistsCount = results?.filter(r => r.status === 'already_exists').length || 0;
      
      console.log(`Sincronização concluída: ${convertedCount} novos clientes, ${alreadyExistsCount} já existiam`);
      
      // Atualizar queries
      queryClient.invalidateQueries({ queryKey: ['unified-leads'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error) => {
      console.error('Erro na sincronização:', error);
    }
  });
};
