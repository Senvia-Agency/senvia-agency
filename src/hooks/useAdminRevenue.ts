
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminRevenue = (dateRange: number) => {
  return useQuery({
    queryKey: ['admin-revenue-metrics', dateRange],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      console.log('Buscando métricas de receita desde:', startDate.toISOString());
      
      // Buscar APENAS pagamentos confirmados (status = 'paid')
      const { data: paidPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .gte('created_at', startDate.toISOString());

      console.log('Pagamentos confirmados encontrados:', paidPayments);

      // Buscar assinaturas ATIVAS
      const { data: activeSubscriptions, error: subsError } = await supabase
        .from('senvia_assistant_subscriptions')
        .select('*')
        .eq('status', 'active')
        .gte('created_at', startDate.toISOString());

      console.log('Assinaturas ativas encontradas:', activeSubscriptions);

      if (paymentsError) {
        console.error('Erro ao buscar pagamentos:', paymentsError);
        throw paymentsError;
      }
      if (subsError) {
        console.error('Erro ao buscar assinaturas:', subsError);
        throw subsError;
      }

      // Calcular receitas baseadas nos valores REAIS dos pagamentos
      const landingPageRevenue = (paidPayments || [])
        .reduce((sum, p) => sum + (p.amount / 100), 0); // Converter de centavos para euros
      
      const assistantRevenue = (activeSubscriptions || [])
        .reduce((sum, s) => sum + (s.monthly_price || 20), 0);
      
      const totalRevenue = landingPageRevenue + assistantRevenue;
      
      console.log('Receitas calculadas:', {
        landingPageRevenue,
        assistantRevenue,
        totalRevenue
      });
      
      return {
        total_revenue: totalRevenue,
        landing_page_revenue: landingPageRevenue,
        assistant_revenue: assistantRevenue,
        total_transactions: (paidPayments?.length || 0) + (activeSubscriptions?.length || 0),
        landing_page_sales: paidPayments?.length || 0,
        active_subscriptions: activeSubscriptions?.length || 0
      };
    },
    refetchInterval: 10000,
  });
};
