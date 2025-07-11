
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ActivityHistory {
  id: string;
  entity_type: 'lead' | 'customer';
  entity_id: string;
  activity_type: 'contact' | 'status_change' | 'note_added' | 'payment_update' | 'conversion' | 'email_sent' | 'call_made' | 'meeting_scheduled';
  title: string;
  description?: string;
  contact_person?: string;
  contact_method?: string;
  metadata?: any;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useActivityHistory = (entityType: 'lead' | 'customer', entityId: string) => {
  return useQuery({
    queryKey: ['activity-history', entityType, entityId],
    queryFn: async () => {
      if (entityType === 'customer') {
        // Para clientes, buscar atividades do cliente E do lead original
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .select('original_lead_id')
          .eq('id', entityId)
          .single();

        if (customerError && customerError.code !== 'PGRST116') {
          throw customerError;
        }

        // Buscar atividades do cliente
        const customerQuery = supabase
          .from('activity_history')
          .select('*')
          .eq('entity_type', 'customer')
          .eq('entity_id', entityId);

        // Buscar atividades do lead original se existir
        let leadQuery = null;
        if (customer?.original_lead_id) {
          leadQuery = supabase
            .from('activity_history')
            .select('*')
            .eq('entity_type', 'lead')
            .eq('entity_id', customer.original_lead_id);
        }

        const [customerResult, leadResult] = await Promise.all([
          customerQuery,
          leadQuery
        ]);

        if (customerResult.error) throw customerResult.error;
        if (leadResult && leadResult.error) throw leadResult.error;

        // Combinar e ordenar atividades
        const allActivities = [
          ...(customerResult.data || []),
          ...(leadResult?.data || [])
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return allActivities as ActivityHistory[];
      } else {
        // Para leads, buscar apenas atividades do lead
        const { data, error } = await supabase
          .from('activity_history')
          .select('*')
          .eq('entity_type', entityType)
          .eq('entity_id', entityId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data as ActivityHistory[];
      }
    },
    enabled: !!entityId
  });
};

export const useCreateActivity = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activity: Omit<ActivityHistory, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('activity_history')
        .insert(activity)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['activity-history', data.entity_type, data.entity_id] 
      });
      toast({
        title: "Atividade registrada",
        description: "O histórico foi atualizado com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao registrar atividade",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
