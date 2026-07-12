
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useCustomerSubscriptions = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['customer-subscriptions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_subscriptions')
        .select(`
          *,
          products:product_id(*),
          product_plans:plan_id(*)
        `)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useCustomerInvoices = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['customer-invoices', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useCustomerSettings = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['customer-settings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_plans(*)
        `)
        .eq('status', 'active');
      
      if (error) throw error;
      return data;
    },
  });
};
