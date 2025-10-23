
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AccountReceivable {
  id: string;
  customer_id: string | null;
  customer_name: string;
  customer_email: string;
  sale_number: string;
  total_value: number;
  paid_amount: number;
  remaining_amount: number;
  expected_delivery_date?: string;
  due_date?: string; // Data de vencimento/cobrança
  sale_date: string;
  payment_status: string;
  sale_status: string;
  service_name: string;
  days_overdue: number;
}

export const useAccountsReceivable = (dateRange: number = 30) => {
  return useQuery({
    queryKey: ['accounts-receivable', dateRange],
    queryFn: async () => {
      console.log('Buscando contas a receber...');
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      const { data: sales, error } = await supabase
        .from('sales')
        .select(`
          *,
          customers(full_name, email),
          unified_leads(full_name, email)
        `)
        .eq('is_recurring', false) // Excluir vendas recorrentes (não são contas a receber)
        .in('payment_status', ['pending', 'partial', 'overdue'])
        .neq('sale_status', 'cancelled') // Filtrar projetos cancelados
        .gte('created_at', startDate.toISOString())
        .order('sale_date', { ascending: false });

      if (error) {
        console.error('Erro ao buscar contas a receber:', error);
        throw error;
      }

      const accountsReceivable: AccountReceivable[] = (sales || []).map(sale => {
        const customerName = sale.customers?.full_name || sale.unified_leads?.full_name || 'Cliente Direto';
        const customerEmail = sale.customers?.email || sale.unified_leads?.email || '';
        
        // Data de vencimento: usa expected_delivery_date ou sale_date como padrão
        const dueDate = sale.expected_delivery_date || sale.sale_date;
        const dueDateObj = new Date(dueDate);
        const today = new Date();
        const timeDiff = today.getTime() - dueDateObj.getTime();
        const daysOverdue = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));

        return {
          id: sale.id,
          customer_id: sale.customer_id,
          customer_name: customerName,
          customer_email: customerEmail,
          sale_number: sale.sale_number,
          total_value: Number(sale.total_value),
          paid_amount: Number(sale.paid_amount),
          remaining_amount: Number(sale.remaining_amount || (sale.total_value - sale.paid_amount)),
          expected_delivery_date: sale.expected_delivery_date,
          due_date: dueDate,
          sale_date: sale.sale_date,
          payment_status: sale.payment_status,
          sale_status: sale.sale_status,
          service_name: sale.service_name,
          days_overdue: daysOverdue
        };
      });

      console.log('Contas a receber encontradas:', accountsReceivable.length);
      return accountsReceivable;
    },
    refetchInterval: 30000,
  });
};

export const useUpdateDueDate = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ saleId, newDueDate }: { saleId: string; newDueDate: string }) => {
      console.log('Atualizando data de vencimento:', saleId, newDueDate);
      
      const { data, error } = await supabase
        .from('sales')
        .update({ expected_delivery_date: newDueDate })
        .eq('id', saleId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar data de vencimento:', error);
        throw error;
      }
      
      console.log('Data de vencimento atualizada:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts-receivable'] });
      toast({
        title: "Data atualizada",
        description: "Data de vencimento atualizada com sucesso."
      });
    },
    onError: (error: any) => {
      console.error('Erro na atualização da data:', error);
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useAccountsReceivableStats = (accounts: AccountReceivable[]) => {
  if (!accounts) return null;

  const totalPending = accounts.reduce((sum, account) => sum + account.remaining_amount, 0);
  const totalOverdue = accounts
    .filter(account => account.days_overdue > 0)
    .reduce((sum, account) => sum + account.remaining_amount, 0);
  
  const pendingCount = accounts.length;
  const overdueCount = accounts.filter(account => account.days_overdue > 0).length;
  
  const averageTicket = pendingCount > 0 ? totalPending / pendingCount : 0;
  
  return {
    totalPending,
    totalOverdue,
    pendingCount,
    overdueCount,
    averageTicket
  };
};
