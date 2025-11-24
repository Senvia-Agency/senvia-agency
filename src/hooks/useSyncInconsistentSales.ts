import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSyncInconsistentSales = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      console.log('🔄 Chamando edge function sync-inconsistent-sales...');
      
      const { data, error } = await supabase.functions.invoke('sync-inconsistent-sales');

      if (error) {
        console.error('❌ Erro na sincronização:', error);
        throw error;
      }

      console.log('✅ Sincronização concluída:', data);
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "✅ Sincronização concluída",
        description: "Vendas inconsistentes foram sincronizadas com sucesso."
      });
    },
    onError: (error: any) => {
      console.error('❌ Erro na sincronização:', error);
      toast({
        title: "❌ Erro na sincronização",
        description: error.message || "Não foi possível sincronizar as vendas.",
        variant: "destructive"
      });
    }
  });
};
