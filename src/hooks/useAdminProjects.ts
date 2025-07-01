
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

      // Get user email to find projects assigned to this admin
      const { data: userProfile } = await supabase.auth.getUser();
      const userEmail = userProfile.user?.email;

      if (!userEmail) throw new Error('User email not found');

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
        .eq('assigned_to', userEmail);

      // Apply filters
      if (filters.status !== 'all') {
        query = query.eq('sale_status', filters.status);
      }

      if (filters.search) {
        query = query.or(`service_name.ilike.%${filters.search}%,service_description.ilike.%${filters.search}%,sale_number.ilike.%${filters.search}%`);
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
      }

      const { data, error } = await query.order('sale_date', { ascending: false });

      if (error) {
        console.error('Error fetching admin projects:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!userId,
  });
};
