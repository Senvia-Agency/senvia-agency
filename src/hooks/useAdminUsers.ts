
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: string;
}

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('Buscando usuários admin...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, email, full_name, role')
        .eq('role', 'admin')
        .order('full_name', { ascending: true });

      if (error) {
        console.error('Erro ao buscar usuários admin:', error);
        throw error;
      }
      
      console.log('Usuários admin encontrados:', data?.length || 0);
      return data as AdminUser[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};
