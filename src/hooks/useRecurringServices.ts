
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface RecurringService {
  id: string;
  customer_id: string;
  sale_id?: string;
  service_name: string;
  service_description?: string;
  amount: number;
  billing_day: number;
  start_date: string;
  end_date?: string;
  status: 'active' | 'paused' | 'cancelled';
  next_billing_date?: string;
  created_at: string;
  updated_at: string;
  customers?: {
    full_name: string;
    email: string;
  };
}

export interface RecurringReceivable {
  id: string;
  recurring_service_id: string;
  customer_id: string;
  amount: number;
  due_date: string;
  payment_status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paid_at?: string;
  paid_amount?: number;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  customers?: {
    full_name: string;
    email: string;
  };
  recurring_services?: {
    service_name: string;
  };
}

export interface RecurringStats {
  total_active_services: number;
  total_monthly_revenue: number;
  pending_receivables_count: number;
  pending_receivables_amount: number;
  overdue_receivables_count: number;
  overdue_receivables_amount: number;
}

export const useRecurringServices = () => {
  return useQuery({
    queryKey: ['recurring-services'],
    queryFn: async () => {
      console.log('Buscando serviços recorrentes...');
      
      const { data, error } = await supabase
        .from('recurring_services')
        .select(`
          *,
          customers(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar serviços recorrentes:', error);
        throw error;
      }

      console.log('Serviços recorrentes encontrados:', data?.length);
      return data as RecurringService[];
    },
  });
};

export const useRecurringReceivables = () => {
  return useQuery({
    queryKey: ['recurring-receivables'],
    queryFn: async () => {
      console.log('Buscando contas recorrentes...');
      
      const { data, error } = await supabase
        .from('recurring_receivables')
        .select(`
          *,
          customers(full_name, email),
          recurring_services(service_name)
        `)
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Erro ao buscar contas recorrentes:', error);
        throw error;
      }

      console.log('Contas recorrentes encontradas:', data?.length);
      return data as RecurringReceivable[];
    },
  });
};

export const useRecurringStats = () => {
  return useQuery({
    queryKey: ['recurring-stats'],
    queryFn: async () => {
      console.log('Buscando estatísticas de recorrências...');
      
      const { data, error } = await supabase.rpc('get_recurring_stats');

      if (error) {
        console.error('Erro ao buscar estatísticas:', error);
        throw error;
      }

      console.log('Estatísticas obtidas:', data);
      return data[0] as RecurringStats;
    },
    refetchInterval: 60000, // Atualizar a cada minuto
  });
};

export const useCreateRecurringService = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceData: Omit<RecurringService, 'id' | 'created_at' | 'updated_at' | 'customers'>) => {
      console.log('Criando serviço recorrente:', serviceData);
      
      const { data, error } = await supabase
        .from('recurring_services')
        .insert([serviceData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar serviço recorrente:', error);
        throw error;
      }

      return data;
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
      console.error('Erro na criação:', error);
      toast({
        title: "Erro ao criar serviço",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useUpdateRecurringService = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<RecurringService> }) => {
      console.log('Atualizando serviço recorrente:', id, updates);
      
      const { data, error } = await supabase
        .from('recurring_services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar serviço recorrente:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-services'] });
      queryClient.invalidateQueries({ queryKey: ['recurring-stats'] });
      toast({
        title: "Serviço atualizado",
        description: "O serviço recorrente foi atualizado com sucesso."
      });
    },
    onError: (error: any) => {
      console.error('Erro na atualização:', error);
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useMarkReceivableAsPaid = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, paymentData }: { 
      id: string; 
      paymentData: { 
        payment_method: string;
        paid_date?: string;
        notes?: string;
      } 
    }) => {
      console.log('Marcando conta como paga:', id, paymentData);
      
      const { data, error } = await supabase
        .from('recurring_receivables')
        .update({
          status: 'paid',
          paid_date: paymentData.paid_date || new Date().toISOString().split('T')[0],
          payment_method: paymentData.payment_method,
          notes: paymentData.notes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao marcar como pago:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-receivables'] });
      queryClient.invalidateQueries({ queryKey: ['recurring-stats'] });
      queryClient.invalidateQueries({ queryKey: ['accounts-receivable'] });
      toast({
        title: "Pagamento registrado",
        description: "A conta foi marcada como paga com sucesso."
      });
    },
    onError: (error: any) => {
      console.error('Erro ao registrar pagamento:', error);
      toast({
        title: "Erro ao registrar pagamento",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useGenerateRecurringReceivables = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log('Gerando contas recorrentes...');
      
      const { data, error } = await supabase.rpc('generate_recurring_receivables');

      if (error) {
        console.error('Erro ao gerar contas recorrentes:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (generatedCount) => {
      queryClient.invalidateQueries({ queryKey: ['recurring-receivables'] });
      queryClient.invalidateQueries({ queryKey: ['recurring-stats'] });
      queryClient.invalidateQueries({ queryKey: ['accounts-receivable'] });
      toast({
        title: "Contas geradas",
        description: `${generatedCount} novas contas a receber foram geradas.`
      });
    },
    onError: (error: any) => {
      console.error('Erro na geração:', error);
      toast({
        title: "Erro ao gerar contas",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
