
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CustomService {
  id: string;
  name: string;
  description?: string;
  base_price: number;
  category: string;
  service_type: 'one_time' | 'recurring' | 'custom';
  pricing_model: 'fixed' | 'hourly' | 'project';
  estimated_hours?: number;
  includes_features: string[];
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export const useCustomServices = () => {
  return useQuery({
    queryKey: ['custom-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CustomService[];
    },
  });
};

export const useCreateCustomService = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newService: Omit<CustomService, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('custom_services')
        .insert([newService])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-services'] });
      toast({
        title: "Serviço criado",
        description: "O serviço personalizado foi criado com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar serviço",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useUpdateCustomService = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CustomService> }) => {
      const { data, error } = await supabase
        .from('custom_services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-services'] });
      toast({
        title: "Serviço atualizado",
        description: "O serviço foi atualizado com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar serviço",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

// Nova função para criar serviço recorrente a partir de serviço personalizado
export const useCreateRecurringFromCustomService = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      customServiceId: string;
      customerId: string;
      billingDay: number;
      startDate: string;
    }) => {
      // Buscar dados do serviço personalizado
      const { data: customService, error: serviceError } = await supabase
        .from('custom_services')
        .select('*')
        .eq('id', data.customServiceId)
        .single();

      if (serviceError) throw serviceError;

      // Criar serviço recorrente
      const { data: recurringService, error } = await supabase
        .from('recurring_services')
        .insert([{
          customer_id: data.customerId,
          service_id: data.customServiceId,
          service_name: customService.name,
          service_description: customService.description,
          monthly_amount: customService.base_price,
          billing_day: data.billingDay,
          start_date: data.startDate,
          next_billing_date: data.startDate,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;
      return recurringService;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-services'] });
      queryClient.invalidateQueries({ queryKey: ['recurring-stats'] });
      toast({
        title: "Serviço recorrente criado",
        description: "O serviço recorrente foi criado com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar serviço recorrente",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
