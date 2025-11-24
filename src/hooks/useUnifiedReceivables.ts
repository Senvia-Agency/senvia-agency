import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";
import { format, startOfDay } from "date-fns";

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
      try {
        console.log('🔄 [useUnifiedReceivables] INICIANDO busca de contas a receber...');
        
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
        .neq('payment_status', 'cancelled')
        .order('sale_date', { ascending: false });

      if (salesError) {
        console.error('❌ ERRO CRÍTICO ao buscar vendas:', salesError);
        console.error('Detalhes do erro:', JSON.stringify(salesError, null, 2));
        throw salesError;
      }
      
      console.log('✅ [SALES] Vendas encontradas:', sales?.length || 0, sales);

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
      
      console.log('✅ [RECURRING] Recurring_receivables encontrados:', recurring?.length || 0, recurring);

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
      
      console.log('✅ [SERVICES] Serviços ativos encontrados:', activeServices?.length || 0, activeServices);

      // 3.1. Buscar recurring_receivables pagos para excluir suas vendas originais
      const { data: paidReceivables, error: paidReceivablesError } = await supabase
        .from('recurring_receivables')
        .select('id, recurring_service_id, payment_status')
        .eq('payment_status', 'paid');

      if (paidReceivablesError) {
        console.error('❌ ERRO ao buscar receivables pagos:', paidReceivablesError);
        throw paidReceivablesError;
      }

      // Buscar os sale_ids dos recurring_services que têm receivables pagos
      const paidServiceIds = new Set((paidReceivables || []).map(r => r.recurring_service_id));
      
      const { data: paidServices, error: paidServicesError } = await supabase
        .from('recurring_services')
        .select('id, sale_id')
        .in('id', Array.from(paidServiceIds));

      if (paidServicesError) {
        console.error('❌ ERRO ao buscar services com receivables pagos:', paidServicesError);
        throw paidServicesError;
      }

      // Criar Set de sale_ids que já têm receivables pagos
      const paidRecurringSaleIds = new Set(
        (paidServices || [])
          .filter(s => s.sale_id)
          .map(s => s.sale_id)
      );

      console.log('📊 Vendas recorrentes com receivables pagos (excluir):', paidRecurringSaleIds.size);

      // 3.2. Buscar vendas recorrentes ativas (fallback para vendas sem recurring_service)
      const today = new Date();
      const todayStr = format(today, 'yyyy-MM-dd');
      
      let recurringActiveSalesQuery = supabase
        .from('sales')
        .select(`
          *,
          customers(full_name, email),
          unified_leads(full_name, email)
        `)
        .eq('is_recurring', true)
        .in('payment_status', ['recurring', 'pending'])
        .neq('payment_status', 'cancelled')
        .not('recurring_start_date', 'is', null)
        .lte('recurring_start_date', todayStr);

      // CORREÇÃO 1: Excluir vendas que já têm receivables pagos
    if (paidRecurringSaleIds.size > 0) {
      recurringActiveSalesQuery = recurringActiveSalesQuery
        .not('id', 'in', `(${Array.from(paidRecurringSaleIds).join(',')})`);
      }

      const { data: recurringActiveSales, error: recurringActiveSalesError } = await recurringActiveSalesQuery
        .order('recurring_start_date', { ascending: false });

      if (recurringActiveSalesError) {
        console.error('❌ ERRO CRÍTICO ao buscar vendas recorrentes:', recurringActiveSalesError);
        console.error('Detalhes do erro:', JSON.stringify(recurringActiveSalesError, null, 2));
        throw recurringActiveSalesError;
      }

      console.log('✅ Vendas recorrentes ativas encontradas:', recurringActiveSales?.length || 0);

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
          // Parse da data como local para evitar problemas de timezone
          const [year, month, day] = service.next_billing_date.split('-').map(Number);
          candidateDate = new Date(year, month - 1, day);
          
          // ✅ CORREÇÃO: Se a data está no passado, avançar para o próximo mês
          while (candidateDate < today) {
            candidateDate.setMonth(candidateDate.getMonth() + 1);
          }
          
          console.log(`📅 Serviço ${service.service_name}: next_billing_date = ${service.next_billing_date}, ajustado = ${format(candidateDate, 'yyyy-MM-dd')}`);
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
        const todayStart = startOfDay(today);
        const candidateDateStart = startOfDay(candidateDate);
        const candidateDateStr = format(candidateDate, 'yyyy-MM-dd');
        
        const thirtyDaysFromNow = new Date(todayStart);
        thirtyDaysFromNow.setDate(todayStart.getDate() + 30);
        
        console.log(`⏰ Comparação ${service.service_name}:`, {
          today: format(todayStart, 'yyyy-MM-dd'),
          candidateDate: candidateDateStr,
          thirtyDaysLimit: format(thirtyDaysFromNow, 'yyyy-MM-dd'),
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

        const candidateDateStr = format(nextBillingDate, 'yyyy-MM-dd');
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

      console.log('📊 Total de contas a receber unificadas:', unifiedReceivables.length);
      console.log('- Vendas:', sales?.length || 0);
      console.log('- Recorrentes (gerados):', recurring?.length || 0);
      console.log('- Recorrentes (previstos):', projectedCount);
      console.log('- Recorrentes (fallback vendas sem service):', fallbackCount);
      
      // ⚠️ VALIDAÇÃO: Verificar se array está vazio
      if (unifiedReceivables.length === 0) {
        console.warn('⚠️ [ALERTA] ARRAY VAZIO! Dados disponíveis:', {
          sales: sales?.length || 0,
          recurring: recurring?.length || 0,
          activeServices: activeServices?.length || 0,
          projectedCount,
          fallbackCount
        });
      }
      
      console.log('🎯 [RETORNO] Retornando array com', unifiedReceivables.length, 'contas:', unifiedReceivables);
      return unifiedReceivables;
      
      } catch (error) {
        console.error('💥 [ERRO FATAL] Erro no useUnifiedReceivables:', error);
        console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');
        throw error;
      }
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
    refetchInterval: 30000,
  });
};

export const useUnifiedReceivablesStats = (receivables: UnifiedReceivable[]) => {
  return useMemo(() => {
    const totalPending = receivables
      .filter(r => r.payment_status === 'pending' || r.payment_status === 'partial')
      .reduce((sum, r) => sum + Number(r.remaining_amount || 0), 0);

    const totalOverdue = receivables
      .filter(r => r.days_overdue > 0)
      .reduce((sum, r) => sum + Number(r.remaining_amount || 0), 0);

    const pendingCount = receivables.filter(r => 
      r.payment_status === 'pending' || r.payment_status === 'partial'
    ).length;

    const overdueCount = receivables.filter(r => r.days_overdue > 0).length;

    return {
      totalPending,
      totalOverdue,
      pendingCount,
      overdueCount,
      averageTicket: pendingCount > 0 ? totalPending / pendingCount : 0,
    };
  }, [receivables]);
};

export const filterReceivablesByStatus = (
  receivables: UnifiedReceivable[], 
  status: 'all' | 'overdue'
): UnifiedReceivable[] => {
  if (status === 'overdue') {
    return receivables.filter(rec => rec.days_overdue > 0);
  }
  return receivables;
};
