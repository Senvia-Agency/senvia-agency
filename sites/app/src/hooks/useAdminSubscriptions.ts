
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminSubscriptions = () => {
  return useQuery({
    queryKey: ['admin-active-subscriptions'],
    queryFn: async () => {
      console.log('Buscando todas as assinaturas...');
      
      const { data, error } = await supabase
        .from('senvia_assistant_subscriptions')
        .select('*')
        .in('status', ['active', 'trial'])
        .order('created_at', { ascending: false });
      
      console.log('Assinaturas encontradas:', data);
      
      if (error) {
        console.error('Erro ao buscar assinaturas:', error);
        throw error;
      }
      return data || [];
    },
    refetchInterval: 10000,
  });
};
