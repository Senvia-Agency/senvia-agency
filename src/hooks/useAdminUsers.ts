
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
        .select('id, user_id, email, full_name, role')
        .eq('role', 'admin')
        .order('full_name', { ascending: true });

      if (error) {
        console.error('Erro ao buscar usuários admin:', error);
        throw error;
      }
      
      console.log('Usuários admin encontrados:', data);
      console.log('Total de usuários admin:', data?.length || 0);
      
      return data?.map(user => ({
        id: user.id,
        user_id: user.user_id,
        email: user.email || '',
        full_name: user.full_name || user.email || 'Usuário sem nome',
        role: user.role
      })) as AdminUser[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};
