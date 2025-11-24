import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
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
  const startDate = dateRange?.from ? new Date(dateRange.from) : null;
  const endDate = dateRange?.to ? new Date(dateRange.to) : null;
  const fromStrKey = startDate ? format(startDate, 'yyyy-MM-dd') : 'null';
  const toStrKey = endDate ? format(endDate, 'yyyy-MM-dd') : 'null';

  return useQuery({
    queryKey: ['all-financial-movements', { from: fromStrKey, to: toStrKey }],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      console.log('🔍 Buscando todos os movimentos financeiros...');

      // Preparar datas para filtro no banco
      const startDate = dateRange?.from ? new Date(dateRange.from) : null;
      const endDate = dateRange?.to ? new Date(dateRange.to) : null;
      const fromStr = startDate ? format(startDate, 'yyyy-MM-dd') : null;
      
      // Use next day for end date to include full day
      let endDateStr: string | null = null;
      if (endDate) {
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        endDateStr = format(nextDay, 'yyyy-MM-dd');
      }

      // 1. Buscar movimentos casuais com filtro de data no banco
      let casualQuery = supabase
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

      if (fromStr) casualQuery = casualQuery.gte('movement_date', fromStr);
      if (endDateStr) casualQuery = casualQuery.lt('movement_date', endDateStr);

      const { data: casualMovements, error: casualError } = await casualQuery;
      if (casualError) throw casualError;

      // 2. Buscar recorrentes pagos (receitas) com filtro de data
      let receivablesQuery = supabase
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

      if (fromStr) receivablesQuery = receivablesQuery.gte('paid_at', fromStr);
      if (endDateStr) receivablesQuery = receivablesQuery.lt('paid_at', endDateStr);

      const { data: recurringReceivables, error: recurringError } = await receivablesQuery;
      if (recurringError) throw recurringError;

      // 3. Buscar vendas pagas como receitas
      let salesQuery = supabase
        .from('sales')
        .select(`
          id,
          customer_id,
          service_name,
          sale_date,
          paid_amount,
          payment_method,
          notes,
          customers(full_name)
        `)
        .in('payment_status', ['paid', 'completed', 'partial'])
        .gt('paid_amount', 0)
        .order('sale_date', { ascending: false });

      if (fromStr) salesQuery = salesQuery.gte('sale_date', fromStr);
      if (endDateStr) salesQuery = salesQuery.lt('sale_date', endDateStr);

      const { data: salesData, error: salesError } = await salesQuery;
      if (salesError) throw salesError;

      // 4. Buscar despesas recorrentes ativas
      const { data: recurringExpenseServices, error: expenseError } = await supabase
        .from('recurring_services')
        .select(`
          id,
          service_name,
          amount,
          billing_day,
          start_date,
          end_date,
          customer_id,
          customers(full_name)
        `)
        .eq('status', 'active')
        .eq('recurrence_type', 'despesa');

      if (expenseError) throw expenseError;

      // Função auxiliar para gerar ocorrências mensais de despesas recorrentes
      const generateRecurringOccurrences = (
        service: any,
        rangeStart: Date,
        rangeEnd: Date
      ): string[] => {
        const occurrences: string[] = [];
        const serviceStart = new Date(service.start_date);
        const serviceEnd = service.end_date ? new Date(service.end_date) : null;
        
        // Começar na data mais recente entre o início do serviço e o início do range
        let currentDate = new Date(Math.max(serviceStart.getTime(), rangeStart.getTime()));
        
        // Ajustar para o billing_day correto no mês atual
        currentDate.setDate(service.billing_day);
        
        // Se o dia ajustado ficou antes do início, avançar um mês
        if (currentDate < serviceStart || currentDate < rangeStart) {
          currentDate.setMonth(currentDate.getMonth() + 1);
          currentDate.setDate(service.billing_day);
        }
        
        // Gerar ocorrências até o fim do range ou fim do serviço
        while (currentDate <= rangeEnd) {
          if (serviceEnd && currentDate > serviceEnd) break;
          occurrences.push(format(currentDate, 'yyyy-MM-dd'));
          currentDate.setMonth(currentDate.getMonth() + 1);
          currentDate.setDate(service.billing_day);
        }
        
        return occurrences;
      };

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

      // Adicionar vendas pagas como receitas
      salesData?.forEach(sale => {
        movements.push({
          id: sale.id,
          type: 'receita',
          source: 'sale',
          amount: Number(sale.paid_amount),
          description: sale.service_name || 'Venda',
          category: 'Vendas',
          customer_name: (sale.customers as any)?.full_name || undefined,
          customer_id: sale.customer_id || undefined,
          movement_date: sale.sale_date.split('T')[0],
          payment_method: sale.payment_method || undefined,
          notes: sale.notes || undefined,
          reference: `SALE-${sale.id.slice(0, 8)}`,
        });
      });

      // Adicionar despesas recorrentes (gerar ocorrências no período)
      if ((startDate || endDate) && recurringExpenseServices) {
        // Definir range: se só uma data, tratar como período de 1 dia
        const rangeStart = startDate || endDate!;
        const rangeEnd = endDate || startDate!;
        
        recurringExpenseServices.forEach(service => {
          const occurrences = generateRecurringOccurrences(service, rangeStart, rangeEnd);
          occurrences.forEach(dateStr => {
            movements.push({
              id: `REXP-${service.id}-${dateStr.replace(/-/g, '')}`,
              type: 'despesa',
              source: 'recurring',
              amount: Number(service.amount),
              description: service.service_name,
              customer_name: (service.customers as any)?.full_name || undefined,
              customer_id: service.customer_id || undefined,
              movement_date: dateStr,
              notes: 'Despesa recorrente',
              reference: `REXP-${service.id.slice(0, 8)}`,
            });
          });
        });
      }

      // Ordenar por data (mais recente primeiro)
      movements.sort((a, b) => 
        new Date(b.movement_date).getTime() - new Date(a.movement_date).getTime()
      );

      console.log('✅ Movimentos encontrados:', {
        total: movements.length,
        casual: movements.filter(m => m.source === 'casual').length,
        recurring: movements.filter(m => m.source === 'recurring').length,
        sales: movements.filter(m => m.source === 'sale').length,
        receitas: movements.filter(m => m.type === 'receita').length,
        despesas: movements.filter(m => m.type === 'despesa').length,
      });

      return movements;
    },
    staleTime: 0, // Sempre considerado "stale" para atualizações em tempo real
    gcTime: 5 * 60 * 1000, // Cache mantido por 5 minutos
    refetchInterval: false, // Desabilitar refetch automático
    refetchOnWindowFocus: true, // Atualiza ao voltar para a aba
    refetchOnMount: true, // Atualiza ao montar componente
  });
};
