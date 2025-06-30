
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
      console.log('🔍 Iniciando busca por usuários admin...');
      
      // Primeira verificação: ver todos os profiles
      const { data: allProfiles, error: allError } = await supabase
        .from('profiles')
        .select('id, user_id, email, full_name, role');
        
      console.log('📊 Todos os profiles na tabela:', allProfiles);
      console.log('📊 Quantidade total de profiles:', allProfiles?.length || 0);
      
      if (allError) {
        console.error('❌ Erro ao buscar todos os profiles:', allError);
        throw allError;
      }
      
      if (allProfiles && allProfiles.length > 0) {
        console.log('📊 Roles encontrados:', allProfiles.map(p => ({ email: p.email, role: p.role })));
        const adminCount = allProfiles.filter(p => p.role === 'admin').length;
        console.log('👑 Quantidade de admins encontrados:', adminCount);
        
        // Log detalhado de cada usuário admin
        const adminUsers = allProfiles.filter(p => p.role === 'admin');
        console.log('👥 Usuários admin encontrados:', adminUsers.map(u => ({
          id: u.id,
          user_id: u.user_id,
          email: u.email,
          full_name: u.full_name,
          role: u.role
        })));
      }
      
      // Buscar apenas os admins
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, email, full_name, role')
        .eq('role', 'admin')
        .order('full_name', { ascending: true });

      if (error) {
        console.error('❌ Erro ao buscar usuários admin:', error);
        throw error;
      }
      
      console.log('✅ Dados admin retornados da query:', data);
      console.log('✅ Total de admins encontrados:', data?.length || 0);
      
      if (!data || data.length === 0) {
        console.warn('⚠️ Nenhum usuário admin encontrado na tabela profiles');
        console.warn('⚠️ Verifique se existem usuários com role="admin" na tabela');
        return [];
      }
      
      const adminUsers = data.map(user => ({
        id: user.id,
        user_id: user.user_id,
        email: user.email || '',
        full_name: user.full_name || user.email || 'Usuário sem nome',
        role: user.role
      })) as AdminUser[];
      
      console.log('🎯 Usuários admin processados:', adminUsers);
      console.log('📋 Lista de nomes dos admins:', adminUsers.map(u => `${u.full_name} (${u.email})`));
      
      return adminUsers;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true, // Forçar refetch quando voltar para a janela
    refetchOnMount: true, // Sempre refetch quando o componente for montado
  });
};
