
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sale } from "./types";
import { useCreateActivity } from "@/hooks/useActivityHistory";

export const useCreateSale = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createActivity = useCreateActivity();
  
  return useMutation({
    mutationFn: async (newSale: Omit<Sale, 'id' | 'sale_number' | 'remaining_amount' | 'created_at' | 'updated_at'>) => {
      console.log('Criando nova venda:', newSale);
      
      const { data, error } = await supabase
        .from('sales')
        .insert([newSale])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar venda:', error);
        throw error;
      }
      
      console.log('Venda criada com sucesso:', data);
      return data;
    },
    onSuccess: async (data) => {
      console.log('✅ [CREATE SALE] Venda criada, processando pós-criação...', data);
      
      // ===== 1. CRIAR MOVIMENTO FINANCEIRO SE HOUVE PAGAMENTO =====
      if (data.paid_amount > 0) {
        console.log('💰 [FINANCIAL] Criando movimento financeiro:', data.paid_amount);
        
        const { error: movementError } = await supabase
          .from('financial_movements')
          .insert({
            movement_type: 'receita',
            category: 'venda',
            description: `Pagamento venda ${data.sale_number} - ${data.service_name}`,
            amount: data.paid_amount,
            movement_date: new Date().toISOString().split('T')[0],
            customer_id: data.customer_id,
            notes: data.payment_method ? `Método: ${data.payment_method}` : null
          });
        
        if (movementError) {
          console.error('❌ [FINANCIAL] Erro ao criar movimento:', movementError);
        } else {
          console.log('✅ [FINANCIAL] Movimento financeiro criado');
        }
      }
      
      // ===== 2. PROCESSAR SERVIÇO RECORRENTE SE APLICÁVEL =====
      if (data.is_recurring && data.customer_id) {
        console.log('🔄 [RECURRING] Processando serviço recorrente...');
        
        // Buscar o recurring_service criado pelo trigger
        const { data: recurringService, error: fetchError } = await supabase
          .from('recurring_services')
          .select('id, next_billing_date')
          .eq('sale_id', data.id)
          .single();
        
        if (fetchError || !recurringService) {
          console.error('❌ [RECURRING] Erro ao buscar recurring_service:', fetchError);
        } else {
          console.log('✅ [RECURRING] Recurring service encontrado:', recurringService);
          
          // Se houve pagamento, criar recurring_receivable como pago
          if (data.paid_amount > 0) {
            console.log('💰 [RECEIVABLE] Criando receivable pago para serviço recorrente...');
            
            const { error: receivableError } = await supabase
              .from('recurring_receivables')
              .insert({
                recurring_service_id: recurringService.id,
                customer_id: data.customer_id,
                amount: data.total_value,
                due_date: data.recurring_start_date || data.due_date,
                payment_status: data.payment_status === 'paid' ? 'paid' : 'partial',
                paid_amount: data.paid_amount,
                paid_at: new Date().toISOString(),
                payment_method: data.payment_method,
                notes: `Pagamento inicial da venda ${data.sale_number}`
              });
            
            if (receivableError) {
              console.error('❌ [RECEIVABLE] Erro ao criar receivable:', receivableError);
            } else {
              console.log('✅ [RECEIVABLE] Receivable criado como pago');
            }
            
            // Atualizar next_billing_date para o próximo mês
            const currentDate = new Date(data.recurring_start_date || data.due_date);
            const nextMonth = new Date(currentDate);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            const nextBillingDate = nextMonth.toISOString().split('T')[0];
            
            console.log('📅 [RECURRING] Atualizando next_billing_date para:', nextBillingDate);
            
            const { error: updateError } = await supabase
              .from('recurring_services')
              .update({ next_billing_date: nextBillingDate })
              .eq('id', recurringService.id);
            
            if (updateError) {
              console.error('❌ [RECURRING] Erro ao atualizar next_billing_date:', updateError);
            } else {
              console.log('✅ [RECURRING] Next billing date atualizado');
            }
          }
        }
      }
      
      // Invalidar queries relevantes
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['admin-revenue-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['recurring-services'] });
      queryClient.invalidateQueries({ queryKey: ['recurring-receivables'] });
      queryClient.invalidateQueries({ queryKey: ['recurring-stats'] });
      queryClient.invalidateQueries({ queryKey: ['real-financial-data'] });
      queryClient.invalidateQueries({ queryKey: ['all-financial-movements'] });
      queryClient.invalidateQueries({ queryKey: ['unified-receivables'] });
      
      // Criar atividade no histórico do cliente
      if (data.customer_id) {
        createActivity.mutate({
          entity_type: 'customer',
          entity_id: data.customer_id,
          activity_type: data.is_recurring ? 'status_change' : 'payment_update',
          title: data.is_recurring ? 'Serviço recorrente iniciado' : 'Nova venda registrada',
          description: data.is_recurring 
            ? `Serviço recorrente "${data.service_name}" iniciado - €${Number(data.total_value).toFixed(2)}/mês - Cobrança todo dia ${data.recurring_billing_day}`
            : `Venda #${data.sale_number} criada - ${data.service_name} - €${Number(data.total_value).toFixed(2)}`,
          contact_method: 'sistema'
        });
      }
      
      // Toast de sucesso
      toast({
        title: "Venda criada",
        description: data.is_recurring 
          ? "Venda criada e serviço recorrente configurado com sucesso!" 
          : "A venda foi criada com sucesso."
      });
    },
    onError: (error: any) => {
      console.error('❌ [HOOK] Erro na criação da venda:', error);
      console.error('❌ [HOOK] Detalhes do erro:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      toast({
        title: "❌ Erro ao criar venda",
        description: error.message || 'Erro desconhecido ao criar venda',
        variant: "destructive"
      });
    }
  });
};
