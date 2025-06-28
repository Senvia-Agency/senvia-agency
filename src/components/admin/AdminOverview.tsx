
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Euro,
  Calendar,
  Target,
  UserCheck,
  Percent
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminOverview = () => {
  const [dateRange, setDateRange] = useState(30);

  // Buscar métricas de receita CORRIGIDAS
  const { data: revenueMetrics, isLoading: revenueLoading, refetch: refetchRevenue } = useQuery({
    queryKey: ['admin-revenue-metrics', dateRange],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      // Buscar pagamentos de landing pages (€4.99)
      const { data: landingPagePayments, error: lpError } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .eq('amount', 499)
        .gte('created_at', startDate.toISOString());

      // Buscar assinaturas do Senvia Assistant
      const { data: assistantSubs, error: asError } = await supabase
        .from('senvia_assistant_subscriptions')
        .select('*')
        .in('status', ['active', 'trial'])
        .gte('created_at', startDate.toISOString());

      if (lpError || asError) throw lpError || asError;

      const landingPageRevenue = (landingPagePayments?.length || 0) * 4.99;
      const assistantRevenue = (assistantSubs?.filter(s => s.status === 'active').length || 0) * 20;
      const totalRevenue = landingPageRevenue + assistantRevenue;
      
      return {
        total_revenue: totalRevenue,
        landing_page_revenue: landingPageRevenue,
        assistant_revenue: assistantRevenue,
        total_transactions: (landingPagePayments?.length || 0) + (assistantSubs?.length || 0),
        landing_page_sales: landingPagePayments?.length || 0,
        assistant_subscriptions: assistantSubs?.length || 0
      };
    },
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });

  // Buscar estatísticas de leads CORRIGIDAS
  const { data: leadsStats, isLoading: leadsLoading, refetch: refetchLeads } = useQuery({
    queryKey: ['admin-leads-stats', dateRange],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      // Buscar leads da landing page (€4.99)
      const { data: landingPageLeads, error: lpError } = await supabase
        .from('leads')
        .select('*')
        .gte('created_at', startDate.toISOString());

      // Buscar leads gratuitos da senvia
      const { data: senviaLeads, error: sError } = await supabase
        .from('landing_page_leads')
        .select('*')
        .gte('created_at', startDate.toISOString());

      // Buscar pagamentos para calcular conversão
      const { data: payments, error: pError } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .gte('created_at', startDate.toISOString());

      if (lpError || sError || pError) throw lpError || sError || pError;

      const totalLeads = (landingPageLeads?.length || 0) + (senviaLeads?.length || 0);
      const conversions = payments?.length || 0;
      
      return {
        total_leads: totalLeads,
        landing_page_leads: landingPageLeads?.length || 0,
        senvia_leads: senviaLeads?.length || 0,
        conversion_rate: totalLeads > 0 ? (conversions / totalLeads) * 100 : 0,
        total_conversions: conversions
      };
    },
    refetchInterval: 30000,
  });

  // Buscar assinaturas ativas CORRIGIDO
  const { data: subscriptions, isLoading: subsLoading, refetch: refetchSubs } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('senvia_assistant_subscriptions')
        .select('*')
        .in('status', ['active', 'trial'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000,
  });

  // Buscar atividade recente CORRIGIDA
  const { data: recentActivity, isLoading: activityLoading, refetch: refetchActivity } = useQuery({
    queryKey: ['admin-recent-activity'],
    queryFn: async () => {
      // Leads da senvia (gratuitos)
      const { data: recentSenviaLeads, error: senviaError } = await supabase
        .from('landing_page_leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      // Leads pagos
      const { data: recentPaidLeads, error: paidError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      // Pagamentos recentes
      const { data: recentPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (senviaError || paidError || paymentsError) throw senviaError || paidError || paymentsError;
      
      // Combinar leads
      const allLeads = [
        ...(recentSenviaLeads || []).map(lead => ({ ...lead, lead_type: 'senvia_free' })),
        ...(recentPaidLeads || []).map(lead => ({ ...lead, lead_type: 'landing_page_paid' }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
      
      return {
        leads: allLeads,
        payments: recentPayments || []
      };
    },
    refetchInterval: 30000,
  });

  const isLoading = revenueLoading || leadsLoading || subsLoading || activityLoading;

  // Auto-refresh function
  const refreshAllData = () => {
    refetchRevenue();
    refetchLeads();
    refetchSubs();
    refetchActivity();
  };

  useEffect(() => {
    refreshAllData();
  }, [dateRange]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
        </div>
        <div className="text-center py-8 text-gray-400">
          Carregando métricas...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
          <p className="text-gray-400">
            Visão geral completa dos negócios da SENVIA
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={refreshAllData}
            variant="outline"
            className="text-sm"
          >
            Atualizar Dados
          </Button>
          <Button
            variant={dateRange === 7 ? "default" : "outline"}
            onClick={() => setDateRange(7)}
            className="text-sm"
          >
            7 dias
          </Button>
          <Button
            variant={dateRange === 30 ? "default" : "outline"}
            onClick={() => setDateRange(30)}
            className="text-sm"
          >
            30 dias
          </Button>
          <Button
            variant={dateRange === 90 ? "default" : "outline"}
            onClick={() => setDateRange(90)}
            className="text-sm"
          >
            90 dias
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Euro className="h-4 w-4 text-green-500" />
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              €{revenueMetrics?.total_revenue?.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-gray-400">
              {revenueMetrics?.total_transactions || 0} transações
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Total de Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {leadsStats?.total_leads || 0}
            </div>
            <div className="text-xs text-gray-400">
              {leadsStats?.total_conversions || 0} convertidos
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Percent className="h-4 w-4 text-orange-500" />
              Taxa de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {leadsStats?.conversion_rate ? `${Math.min(leadsStats.conversion_rate, 100).toFixed(1)}%` : '0%'}
            </div>
            <div className="text-xs text-gray-400">
              lead para venda
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-purple-500" />
              Assinaturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {subscriptions?.length || 0}
            </div>
            <div className="text-xs text-gray-400">
              ativas + trial
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown de Receita */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-senvia-500" />
              Breakdown de Receita
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Landing Pages</div>
                <div className="text-sm text-gray-400">€4.99 por venda</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-500">
                  €{revenueMetrics?.landing_page_revenue?.toFixed(2) || '0.00'}
                </div>
                <div className="text-xs text-gray-400">
                  {revenueMetrics?.landing_page_sales || 0} vendas
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Senvia Assistant</div>
                <div className="text-sm text-gray-400">€20.00 por mês</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-purple-500">
                  €{revenueMetrics?.assistant_revenue?.toFixed(2) || '0.00'}
                </div>
                <div className="text-xs text-gray-400">
                  {subscriptions?.filter(s => s.status === 'active').length || 0} assinaturas
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <div className="font-medium">Total Mensal</div>
                <div className="font-bold text-senvia-500">
                  €{revenueMetrics?.total_revenue?.toFixed(2) || '0.00'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-senvia-500" />
              Breakdown de Leads
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Leads Pagos</div>
                <div className="text-sm text-gray-400">Compraram landing page</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-500">
                  {leadsStats?.landing_page_leads || 0}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Leads Orgânicos</div>
                <div className="text-sm text-gray-400">Cadastros gratuitos</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-500">
                  {leadsStats?.senvia_leads || 0}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <div className="font-medium">Total de Conversões</div>
                <div className="font-bold text-orange-500">
                  {leadsStats?.total_conversions || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Leads Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity?.leads?.map((lead: any, index) => (
                <div key={`${lead.id}-${index}`} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                  <div>
                    <div className="font-medium">
                      {lead.lead_type === 'senvia_free' 
                        ? (lead.full_name || 'Nome não informado')
                        : (lead.business_name || lead.company_name || 'Nome não informado')
                      }
                    </div>
                    <div className="text-sm text-gray-400">
                      {lead.email || lead.company_email || 'Email não informado'}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={lead.lead_type === 'senvia_free' ? 'secondary' : 'default'}
                      className="text-xs"
                    >
                      {lead.lead_type === 'senvia_free' ? 'Orgânico' : 'Pago'}
                    </Badge>
                    <div className="text-xs text-gray-400 mt-1">
                      {format(new Date(lead.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                    </div>
                  </div>
                </div>
              ))}
              {(!recentActivity?.leads || recentActivity.leads.length === 0) && (
                <div className="text-center text-gray-400 py-4">
                  Nenhum lead recente
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Pagamentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity?.payments?.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                  <div>
                    <div className="font-medium">{payment.email}</div>
                    <div className="text-sm text-gray-400">
                      €{(payment.amount / 100).toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={payment.status === 'paid' ? 'default' : payment.status === 'pending' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {payment.status}
                    </Badge>
                    <div className="text-xs text-gray-400 mt-1">
                      {format(new Date(payment.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                    </div>
                  </div>
                </div>
              ))}
              {(!recentActivity?.payments || recentActivity.payments.length === 0) && (
                <div className="text-center text-gray-400 py-4">
                  Nenhum pagamento recente
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
