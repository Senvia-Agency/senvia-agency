import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface IALead {
  id: string;
  full_name: string;
  whatsapp: string;
  email: string;
  company_name?: string;
  lead_status: string;
  source_page: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useIALeads = () => {
  return useQuery({
    queryKey: ['ia-leads'],
    queryFn: async () => {
      console.log('Buscando leads de IA...');
      
      const { data, error } = await supabase
        .from('leads_ia')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar leads de IA:', error);
        throw error;
      }

      console.log('Leads de IA encontrados:', data?.length);
      return data || [];
    },
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 segundos
  });
};

export const useCreateIALead = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newLead: Omit<IALead, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Criando novo lead de IA:', newLead);
      
      const { data, error } = await supabase
        .from('leads_ia')
        .insert([newLead])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar lead de IA:', error);
        throw error;
      }
      
      console.log('Lead de IA criado com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ia-leads'] });
      toast({
        title: "Lead registrado!",
        description: "Entraremos em contato em breve para agendar sua consultoria."
      });
    },
    onError: (error: any) => {
      console.error('Erro na criação do lead de IA:', error);
      toast({
        title: "Erro ao registrar lead",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};