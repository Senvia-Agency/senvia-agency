
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
      const { data, error } = await supabase
        .from('activity_history')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ActivityHistory[];
    },
    enabled: !!entityId
  });
};

export const useCreateActivity = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activity: Omit<ActivityHistory, 'id' | 'created_at' | 'updated_at'>) => {
      const { activity_type, title, contact_person, contact_method, created_by, ...rest } = activity;
      const insertData = {
        ...rest,
        action: activity_type || 'note',
        performed_by: created_by || null,
        metadata: { ...(activity.metadata || {}), contact_person, contact_method },
      };
      const { data, error } = await supabase
        .from('activity_history')
        .insert(insertData as any)
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
