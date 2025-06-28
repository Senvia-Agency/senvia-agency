
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUnifiedLeads = () => {
  return useQuery({
    queryKey: ['unified-leads'],
    queryFn: async () => {
      console.log('Buscando leads unificados...');
      
      const { data, error } = await supabase
        .from('unified_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar leads unificados:', error);
        throw error;
      }

      console.log('Leads unificados encontrados:', data?.length);
      return data || [];
    },
    refetchInterval: 10000,
  });
};

export const useUpdateUnifiedLead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ leadId, updates }: { leadId: string; updates: any }) => {
      console.log('Atualizando lead unificado:', leadId, updates);
      
      const { data, error } = await supabase
        .from('unified_leads')
        .update(updates)
        .eq('id', leadId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar lead:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-leads'] });
      console.log('Lead atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro na atualização:', error);
    }
  });
};
