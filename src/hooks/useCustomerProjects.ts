
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectFilters {
  status: string;
  search: string;
  dateRange: string;
}

export const useCustomerProjects = (userId: string | undefined, filters: ProjectFilters) => {
  return useQuery({
    queryKey: ['customer-projects', userId, filters],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      // First, get the customer record for this user
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('email', (await supabase.auth.getUser()).data.user?.email)
        .single();

      if (customerError) {
        console.error('Error fetching customer:', customerError);
        return [];
      }

      if (!customer) {
        return [];
      }

      // Build the query for sales/projects
      let query = supabase
        .from('sales')
        .select('*')
        .eq('customer_id', customer.id);

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
        console.error('Error fetching projects:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!userId,
  });
};
