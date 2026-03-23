
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCreateActivity } from "@/hooks/useActivityHistory";

export interface EntityContact {
  id: string;
  entity_type: 'lead' | 'customer';
  entity_id: string;
  contact_name: string;
  contact_person?: string;
  contact_role?: string;
  contact_email?: string;
  contact_phone?: string;
  is_primary: boolean;
  assigned_at?: string;
  assigned_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useEntityContacts = (entityType: 'lead' | 'customer', entityId: string) => {
  return useQuery({
    queryKey: ['entity-contacts', entityType, entityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entity_contacts')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('is_primary', { ascending: false });

      if (error) throw error;
      return data as EntityContact[];
    },
    enabled: !!entityId
  });
};

export const useCreateEntityContact = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createActivity = useCreateActivity();

  return useMutation({
    mutationFn: async (contact: Omit<EntityContact, 'id' | 'created_at' | 'updated_at' | 'assigned_at'>) => {
      const { contact_person, ...rest } = contact;
      const insertData = { ...rest, contact_name: contact_person || contact.contact_name || '' };
      const { data, error } = await supabase
        .from('entity_contacts')
        .insert(insertData as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['entity-contacts', data.entity_type, data.entity_id] 
      });
      
      // Criar atividade no histórico
      createActivity.mutate({
        entity_type: data.entity_type,
        entity_id: data.entity_id,
        activity_type: 'contact',
        title: 'Novo responsável adicionado',
        description: `Responsável ${data.contact_person}${data.contact_role ? ` (${data.contact_role})` : ''} foi atribuído`,
        contact_person: data.contact_person,
        contact_method: 'sistema'
      });
      
      toast({
        title: "Contato adicionado",
        description: "O responsável foi atribuído com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar contato",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useUpdateEntityContact = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contactId, updates }: { contactId: string; updates: Partial<EntityContact> }) => {
      const { data, error } = await supabase
        .from('entity_contacts')
        .update(updates)
        .eq('id', contactId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['entity-contacts', data.entity_type, data.entity_id] 
      });
      toast({
        title: "Contato atualizado",
        description: "As informações foram atualizadas com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar contato",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
