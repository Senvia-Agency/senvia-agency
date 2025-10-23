import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

export interface UnifiedReceivable {
  id: string;
  customer_id: string | null;
  customer_name: string;
  customer_email: string;
  reference_number: string;
  total_value: number;
  paid_amount: number;
  remaining_amount: number;
  due_date: string;
  payment_status: string;
  service_name: string;
  days_overdue: number;
  type: 'sale' | 'recurring'; // Identificar origem
}

export const useUnifiedReceivables = (dateRange: number = 30) => {
  return useQuery({
    queryKey: ['unified-receivables', dateRange],
    queryFn: async () => {
      console.log('Buscando todas as contas a receber (vendas + recorrentes)...');
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      // 1. Buscar vendas não-recorrentes pendentes
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select(`
          *,
          customers(full_name, email),
          unified_leads(full_name, email)
        `)
        .eq('is_recurring', false)
        .in('payment_status', ['pending', 'partial', 'overdue'])
        .neq('sale_status', 'cancelled')
        .gte('created_at', startDate.toISOString())
        .order('sale_date', { ascending: false });

      if (salesError) {
        console.error('Erro ao buscar vendas:', salesError);
        throw salesError;
      }

      // 2. Buscar contas recorrentes pendentes
      const { data: recurring, error: recurringError } = await supabase
        .from('recurring_receivables')
        .select(`
          *,
          customers(full_name, email),
          recurring_services(service_name, id)
        `)
        .in('payment_status', ['pending', 'overdue'])
        .gte('due_date', startDate.toISOString().split('T')[0])
        .order('due_date', { ascending: false });

      if (recurringError) {
        console.error('Erro ao buscar contas recorrentes:', recurringError);
        throw recurringError;
      }

      // 3. Buscar serviços recorrentes ativos (para prever próximas cobranças)
      const { data: activeServices, error: servicesError } = await supabase
        .from('recurring_services')
        .select(`
          *,
          customers(full_name, email)
        `)
        .eq('status', 'active')
        .eq('recurrence_type', 'receita');

      if (servicesError) {
        console.error('Erro ao buscar serviços recorrentes ativos:', servicesError);
        throw servicesError;
      }

      // 4. Criar Set de cobranças recorrentes existentes para evitar duplicatas
      const existingRecurringKeys = new Set<string>();
      (recurring || []).forEach((rec: any) => {
        if (['pending', 'overdue'].includes(rec.payment_status)) {
          const serviceId = rec.recurring_services?.id || rec.recurring_service_id;
          if (serviceId) {
            existingRecurringKeys.add(`${serviceId}|${rec.due_date}`);
          }
        }
      });

      // 5. Combinar e normalizar os dados
      const unifiedReceivables: UnifiedReceivable[] = [];

      // Adicionar vendas
      (sales || []).forEach(sale => {
        const customerName = sale.customers?.full_name || sale.unified_leads?.full_name || 'Cliente Direto';
        const customerEmail = sale.customers?.email || sale.unified_leads?.email || '';
        const dueDate = sale.expected_delivery_date || sale.sale_date;
        const dueDateObj = new Date(dueDate);
        const today = new Date();
        const timeDiff = today.getTime() - dueDateObj.getTime();
        const daysOverdue = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));

        unifiedReceivables.push({
          id: sale.id,
          customer_id: sale.customer_id,
          customer_name: customerName,
          customer_email: customerEmail,
          reference_number: sale.sale_number,
          total_value: Number(sale.total_value),
          paid_amount: Number(sale.paid_amount),
          remaining_amount: Number(sale.remaining_amount || (sale.total_value - sale.paid_amount)),
          due_date: dueDate,
          payment_status: sale.payment_status,
          service_name: sale.service_name,
          days_overdue: daysOverdue,
          type: 'sale'
        });
      });

      // Adicionar contas recorrentes existentes
      (recurring || []).forEach((rec: any) => {
        const customerName = rec.customers?.full_name || 'Cliente Direto';
        const customerEmail = rec.customers?.email || '';
        const dueDateObj = new Date(rec.due_date);
        const today = new Date();
        const timeDiff = today.getTime() - dueDateObj.getTime();
        const daysOverdue = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));

        unifiedReceivables.push({
          id: rec.id,
          customer_id: rec.customer_id,
          customer_name: customerName,
          customer_email: customerEmail,
          reference_number: `REC-${rec.id.slice(0, 8)}`,
          total_value: Number(rec.amount),
          paid_amount: Number(rec.paid_amount || 0),
          remaining_amount: Number(rec.amount - (rec.paid_amount || 0)),
          due_date: rec.due_date,
          payment_status: rec.payment_status,
          service_name: rec.recurring_services?.service_name || 'Serviço Recorrente',
          days_overdue: daysOverdue,
          type: 'recurring'
        });
      });

      // Adicionar serviços recorrentes previstos (que ainda não têm cobrança gerada)
      const today = new Date();
      let projectedCount = 0;
      
      (activeServices || []).forEach((service: any) => {
        // Determinar data de vencimento candidata
        let candidateDate: Date;
        if (service.next_billing_date) {
          candidateDate = new Date(service.next_billing_date);
        } else if (service.billing_day) {
          const currentMonth = today.getMonth();
          const currentYear = today.getFullYear();
          candidateDate = new Date(currentYear, currentMonth, service.billing_day);
          
          // Se a data já passou este mês, considerar o próximo mês
          if (candidateDate < today) {
            candidateDate = new Date(currentYear, currentMonth + 1, service.billing_day);
          }
        } else {
          return; // Sem data de cobrança definida
        }

        // Verificar se está dentro do range de datas
        const candidateDateStr = candidateDate.toISOString().split('T')[0];
        if (candidateDate < startDate) {
          return;
        }

        // Verificar se já existe uma cobrança para este serviço nesta data
        const candidateKey = `${service.id}|${candidateDateStr}`;
        if (existingRecurringKeys.has(candidateKey)) {
          return; // Já existe, não criar previsto
        }

        // Calcular dias em atraso
        const timeDiff = today.getTime() - candidateDate.getTime();
        const daysOverdue = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));

        const customerName = service.customers?.full_name || 'Cliente Direto';
        const customerEmail = service.customers?.email || '';

        unifiedReceivables.push({
          id: `svc-${service.id}-${candidateDateStr}`,
          customer_id: service.customer_id,
          customer_name: customerName,
          customer_email: customerEmail,
          reference_number: `PREV-${service.id.slice(0, 8)}`,
          total_value: Number(service.amount),
          paid_amount: 0,
          remaining_amount: Number(service.amount),
          due_date: candidateDateStr,
          payment_status: 'pending',
          service_name: service.service_name || 'Serviço Recorrente',
          days_overdue: daysOverdue,
          type: 'recurring'
        });
        
        projectedCount++;
      });

      // Ordenar por data de vencimento (mais próximas primeiro)
      unifiedReceivables.sort((a, b) => {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      });

      console.log('Total de contas a receber unificadas:', unifiedReceivables.length);
      console.log('- Vendas:', sales?.length || 0);
      console.log('- Recorrentes (gerados):', recurring?.length || 0);
      console.log('- Recorrentes (previstos):', projectedCount);
      
      return unifiedReceivables;
    },
    refetchInterval: 30000,
  });
};

export const useUnifiedReceivablesStats = (receivables: UnifiedReceivable[]) => {
  return useMemo(() => {
    if (!receivables || receivables.length === 0) {
      return {
        totalPending: 0,
        totalOverdue: 0,
        pendingCount: 0,
        overdueCount: 0,
        averageTicket: 0
      };
    }

    const totalPending = receivables.reduce((sum, rec) => sum + rec.remaining_amount, 0);
    const totalOverdue = receivables
      .filter(rec => rec.days_overdue > 0)
      .reduce((sum, rec) => sum + rec.remaining_amount, 0);
    
    const pendingCount = receivables.length;
    const overdueCount = receivables.filter(rec => rec.days_overdue > 0).length;
    
    const averageTicket = pendingCount > 0 ? totalPending / pendingCount : 0;
    
    return {
      totalPending,
      totalOverdue,
      pendingCount,
      overdueCount,
      averageTicket
    };
  }, [receivables]);
};
