
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSyncStripePayments = () => {
  return useMutation({
    mutationFn: async () => {
      console.log('Iniciando sincronização de pagamentos do Stripe...');
      
      const { data, error } = await supabase.functions.invoke('sync-stripe-payments');

      if (error) {
        console.error('Erro na sincronização:', error);
        throw error;
      }

      console.log('Sincronização concluída:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Sincronização de pagamentos bem-sucedida:', data);
    },
    onError: (error) => {
      console.error('Erro na sincronização de pagamentos:', error);
    }
  });
};
