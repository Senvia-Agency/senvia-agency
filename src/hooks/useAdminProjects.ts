
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectFilters {
  status: string;
  search: string;
  dateRange: string;
}

export const useAdminProjects = (userId: string | undefined, filters: ProjectFilters) => {
  return useQuery({
    queryKey: ['admin-projects', userId, filters],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      console.log('🔍 useAdminProjects - Buscando projetos para usuário:', userId);

      // Get user profile to find the email
      const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('user_id', userId)
        .single();

      if (userError) {
        console.error('❌ Erro ao buscar perfil do usuário:', userError);
        throw userError;
      }

      if (!userProfile?.email) {
        console.error('❌ Email do usuário não encontrado');
        throw new Error('User email not found');
      }

      console.log('👤 Email do usuário logado:', userProfile.email);

      // Build the query for sales/projects assigned to this admin
      let query = supabase
        .from('sales')
        .select(`
          *,
          customers (
            full_name,
            email,
            phone,
            company_name
          )
        `)
        .eq('assigned_to', userProfile.email);

      console.log('🔍 Filtros aplicados:', filters);

      // Apply filters
      if (filters.status !== 'all') {
        query = query.eq('sale_status', filters.status);
        console.log('📊 Filtrando por status:', filters.status);
      }

      if (filters.search) {
        query = query.or(`service_name.ilike.%${filters.search}%,service_description.ilike.%${filters.search}%,sale_number.ilike.%${filters.search}%`);
        console.log('🔍 Filtrando por busca:', filters.search);
      }

      if (filters.dateRange !== 'all') {
        const now = new Date();
        let startDate: Date;
        
        switch (filters.dateRange) {
          case 'last_30_days':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'last_3_months':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          case 'last_6_months':
            startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
            break;
          case 'this_year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          default:
            startDate = new Date(0);
        }
        
        query = query.gte('sale_date', startDate.toISOString());
        console.log('📅 Filtrando por data a partir de:', startDate.toISOString());
      }

      console.log('🚀 Executando query para buscar vendas...');
      const { data, error } = await query.order('sale_date', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar projetos do admin:', error);
        throw error;
      }

      console.log('✅ Projetos encontrados:', data?.length || 0);
      console.log('📋 Dados dos projetos:', data);

      // Debug: Let's also check all sales to see what's available
      const { data: allSales, error: allSalesError } = await supabase
        .from('sales')
        .select('id, sale_number, service_name, assigned_to')
        .limit(10);

      if (!allSalesError) {
        console.log('🔍 DEBUG - Todas as vendas (primeiras 10):');
        allSales?.forEach(sale => {
          console.log(`  - ${sale.sale_number}: ${sale.service_name} (assigned_to: "${sale.assigned_to}")`);
        });
        console.log('👤 Comparando com email do usuário:', userProfile.email);
      }

      return data || [];
    },
    enabled: !!userId,
  });
};
