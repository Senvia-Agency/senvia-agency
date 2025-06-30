
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
      console.log('🔍 Iniciando busca COMPLETA por usuários admin...');
      
      try {
        // Primeira tentativa: buscar TODOS os profiles sem filtro
        console.log('📋 ETAPA 1: Buscando TODOS os profiles...');
        const { data: allProfiles, error: allError } = await supabase
          .from('profiles')
          .select('*')
          .order('full_name', { ascending: true });
          
        console.log('📊 TODOS os profiles brutos:', allProfiles);
        console.log('📊 Erro na busca geral:', allError);
        console.log('📊 Total de profiles encontrados:', allProfiles?.length || 0);
        
        if (allError) {
          console.error('❌ ERRO CRÍTICO ao buscar profiles:', allError);
          throw allError;
        }
        
        if (!allProfiles) {
          console.warn('⚠️ NENHUM PROFILE ENCONTRADO!');
          return [];
        }

        // Log detalhado de CADA profile encontrado
        console.log('📋 ETAPA 2: Analisando cada profile encontrado...');
        allProfiles.forEach((profile, index) => {
          console.log(`👤 Profile ${index + 1}:`, {
            id: profile.id,
            user_id: profile.user_id,
            email: profile.email,
            full_name: profile.full_name,
            role: profile.role,
            created_at: profile.created_at,
            updated_at: profile.updated_at
          });
          
          // Verificação específica do role
          if (profile.role === 'admin') {
            console.log(`✅ ADMIN ENCONTRADO: ${profile.full_name} (${profile.email})`);
          } else {
            console.log(`❌ NÃO É ADMIN: ${profile.full_name} - Role: "${profile.role}"`);
          }
        });
        
        // Filtrar admins manualmente
        console.log('📋 ETAPA 3: Filtrando admins manualmente...');
        const adminProfiles = allProfiles.filter(profile => {
          const isAdmin = profile.role === 'admin';
          console.log(`🔍 Verificando ${profile.full_name}: role="${profile.role}" isAdmin=${isAdmin}`);
          return isAdmin;
        });
        
        console.log('👑 ADMINS FILTRADOS MANUALMENTE:', adminProfiles);
        console.log('👑 TOTAL DE ADMINS ENCONTRADOS:', adminProfiles.length);
        
        // Segunda tentativa: query específica para admins
        console.log('📋 ETAPA 4: Fazendo query específica para role=admin...');
        const { data: specificAdmins, error: specificError } = await supabase
          .from('profiles')
          .select('id, user_id, email, full_name, role, created_at, updated_at')
          .eq('role', 'admin')
          .order('full_name', { ascending: true });

        console.log('🎯 Query específica - Resultado:', specificAdmins);
        console.log('🎯 Query específica - Erro:', specificError);
        console.log('🎯 Query específica - Total:', specificAdmins?.length || 0);

        if (specificError) {
          console.error('❌ Erro na query específica:', specificError);
        }

        // Terceira tentativa: usando ilike para ser mais flexível
        console.log('📋 ETAPA 5: Tentativa com ilike...');
        const { data: ilikeAdmins, error: ilikeError } = await supabase
          .from('profiles')
          .select('*')
          .ilike('role', 'admin')
          .order('full_name', { ascending: true });

        console.log('🔍 Query com ilike - Resultado:', ilikeAdmins);
        console.log('🔍 Query com ilike - Erro:', ilikeError);
        console.log('🔍 Query com ilike - Total:', ilikeAdmins?.length || 0);

        // Comparação dos resultados
        console.log('📋 ETAPA 6: Comparando resultados...');
        console.log('🔢 Filtro manual encontrou:', adminProfiles.length, 'admins');
        console.log('🔢 Query .eq() encontrou:', specificAdmins?.length || 0, 'admins');
        console.log('🔢 Query .ilike() encontrou:', ilikeAdmins?.length || 0, 'admins');

        // Usar o resultado com mais dados
        let finalAdmins = adminProfiles;
        
        if (specificAdmins && specificAdmins.length > finalAdmins.length) {
          console.log('✅ Usando resultado da query específica (.eq)');
          finalAdmins = specificAdmins;
        }
        
        if (ilikeAdmins && ilikeAdmins.length > finalAdmins.length) {
          console.log('✅ Usando resultado da query ilike');
          finalAdmins = ilikeAdmins;
        }

        // Converter para formato final
        const adminUsers = finalAdmins.map(user => ({
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
    staleTime: 0,
    gcTime: 0,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};
