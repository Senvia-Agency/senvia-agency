
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminActivity = () => {
  return useQuery({
    queryKey: ['admin-recent-activity'],
    queryFn: async () => {
      console.log('Buscando atividade recente...');
      
      // Leads orgânicos recentes
      const { data: recentOrganicLeads, error: organicError } = await supabase
        .from('landing_page_leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      // Leads pagos recentes
      const { data: recentPaidLeads, error: paidError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      // Pagamentos CONFIRMADOS recentes
      const { data: recentPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .order('created_at', { ascending: false })
        .limit(10);
      
      console.log('Atividade recente encontrada:', {
        organicLeads: recentOrganicLeads?.length,
        paidLeads: recentPaidLeads?.length,
        payments: recentPayments?.length
      });
      
      if (organicError || paidError || paymentsError) {
        console.error('Erro ao buscar atividade recente:', organicError || paidError || paymentsError);
        throw organicError || paidError || paymentsError;
      }
      
      // Combinar leads com informação CORRETA de pagamento
      const allLeads = [
        ...(recentOrganicLeads || []).map(lead => ({ 
          ...lead, 
          lead_type: 'organic',
          name: lead.business_name || lead.full_name || 'Nome não informado',
          email_contact: lead.email || 'Email não informado',
          phone_contact: lead.phone || 'Telefone não informado',
          is_paid: false
        })),
        ...(recentPaidLeads || []).map(lead => {
          // Verificar se este lead tem pagamento confirmado
          const hasPayment = recentPayments?.some(p => p.email === lead.company_email && p.status === 'paid');
          return { 
            ...lead, 
            lead_type: 'paid',
            name: lead.company_name || 'Nome não informado',
            email_contact: lead.company_email || 'Email não informado',
            phone_contact: lead.company_whatsapp || 'Telefone não informado',
            is_paid: hasPayment || false
          };
        })
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10);
      
      return {
        leads: allLeads,
        payments: recentPayments || []
      };
    },
    refetchInterval: 10000,
  });
};
