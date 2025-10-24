
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
  customer_id?: string | null;
  notes?: string;
}

export const useFinancialMovements = (dateRange: number | null = 30) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: movements, isLoading } = useQuery({
    queryKey: ['financial-movements', dateRange],
    queryFn: async () => {
      let startDate = null;
      if (dateRange) {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - dateRange);
      }
      
      // Buscar movimentos manuais da tabela financial_movements
      let manualMovementsQuery = supabase
        .from('financial_movements')
        .select(`
          *,
          customers(full_name, email)
        `);
        
      if (startDate) {
        manualMovementsQuery = manualMovementsQuery.gte('movement_date', startDate.toISOString().split('T')[0]);
      }
      
      const { data: manualMovements, error: manualError } = await manualMovementsQuery
        .order('movement_date', { ascending: false });

      if (manualError) throw manualError;

      // Buscar transações de clientes (receitas)
      let customerTransactionsQuery = supabase
        .from('customer_transactions')
        .select(`
          *,
          customers(full_name, email)
        `)
        .eq('status', 'completed')
        .gt('amount', 0);
        
      if (startDate) {
        customerTransactionsQuery = customerTransactionsQuery.gte('created_at', startDate.toISOString());
      }
      
      const { data: customerTransactions, error: transactionsError } = await customerTransactionsQuery;

      if (transactionsError) throw transactionsError;

      // Buscar vendas (receitas) - apenas vendas com valor pago > 0
      let salesQuery = supabase
        .from('sales')
        .select(`
          *,
          customers(full_name, email)
        `)
        .gt('paid_amount', 0);
        
      if (startDate) {
        salesQuery = salesQuery.gte('created_at', startDate.toISOString());
      }
      
      const { data: sales, error: salesError } = await salesQuery;

      if (salesError) throw salesError;

      // Buscar pagamentos legacy (receitas)
      let legacyPaymentsQuery = supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .gt('amount', 0);
        
      if (startDate) {
        legacyPaymentsQuery = legacyPaymentsQuery.gte('created_at', startDate.toISOString());
      }
      
      const { data: legacyPayments, error: paymentsError } = await legacyPaymentsQuery;

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
          updated_at: p.created_at,
          customers: null
        })));
      }

      // Filtrar movimentos duplicados (evitar contar a mesma receita duas vezes)
      // Se uma venda tem valor pago > 0, remover transações correspondentes para evitar duplicação
      const salesCustomerIds = new Set(
        (sales || [])
          .filter(s => s.paid_amount > 0)
          .map(s => s.customer_id)
      );
      
      const filteredMovements = allMovements.filter(movement => {
        // Se é uma transação de cliente e há uma venda paga para o mesmo cliente, filtrar
        if (movement.category?.includes('landing_page') && 
            movement.customer_id && 
            salesCustomerIds.has(movement.customer_id)) {
          return false;
        }
        return movement.amount > 0;
      });

      // Ordenar por data (mais recente primeiro)
      return filteredMovements.sort((a, b) => 
        new Date(b.movement_date).getTime() - new Date(a.movement_date).getTime()
      );
    },
    refetchInterval: 10000,
  });

  const addMovementMutation = useMutation({
    mutationFn: async (newMovement: NewFinancialMovement) => {
      const payload = {
        ...newMovement,
        customer_id: newMovement.customer_id && newMovement.customer_id !== 'none' && newMovement.customer_id.trim() !== ''
          ? newMovement.customer_id
          : null,
        notes: newMovement.notes ?? null,
      };

      const { data, error } = await supabase
        .from('financial_movements')
        .insert([payload])
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
      console.log('Tentando atualizar movimento:', id, updates);
      
      // Primeiro, tentar atualizar na tabela financial_movements
      const { data: financialMovement, error: financialError } = await supabase
        .from('financial_movements')
        .update({
          movement_type: updates.movement_type,
          amount: updates.amount,
          description: updates.description,
          category: updates.category,
          movement_date: updates.movement_date,
          customer_id: updates.customer_id || null,
          notes: updates.notes || null
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (financialError) {
        console.error('Erro ao atualizar na tabela financial_movements:', financialError);
      }

      if (financialMovement) {
        console.log('Movimento atualizado na tabela financial_movements:', financialMovement);
        return financialMovement;
      }

      // Se não encontrou na tabela financial_movements, tentar nas outras tabelas
      // Tentar atualizar na tabela sales
      const { data: saleMovement, error: saleError } = await supabase
        .from('sales')
        .update({
          service_name: updates.description,
          paid_amount: updates.amount,
          notes: updates.notes,
          sale_date: updates.movement_date ? new Date(updates.movement_date).toISOString() : undefined
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (saleError) {
        console.error('Erro ao atualizar na tabela sales:', saleError);
      }

      if (saleMovement) {
        console.log('Movimento atualizado na tabela sales:', saleMovement);
        return saleMovement;
      }

      // Tentar atualizar na tabela customer_transactions
      const { data: transactionMovement, error: transactionError } = await supabase
        .from('customer_transactions')
        .update({
          product_description: updates.description,
          amount: updates.amount
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (transactionError) {
        console.error('Erro ao atualizar na tabela customer_transactions:', transactionError);
      }

      if (transactionMovement) {
        console.log('Movimento atualizado na tabela customer_transactions:', transactionMovement);
        return transactionMovement;
      }

      throw new Error('Movimento não encontrado em nenhuma tabela para atualização');
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
      console.error('Erro na mutation:', error);
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
