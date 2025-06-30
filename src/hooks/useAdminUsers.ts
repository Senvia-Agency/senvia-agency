
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
      console.log('Buscando todos os usuários admin...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, email, full_name, role')
        .eq('role', 'admin')
        .order('full_name', { ascending: true });

      if (error) {
        console.error('Erro ao buscar usuários admin:', error);
        throw error;
      }
      
      console.log('Dados brutos retornados da query:', data);
      console.log('Total de registros encontrados:', data?.length || 0);
      
      if (!data || data.length === 0) {
        console.warn('Nenhum usuário admin encontrado na tabela profiles');
        return [];
      }
      
      const adminUsers = data.map(user => ({
        id: user.id,
        user_id: user.user_id,
        email: user.email || '',
        full_name: user.full_name || user.email || 'Usuário sem nome',
        role: user.role
      })) as AdminUser[];
      
      console.log('Usuários admin processados:', adminUsers);
      console.log('Lista de nomes:', adminUsers.map(u => u.full_name));
      
      return adminUsers;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
