
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['admin-revenue-metrics'] });
      
      // Criar atividade no histórico do cliente se a venda tiver customer_id
      if (data.customer_id) {
        createActivity.mutate({
          entity_type: 'customer',
          entity_id: data.customer_id,
          activity_type: 'payment_update',
          title: 'Nova venda registrada',
          description: `Venda #${data.sale_number} criada - ${data.service_name} - €${Number(data.total_value).toFixed(2)}`,
          contact_method: 'sistema'
        });
      }
      
      toast({
        title: "Venda criada",
        description: "A venda foi criada com sucesso."
      });
    },
    onError: (error: any) => {
      console.error('Erro na criação da venda:', error);
      toast({
        title: "Erro ao criar venda",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
