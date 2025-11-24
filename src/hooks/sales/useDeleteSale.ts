
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDeleteSale = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (saleId: string) => {
      console.log('Excluindo venda:', saleId);
      
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', saleId);

      if (error) {
        console.error('Erro ao excluir venda:', error);
        throw error;
      }
      
      console.log('Venda excluída com sucesso');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['admin-revenue-metrics'] });
      toast({
        title: "Venda excluída",
        description: "A venda foi excluída com sucesso."
      });
    },
    onError: (error: any) => {
      console.error('Erro na exclusão da venda:', error);
      toast({
        title: "Erro ao excluir venda",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
