
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
      console.log('🔍 Buscando usuários admin...');
      
      try {
        // Buscar todos os profiles com role = 'admin'
        const { data: adminProfiles, error } = await supabase
          .from('profiles')
          .select('id, user_id, email, full_name, role, created_at, updated_at')
          .eq('role', 'admin')
          .order('full_name', { ascending: true });
          
        console.log('👑 Usuários admin encontrados:', adminProfiles);
        console.log('❌ Erro na busca:', error);
        
        if (error) {
          console.error('❌ ERRO ao buscar usuários admin:', error);
          throw error;
        }
        
        if (!adminProfiles) {
          console.warn('⚠️ NENHUM PROFILE ADMIN ENCONTRADO!');
          return [];
        }

        // Converter para formato final
        const adminUsers = adminProfiles.map(user => ({
          id: user.id,
          user_id: user.user_id,
          email: user.email || '',
          full_name: user.full_name || user.email || 'Usuário sem nome',
          role: user.role
        })) as AdminUser[];
        
        console.log('✅ RESULTADO FINAL - Usuários admin processados:', adminUsers);
        console.log('📋 LISTA FINAL de nomes dos admins:', adminUsers.map(u => `${u.full_name} (${u.email})`));
        
        if (adminUsers.length === 0) {
          console.warn('⚠️ ATENÇÃO: Nenhum usuário admin foi encontrado!');
          console.warn('⚠️ Verifique se existem usuários com role="admin" na tabela profiles');
        }
        
        return adminUsers;
        
      } catch (error) {
        console.error('💥 ERRO CRÍTICO na busca de usuários admin:', error);
        throw error;
      }
    },
    staleTime: 30000, // Cache por 30 segundos
    gcTime: 300000, // Garbage collect após 5 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};
