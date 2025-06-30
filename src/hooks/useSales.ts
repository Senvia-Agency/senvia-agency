
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Sale {
  id: string;
  customer_id?: string;
  lead_id?: string;
  sale_number: string;
  sale_date: string;
  service_id?: string;
  service_type: 'stripe_product' | 'custom_service' | 'manual';
  service_name: string;
  service_description?: string;
  total_value: number;
  paid_amount: number;
  remaining_amount: number;
  sale_status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'partial' | 'paid' | 'overdue';
  payment_method?: string;
  expected_delivery_date?: string;
  delivered_at?: string;
  notes?: string;
  internal_notes?: string;
  commission_rate: number;
  assigned_to?: string;
  stripe_payment_intent_id?: string;
  stripe_session_id?: string;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
  customers?: {
    full_name: string;
    email: string;
  };
  unified_leads?: {
    full_name: string;
    email: string;
  };
}

export const useSales = (dateRange: number = 30) => {
  return useQuery({
    queryKey: ['sales', dateRange],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          customers(full_name, email),
          unified_leads(full_name, email)
        `)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Sale[];
    },
  });
};

export const useCreateSale = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newSale: Omit<Sale, 'id' | 'sale_number' | 'remaining_amount' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('sales')
        .insert([newSale])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['admin-revenue-metrics'] });
      toast({
        title: "Venda criada",
        description: "A venda foi criada com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar venda",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useUpdateSale = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Sale> }) => {
      const { data, error } = await supabase
        .from('sales')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['admin-revenue-metrics'] });
      toast({
        title: "Venda atualizada",
        description: "A venda foi atualizada com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar venda",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useConvertLeadToSale = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      leadId, 
      serviceId, 
      serviceType = 'manual', 
      serviceName, 
      totalValue = 0, 
      notes 
    }: { 
      leadId: string; 
      serviceId?: string; 
      serviceType?: string; 
      serviceName?: string; 
      totalValue?: number; 
      notes?: string; 
    }) => {
      const { data, error } = await supabase.rpc('convert_lead_to_sale', {
        p_lead_id: leadId,
        p_service_id: serviceId,
        p_service_type: serviceType,
        p_service_name: serviceName,
        p_total_value: totalValue,
        p_notes: notes
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['unified-leads'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-revenue-metrics'] });
      toast({
        title: "Lead convertido",
        description: "Lead convertido em venda com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro na conversão",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
