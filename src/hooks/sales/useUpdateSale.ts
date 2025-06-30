
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sale } from "./types";

export const useUpdateSale = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Sale> }) => {
      console.log('Atualizando venda:', id, updates);
      
      const { data, error } = await supabase
        .from('sales')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar venda:', error);
        throw error;
      }
      
      console.log('Venda atualizada com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['admin-revenue-metrics'] });
      toast({
        title: "Venda atualizada",
        description: "A venda foi atualizada com sucesso."
      });
    },
    onError: (error: any) => {
      console.error('Erro na atualização da venda:', error);
      toast({
        title: "Erro ao atualizar venda",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
