
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminActivity = () => {
  return useQuery({
    queryKey: ['admin-recent-activity'],
    queryFn: async () => {
      console.log('Buscando atividade recente...');
      
      // Buscar leads unificados recentes
      const { data: recentUnifiedLeads, error: unifiedError } = await supabase
        .from('unified_leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(15);
      
      // Buscar transações de clientes recentes
      const { data: recentCustomerTransactions, error: customerTransactionsError } = await supabase
        .from('customer_transactions')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(10);

      // Buscar pagamentos confirmados (sistema legado)
      const { data: legacyPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (unifiedError || customerTransactionsError || paymentsError) {
        console.error('Erro ao buscar atividade recente:', unifiedError || customerTransactionsError || paymentsError);
        throw unifiedError || customerTransactionsError || paymentsError;
      }
      
      // Formatar leads unificados
      const formattedUnifiedLeads = (recentUnifiedLeads || []).map(lead => ({
        ...lead,
        lead_type: lead.source_page === 'landing_page_basic' ? 'basic' : 'premium',
        source: lead.source_page === 'landing_page_basic' ? 'Landing Page €4.99' : 'Landing Page Premium',
        name: lead.full_name || lead.company_name || 'Nome não informado',
        email_contact: lead.email || 'Email não informado',
        phone_contact: lead.phone || 'Telefone não informado',
        is_paid: lead.payment_status === 'paid' || lead.converted === true
      }));

      // Combinar pagamentos (transações de clientes + pagamentos legacy)
      const allPayments = [
        ...(recentCustomerTransactions || []).map(transaction => ({
          ...transaction,
          // Adicionar email do cliente se disponível
          email: transaction.email || 'Cliente não identificado',
          // Converter amount para centavos se necessário para compatibilidade
          amount: Math.round(Number(transaction.amount) * 100)
        })),
        ...(legacyPayments || [])
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);
      
      console.log('Atividade recente processada:', {
        leads: formattedUnifiedLeads.length,
        payments: allPayments.length,
        customerTransactions: recentCustomerTransactions?.length || 0,
        legacyPayments: legacyPayments?.length || 0
      });
      
      return {
        leads: formattedUnifiedLeads,
        payments: allPayments
      };
    },
    refetchInterval: 10000,
  });
};
