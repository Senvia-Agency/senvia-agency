import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, isWithinInterval } from "date-fns";
import { DateRange } from "@/components/ui/date-range-picker";

export interface FinancialMovement {
  id: string;
  type: 'receita' | 'despesa';
  source: 'casual' | 'recurring' | 'sale';
  amount: number;
  description: string;
  category?: string;
  customer_name?: string;
  customer_id?: string;
  movement_date: string;
  payment_method?: string;
  notes?: string;
  reference?: string;
}

export const useAllFinancialMovements = (dateRange?: DateRange | null) => {
  return useQuery({
    queryKey: ['all-financial-movements', dateRange],
    queryFn: async () => {
      console.log('🔍 Buscando todos os movimentos financeiros...');

      // 1. Buscar movimentos casuais com campos específicos (otimização)
      const { data: casualMovements, error: casualError } = await supabase
        .from('financial_movements')
        .select(`
          id,
          movement_type,
          amount,
          description,
          category,
          customer_id,
          movement_date,
          notes,
          customers(full_name)
        `)
        .order('movement_date', { ascending: false });

      if (casualError) throw casualError;

      // 2. Buscar recorrentes pagos (receitas) com campos específicos
      const { data: recurringReceivables, error: recurringError } = await supabase
        .from('recurring_receivables')
        .select(`
          id,
          amount,
          paid_amount,
          due_date,
          paid_at,
          payment_method,
          notes,
          customer_id,
          customers(full_name),
          recurring_services(service_name)
        `)
        .eq('payment_status', 'paid')
        .order('paid_at', { ascending: false });

      if (recurringError) throw recurringError;

      // Não buscamos despesas recorrentes aqui - elas já aparecem nos KPIs
      // Remover geração de ocorrências mensais para melhorar performance

      // Combinar todos os movimentos
      const movements: FinancialMovement[] = [];

      // Adicionar movimentos casuais
      casualMovements?.forEach(m => {
        movements.push({
          id: m.id,
          type: m.movement_type as 'receita' | 'despesa',
          source: 'casual',
          amount: Number(m.amount),
          description: m.description,
          category: m.category || undefined,
          customer_name: (m.customers as any)?.full_name || undefined,
          customer_id: m.customer_id || undefined,
          movement_date: m.movement_date,
          notes: m.notes || undefined,
        });
      });

      // Adicionar recorrentes pagos (receitas)
      recurringReceivables?.forEach(r => {
        movements.push({
          id: r.id,
          type: 'receita',
          source: 'recurring',
          amount: Number(r.paid_amount || r.amount),
          description: (r.recurring_services as any)?.service_name || 'Serviço Recorrente',
          customer_name: (r.customers as any)?.full_name || undefined,
          customer_id: r.customer_id || undefined,
          movement_date: r.paid_at || r.due_date,
          payment_method: r.payment_method || undefined,
          notes: r.notes || undefined,
          reference: `REC-${r.id.slice(0, 8)}`,
        });
      });

      // Filtrar por dateRange se fornecido
      let filteredMovements = movements;
      if (dateRange?.from && dateRange?.to) {
        filteredMovements = movements.filter(m => {
          const movementDate = new Date(m.movement_date);
          return isWithinInterval(movementDate, {
            start: dateRange.from,
            end: dateRange.to,
          });
        });
      }

      // Ordenar por data (mais recente primeiro)
      filteredMovements.sort((a, b) => 
        new Date(b.movement_date).getTime() - new Date(a.movement_date).getTime()
      );

      console.log('✅ Movimentos encontrados:', {
        total: filteredMovements.length,
        casual: filteredMovements.filter(m => m.source === 'casual').length,
        recurring: filteredMovements.filter(m => m.source === 'recurring').length,
        receitas: filteredMovements.filter(m => m.type === 'receita').length,
        despesas: filteredMovements.filter(m => m.type === 'despesa').length,
      });

      return filteredMovements;
    },
    staleTime: 30000, // Dados considerados "fresh" por 30 segundos
    gcTime: 5 * 60 * 1000, // Cache mantido por 5 minutos
    refetchInterval: false, // Desabilitar refetch automático
    refetchOnWindowFocus: false, // Não refetch ao voltar para aba
  });
};
