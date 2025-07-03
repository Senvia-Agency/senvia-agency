
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminProducts = () => {
  return useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      console.log('Buscando produtos...');
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_plans (
            id,
            name,
            price_monthly,
            price_yearly,
            currency,
            status,
            stripe_price_id_monthly,
            stripe_price_id_yearly
          )
        `)
        .order('created_at', { ascending: false });
      
      console.log('Produtos encontrados:', data);
      
      if (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
      }
      return data || [];
    },
    refetchInterval: 30000,
  });
};
