
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ConvertLeadToCustomerData } from "@/types/customer";

export const useConvertLeadToCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ leadId, customerData }: { 
      leadId: string; 
      customerData: ConvertLeadToCustomerData;
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
