
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useConvertLeadToSale = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      leadId, 
      serviceId, 
      serviceType = 'manual', 
      serviceName, 
      totalValue = 0, 
      notes 
    }: { 
      leadId: string; 
      serviceId?: string; 
      serviceType?: string; 
      serviceName?: string; 
      totalValue?: number; 
      notes?: string; 
    }) => {
      console.log('Convertendo lead em venda:', leadId);
      
      const { data, error } = await supabase.rpc('convert_lead_to_sale', {
        p_lead_id: leadId,
        p_service_id: serviceId,
        p_service_type: serviceType,
        p_service_name: serviceName,
        p_total_value: totalValue,
        p_notes: notes
      });

      if (error) {
        console.error('Erro ao converter lead:', error);
        throw error;
      }
      
      console.log('Lead convertido com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['unified-leads'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-revenue-metrics'] });
      toast({
        title: "Lead convertido",
        description: "Lead convertido em venda com sucesso."
      });
    },
    onError: (error: any) => {
      console.error('Erro na conversão do lead:', error);
      toast({
        title: "Erro na conversão",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
