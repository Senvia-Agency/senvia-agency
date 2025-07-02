
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface FinancialMovement {
  id: string;
  movement_type: 'receita' | 'despesa';
  amount: number;
  currency: string;
  description: string;
  category: string;
  movement_date: string;
  customer_id?: string;
  notes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface NewFinancialMovement {
  movement_type: 'receita' | 'despesa';
  amount: number;
  description: string;
  category: string;
  movement_date: string;
  customer_id?: string;
  notes?: string;
}

export const useFinancialMovements = (dateRange: number = 30) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: movements, isLoading } = useQuery({
    queryKey: ['financial-movements', dateRange],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      const { data, error } = await supabase
        .from('financial_movements')
        .select(`
          *,
          customers(full_name, email)
        `)
        .gte('movement_date', startDate.toISOString().split('T')[0])
        .order('movement_date', { ascending: false });

      if (error) throw error;
      return data as (FinancialMovement & { customers?: { full_name: string; email: string } })[];
    },
    refetchInterval: 10000,
  });

  const addMovementMutation = useMutation({
    mutationFn: async (newMovement: NewFinancialMovement) => {
      const { data, error } = await supabase
        .from('financial_movements')
        .insert([newMovement])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-movements'] });
      queryClient.invalidateQueries({ queryKey: ['admin-revenue-metrics'] });
      toast({
        title: "Movimento adicionado",
        description: "O movimento financeiro foi registrado com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar movimento",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateMovementMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FinancialMovement> }) => {
      const { data, error } = await supabase
        .from('financial_movements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-movements'] });
      queryClient.invalidateQueries({ queryKey: ['admin-revenue-metrics'] });
      toast({
        title: "Movimento atualizado",
        description: "O movimento financeiro foi atualizado com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar movimento",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Calcular estatísticas (excluindo estornos das despesas totais)
  const stats = {
    totalReceitas: movements?.filter(m => m.movement_type === 'receita').reduce((sum, m) => sum + Number(m.amount), 0) || 0,
    totalDespesas: movements?.filter(m => m.movement_type === 'despesa' && m.category !== 'estorno').reduce((sum, m) => sum + Number(m.amount), 0) || 0,
    totalEstornos: movements?.filter(m => m.movement_type === 'despesa' && m.category === 'estorno').reduce((sum, m) => sum + Number(m.amount), 0) || 0,
    lucroLiquido: 0,
    margemLucro: 0
  };

  stats.lucroLiquido = stats.totalReceitas - stats.totalDespesas;
  stats.margemLucro = stats.totalReceitas > 0 ? (stats.lucroLiquido / stats.totalReceitas) * 100 : 0;

  return {
    movements: movements || [],
    stats,
    isLoading,
    addMovement: addMovementMutation.mutate,
    isAddingMovement: addMovementMutation.isPending,
    updateMovement: updateMovementMutation.mutate,
    isUpdatingMovement: updateMovementMutation.isPending
  };
};
