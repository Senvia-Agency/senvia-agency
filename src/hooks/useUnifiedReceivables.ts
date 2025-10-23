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

export const useUnifiedReceivables = () => {
  return useQuery({
    queryKey: ['unified-receivables'],
    queryFn: async () => {
      console.log('Buscando todas as contas a receber (vendas + recorrentes)...');
      
      // 1. Buscar vendas não-recorrentes pendentes (sem filtro de data)
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
        .order('sale_date', { ascending: false });

      if (salesError) {
        console.error('❌ ERRO CRÍTICO ao buscar vendas:', salesError);
        console.error('Detalhes do erro:', JSON.stringify(salesError, null, 2));
        throw salesError;
      }

      // 2. Buscar contas recorrentes pendentes (sem filtro de data)
      const { data: recurring, error: recurringError } = await supabase
        .from('recurring_receivables')
        .select(`
          *,
          customers(full_name, email),
          recurring_services(service_name, id)
        `)
        .in('payment_status', ['pending', 'overdue'])
        .order('due_date', { ascending: false });

      if (recurringError) {
        console.error('❌ ERRO CRÍTICO ao buscar contas recorrentes:', recurringError);
        console.error('Detalhes do erro:', JSON.stringify(recurringError, null, 2));
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
        console.error('❌ ERRO CRÍTICO ao buscar serviços recorrentes ativos:', servicesError);
        console.error('Detalhes do erro:', JSON.stringify(servicesError, null, 2));
        throw servicesError;
      }

      // 3.1. Buscar vendas recorrentes ativas (fallback para vendas sem recurring_service)
      const today = new Date();
      const { data: recurringActiveSales, error: recurringActiveSalesError } = await supabase
        .from('sales')
        .select(`
          *,
          customers(full_name, email),
          unified_leads(full_name, email)
        `)
        .eq('is_recurring', true)
        .in('payment_status', ['recurring', 'pending'])
        .neq('sale_status', 'cancelled')
        .not('recurring_start_date', 'is', null)
        .lte('recurring_start_date', today.toISOString().split('T')[0])
        .order('recurring_start_date', { ascending: false });

      if (recurringActiveSalesError) {
        console.error('❌ ERRO CRÍTICO ao buscar vendas recorrentes:', recurringActiveSalesError);
        console.error('Detalhes do erro:', JSON.stringify(recurringActiveSalesError, null, 2));
        throw recurringActiveSalesError;
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
      // NOTA: Projetamos até 30 dias no futuro para capturar as cobranças iminentes
      // sem inflar excessivamente o KPI "Total a Receber" com valores muito distantes
      let projectedCount = 0;
      
      console.log('🔍 Serviços ativos para previsão:', activeServices?.length || 0);
      activeServices?.forEach((s: any) => {
        console.log(`  - ${s.service_name}: €${s.amount}, next_date: ${s.next_billing_date}, billing_day: ${s.billing_day}`);
      });
      
      (activeServices || []).forEach((service: any) => {
        // Determinar data de vencimento candidata
        let candidateDate: Date;
        if (service.next_billing_date) {
          // Parse da data como UTC para evitar problemas de timezone
          const [year, month, day] = service.next_billing_date.split('-').map(Number);
          candidateDate = new Date(year, month - 1, day);
          console.log(`📅 Serviço ${service.service_name}: next_billing_date = ${service.next_billing_date}, parsed = ${candidateDate.toISOString()}`);
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

        // Verificar se está dentro de 30 dias (usar início do dia para comparação)
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const candidateDateStart = new Date(candidateDate.getFullYear(), candidateDate.getMonth(), candidateDate.getDate());
        const candidateDateStr = candidateDate.toISOString().split('T')[0];
        
        const thirtyDaysFromNow = new Date(todayStart);
        thirtyDaysFromNow.setDate(todayStart.getDate() + 30);
        
        console.log(`⏰ Comparação ${service.service_name}:`, {
          today: todayStart.toISOString().split('T')[0],
          candidateDate: candidateDateStr,
          thirtyDaysLimit: thirtyDaysFromNow.toISOString().split('T')[0],
          isWithin30Days: candidateDateStart <= thirtyDaysFromNow
        });
        
        if (candidateDateStart > thirtyDaysFromNow) {
          console.log(`⏭️ Serviço ${service.service_name} descartado: data ${candidateDateStr} > 30 dias`);
          return; // Muito distante no futuro
        }

        // Verificar se já existe uma cobrança para este serviço nesta data
        const candidateKey = `${service.id}|${candidateDateStr}`;
        if (existingRecurringKeys.has(candidateKey)) {
          console.log(`🔁 Serviço ${service.service_name} descartado: já existe cobrança para ${candidateDateStr}`);
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

      // Adicionar vendas recorrentes que não têm recurring_service (fallback)
      let fallbackCount = 0;
      const existingServiceSaleIds = new Set((activeServices || []).map((s: any) => s.sale_id).filter(Boolean));
      
      (recurringActiveSales || []).forEach((sale: any) => {
        // Verificar se já existe recurring_service para esta venda
        if (existingServiceSaleIds.has(sale.id)) {
          return; // Já tem recurring_service, skip
        }

        if (!sale.recurring_billing_day) {
          return; // Sem dia de cobrança definido
        }

        // Calcular próxima data de cobrança
        const billingDay = sale.recurring_billing_day;
        let nextBillingDate = new Date(today.getFullYear(), today.getMonth(), billingDay);
        if (nextBillingDate <= today) {
          nextBillingDate = new Date(today.getFullYear(), today.getMonth() + 1, billingDay);
        }

        const candidateDateStr = nextBillingDate.toISOString().split('T')[0];
        const timeDiff = today.getTime() - nextBillingDate.getTime();
        const daysOverdue = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));

        const customerName = sale.customers?.full_name || sale.unified_leads?.full_name || 'Cliente Direto';
        const customerEmail = sale.customers?.email || sale.unified_leads?.email || '';

        unifiedReceivables.push({
          id: `sale-recurring-${sale.id}`,
          customer_id: sale.customer_id,
          customer_name: customerName,
          customer_email: customerEmail,
          reference_number: sale.sale_number,
          total_value: Number(sale.total_value),
          paid_amount: Number(sale.paid_amount || 0),
          remaining_amount: Number(sale.remaining_amount || (sale.total_value - (sale.paid_amount || 0))),
          due_date: candidateDateStr,
          payment_status: 'pending',
          service_name: sale.service_name,
          days_overdue: daysOverdue,
          type: 'recurring'
        });

        fallbackCount++;
      });

      // Ordenar por data de vencimento (mais próximas primeiro)
      unifiedReceivables.sort((a, b) => {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      });

      console.log('Total de contas a receber unificadas:', unifiedReceivables.length);
      console.log('- Vendas:', sales?.length || 0);
      console.log('- Recorrentes (gerados):', recurring?.length || 0);
      console.log('- Recorrentes (previstos):', projectedCount);
      console.log('- Recorrentes (fallback vendas sem service):', fallbackCount);
      
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
