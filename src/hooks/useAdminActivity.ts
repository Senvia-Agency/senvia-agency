
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
      
      // Buscar leads legacy para compatibilidade
      const { data: recentLegacyBasic, error: basicError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      const { data: recentLegacyPremium, error: premiumError } = await supabase
        .from('landing_page_leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      // Buscar pagamentos confirmados
      const { data: recentPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .order('created_at', { ascending: false })
        .limit(10);

      // Buscar transações de clientes
      const { data: recentTransactions, error: transactionsError } = await supabase
        .from('customer_transactions')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (unifiedError || basicError || premiumError || paymentsError || transactionsError) {
        console.error('Erro ao buscar atividade recente:', unifiedError || basicError || premiumError || paymentsError || transactionsError);
        throw unifiedError || basicError || premiumError || paymentsError || transactionsError;
      }
      
      // Combinar e formatar leads unificados
      const formattedUnifiedLeads = (recentUnifiedLeads || []).map(lead => ({
        ...lead,
        lead_type: lead.source_page === 'landing_page_basic' ? 'basic' : 'premium',
        source: lead.source_page === 'landing_page_basic' ? 'Landing Page €4.99' : 'Landing Page Premium',
        name: lead.full_name || lead.company_name || 'Nome não informado',
        email_contact: lead.email || 'Email não informado',
        phone_contact: lead.phone || 'Telefone não informado',
        is_paid: lead.payment_status === 'paid' || lead.converted === true
      }));

      // Combinar leads legacy para compatibilidade
      const formattedLegacyLeads = [
        ...(recentLegacyBasic || []).map(lead => ({
          ...lead,
          lead_type: 'basic',
          source: 'Landing Page €4.99 (Legacy)',
          name: lead.company_name || 'Nome não informado',
          email_contact: lead.company_email || 'Email não informado',
          phone_contact: lead.company_whatsapp || 'Telefone não informado',
          is_paid: lead.payment_status === 'paid'
        })),
        ...(recentLegacyPremium || []).map(lead => ({
          ...lead,
          lead_type: 'premium',
          source: 'Landing Page Premium (Legacy)',
          name: lead.business_name || lead.full_name || 'Nome não informado',
          email_contact: lead.email || 'Email não informado',
          phone_contact: lead.phone || 'Telefone não informado',
          is_paid: lead.status === 'paid'
        }))
      ];

      // Combinar todos os leads e ordenar por data
      const allLeads = [...formattedUnifiedLeads, ...formattedLegacyLeads]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 15);

      // Combinar pagamentos
      const allPayments = [
        ...(recentPayments || []),
        ...(recentTransactions || [])
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);
      
      console.log('Atividade recente processada:', {
        leads: allLeads.length,
        payments: allPayments.length
      });
      
      return {
        leads: allLeads,
        payments: allPayments
      };
    },
    refetchInterval: 10000,
  });
};
