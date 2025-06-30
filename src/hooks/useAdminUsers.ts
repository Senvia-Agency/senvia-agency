
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
      
      try {
        // Primeira verificação: ver todos os profiles
        const { data: allProfiles, error: allError } = await supabase
          .from('profiles')
          .select('*');
          
        console.log('📊 TODOS os profiles encontrados:', allProfiles);
        console.log('📊 Quantidade total de profiles:', allProfiles?.length || 0);
        
        if (allError) {
          console.error('❌ Erro ao buscar todos os profiles:', allError);
          throw allError;
        }
        
        if (allProfiles && allProfiles.length > 0) {
          // Log detalhado de cada usuário
          allProfiles.forEach((profile, index) => {
            console.log(`👤 Profile ${index + 1}:`, {
              id: profile.id,
              user_id: profile.user_id,
              email: profile.email,
              full_name: profile.full_name,
              role: profile.role
            });
          });
          
          // Filtrar admins manualmente no JavaScript para debugging
          const adminProfiles = allProfiles.filter(p => p.role === 'admin');
          console.log('👑 Admins filtrados no JavaScript:', adminProfiles);
          console.log('👑 Quantidade de admins após filtro JS:', adminProfiles.length);
        }
        
        // Segunda query: buscar apenas os admins diretamente
        const { data: adminData, error: adminError } = await supabase
          .from('profiles')
          .select('id, user_id, email, full_name, role')
          .eq('role', 'admin')
          .order('full_name', { ascending: true });

        console.log('🎯 Query específica para admins - Raw data:', adminData);
        console.log('🎯 Query específica para admins - Error:', adminError);

        if (adminError) {
          console.error('❌ Erro ao buscar usuários admin:', adminError);
          throw adminError;
        }
        
        if (!adminData || adminData.length === 0) {
          console.warn('⚠️ Nenhum usuário admin encontrado na query específica');
          console.warn('⚠️ Isso indica um problema na query .eq("role", "admin")');
          
          // Fallback: filtrar manualmente
          const fallbackAdmins = allProfiles?.filter(p => p.role === 'admin') || [];
          console.log('🔄 Usando fallback - Admins encontrados:', fallbackAdmins.length);
          
          const adminUsers = fallbackAdmins.map(user => ({
            id: user.id,
            user_id: user.user_id,
            email: user.email || '',
            full_name: user.full_name || user.email || 'Usuário sem nome',
            role: user.role
          })) as AdminUser[];
          
          console.log('✅ Retornando dados do fallback:', adminUsers);
          return adminUsers;
        }
        
        const adminUsers = adminData.map(user => ({
          id: user.id,
          user_id: user.user_id,
          email: user.email || '',
          full_name: user.full_name || user.email || 'Usuário sem nome',
          role: user.role
        })) as AdminUser[];
        
        console.log('✅ Usuários admin processados (query principal):', adminUsers);
        console.log('📋 Lista final de nomes dos admins:', adminUsers.map(u => `${u.full_name} (${u.email})`));
        
        return adminUsers;
        
      } catch (error) {
        console.error('💥 Erro geral na busca de usuários admin:', error);
        throw error;
      }
    },
    staleTime: 0, // Sem cache para debugging
    gcTime: 0, // Sem cache para debugging
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: false,
  });
};
