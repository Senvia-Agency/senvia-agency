import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  setting_key?: string;
  setting_value?: any;
  setting_type?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useSystemSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      console.log('Buscando configurações do sistema...');
      
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('setting_type', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar configurações:', error);
        throw error;
      }
      
      console.log('Configurações encontradas:', data);
      return data as SystemSetting[];
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      console.log('Atualizando configuração:', key, value);
      
      const { data, error } = await supabase
        .from('system_settings')
        .update({ 
          setting_value: typeof value === 'string' ? JSON.stringify(value) : value 
        })
        .eq('setting_key', key)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar configuração:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      console.log('Configuração atualizada com sucesso:', data);
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast({
        title: "Configuração atualizada",
        description: "A configuração foi salva com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar configuração:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a configuração.",
        variant: "destructive"
      });
    }
  });

  const updateMultipleSettingsMutation = useMutation({
    mutationFn: async (updates: { key: string; value: any }[]) => {
      console.log('Atualizando múltiplas configurações:', updates);
      
      const promises = updates.map(({ key, value }) =>
        supabase
          .from('system_settings')
          .update({ 
            setting_value: typeof value === 'string' ? JSON.stringify(value) : value 
          })
          .eq('setting_key', key)
      );
      
      const results = await Promise.all(promises);
      
      for (const result of results) {
        if (result.error) {
          console.error('Erro ao atualizar configuração:', result.error);
          throw result.error;
        }
      }
      
      return results;
    },
    onSuccess: () => {
      console.log('Todas as configurações foram atualizadas');
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast({
        title: "Configurações salvas",
        description: "Todas as configurações foram atualizadas com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar configurações:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    }
  });

  // Helper para obter valor de uma configuração específica
  const getSetting = (key: string, defaultValue: any = null) => {
    const setting = settings?.find(s => s.setting_key === key);
    if (!setting) return defaultValue;
    
    // Parse JSON se necessário
    try {
      return JSON.parse(setting.setting_value);
    } catch {
      return setting.setting_value;
    }
  };

  // Helper para obter configurações por tipo
  const getSettingsByType = (type: string) => {
    return settings?.filter(s => s.setting_type === type) || [];
  };

  return {
    settings,
    isLoading,
    getSetting,
    getSettingsByType,
    updateSetting: updateSettingMutation.mutate,
    updateMultipleSettings: updateMultipleSettingsMutation.mutate,
    isUpdating: updateSettingMutation.isPending || updateMultipleSettingsMutation.isPending
  };
};