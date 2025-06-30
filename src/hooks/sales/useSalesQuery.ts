
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sale } from "./types";

export const useSales = (dateRange: number = 30) => {
  return useQuery({
    queryKey: ['sales', dateRange],
    queryFn: async () => {
      console.log('Buscando vendas para os últimos', dateRange, 'dias');
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          customers(full_name, email),
          unified_leads(full_name, email)
        `)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar vendas:', error);
        throw error;
      }
      
      console.log('Vendas encontradas:', data?.length || 0);
      return data as Sale[];
    },
    staleTime: 30000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });
};
