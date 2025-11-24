
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
