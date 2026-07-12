
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSyncStripeProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      console.log('Iniciando sincronização com Stripe...');
      
      const { data, error } = await supabase.functions.invoke('sync-stripe-products');

      if (error) {
        console.error('Erro na sincronização:', error);
        throw error;
      }

      console.log('Sincronização concluída:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Sincronização bem-sucedida:', data);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      
      toast({
        title: "Sincronização concluída!",
        description: `${data?.results?.products_synced || 0} produtos e ${data?.results?.plans_synced || 0} planos sincronizados.`
      });
    },
    onError: (error) => {
      console.error('Erro na sincronização:', error);
      
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar com o Stripe. Verifique as configurações.",
        variant: "destructive"
      });
    }
  });
};
