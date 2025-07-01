
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

      // Build the query for sales/projects assigned to this admin
      // First, let's try by user ID directly
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
        .eq('assigned_to', userId);

      console.log('🔍 Primeira tentativa: Buscando por assigned_to =', userId);

      let { data: salesByUserId, error: errorByUserId } = await query.order('sale_date', { ascending: false });

      if (errorByUserId) {
        console.error('❌ Erro ao buscar por user ID:', errorByUserId);
      }

      console.log('📊 Projetos encontrados por User ID:', salesByUserId?.length || 0);

      // Se não encontrou por user ID, vamos tentar por email
      let salesByEmail = [];
      if (!salesByUserId || salesByUserId.length === 0) {
        console.log('🔍 Tentando buscar por email...');
        
        // Get user profile to find the email
        const { data: userProfile, error: userError } = await supabase
          .from('profiles')
          .select('email')
          .eq('user_id', userId)
          .single();

        if (userError) {
          console.error('❌ Erro ao buscar perfil do usuário:', userError);
        } else if (userProfile?.email) {
          console.log('👤 Email do usuário logado:', userProfile.email);

          // Try searching by email
          const { data: emailResults, error: emailError } = await supabase
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
            .eq('assigned_to', userProfile.email)
            .order('sale_date', { ascending: false });

          if (emailError) {
            console.error('❌ Erro ao buscar por email:', emailError);
          } else {
            salesByEmail = emailResults || [];
            console.log('📊 Projetos encontrados por Email:', salesByEmail.length);
          }
        }
      }

      // Use whichever method found results
      const data = (salesByUserId && salesByUserId.length > 0) ? salesByUserId : salesByEmail;

      console.log('🔍 Filtros aplicados:', filters);

      // Apply filters to the results
      let filteredData = data;

      if (filters.status !== 'all') {
        filteredData = filteredData.filter(sale => sale.sale_status === filters.status);
        console.log('📊 Após filtro de status:', filteredData.length);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredData = filteredData.filter(sale => 
          sale.service_name?.toLowerCase().includes(searchTerm) ||
          sale.service_description?.toLowerCase().includes(searchTerm) ||
          sale.sale_number?.toLowerCase().includes(searchTerm)
        );
        console.log('🔍 Após filtro de busca:', filteredData.length);
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
        
        filteredData = filteredData.filter(sale => new Date(sale.sale_date) >= startDate);
        console.log('📅 Após filtro de data:', filteredData.length);
      }

      console.log('✅ Projetos finais encontrados:', filteredData.length);
      console.log('📋 Dados dos projetos:', filteredData);

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
        console.log('👤 Comparando com User ID:', userId);
      }

      return filteredData || [];
    },
    enabled: !!userId,
  });
};
