
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
      
      // Buscar movimentos manuais da tabela financial_movements
      const { data: manualMovements, error: manualError } = await supabase
        .from('financial_movements')
        .select(`
          *,
          customers(full_name, email)
        `)
        .gte('movement_date', startDate.toISOString().split('T')[0])
        .order('movement_date', { ascending: false });

      if (manualError) throw manualError;

      // Buscar transações de clientes (receitas)
      const { data: customerTransactions, error: transactionsError } = await supabase
        .from('customer_transactions')
        .select(`
          *,
          customers(full_name, email)
        `)
        .eq('status', 'completed')
        .gte('created_at', startDate.toISOString());

      if (transactionsError) throw transactionsError;

      // Buscar vendas (receitas)
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select(`
          *,
          customers(full_name, email)
        `)
        .gte('created_at', startDate.toISOString());

      if (salesError) throw salesError;

      // Buscar pagamentos legacy (receitas)
      const { data: legacyPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .gte('created_at', startDate.toISOString());

      if (paymentsError) throw paymentsError;

      // Converter todas as fontes para o formato padrão
      const allMovements: FinancialMovement[] = [];

      // Adicionar movimentos manuais
      if (manualMovements) {
        allMovements.push(...manualMovements.map(m => ({
          ...m,
          customers: m.customers
        })));
      }

      // Adicionar transações de clientes como receitas
      if (customerTransactions) {
        allMovements.push(...customerTransactions.map(t => ({
          id: t.id,
          movement_type: 'receita' as const,
          amount: t.amount,
          currency: t.currency,
          description: t.product_description || 'Transação de cliente',
          category: t.product_type,
          movement_date: t.created_at.split('T')[0],
          customer_id: t.customer_id,
          notes: null,
          tags: null,
          created_at: t.created_at,
          updated_at: t.created_at,
          customers: t.customers
        })));
      }

      // Adicionar vendas como receitas
      if (sales) {
        allMovements.push(...sales.map(s => ({
          id: s.id,
          movement_type: 'receita' as const,
          amount: s.paid_amount,
          currency: 'EUR',
          description: s.service_name,
          category: 'venda',
          movement_date: s.sale_date.split('T')[0],
          customer_id: s.customer_id,
          notes: s.notes,
          tags: null,
          created_at: s.created_at,
          updated_at: s.updated_at,
          customers: s.customers
        })));
      }

      // Adicionar pagamentos legacy como receitas
      if (legacyPayments) {
        allMovements.push(...legacyPayments.map(p => ({
          id: p.id,
          movement_type: 'receita' as const,
          amount: p.amount / 100, // Converter de centavos para euros
          currency: 'EUR',
          description: 'Landing Page €4.99',
          category: 'landing_page',
          movement_date: p.created_at.split('T')[0],
          customer_id: null,
          notes: null,
          tags: null,
          created_at: p.created_at,
          updated_at: p.updated_at,
          customers: null
        })));
      }

      // Ordenar por data (mais recente primeiro)
      return allMovements.sort((a, b) => 
        new Date(b.movement_date).getTime() - new Date(a.movement_date).getTime()
      );
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
