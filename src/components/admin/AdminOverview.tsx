
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

  // Buscar métricas de receita corrigidas
  const { data: revenueMetrics, isLoading: revenueLoading } = useQuery({
    queryKey: ['admin-revenue-metrics', dateRange],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      // Buscar pagamentos confirmados
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .gte('created_at', startDate.toISOString());

      // Buscar assinaturas ativas (incluindo trial)
      const { data: subscriptions, error: subsError } = await supabase
        .from('senvia_assistant_subscriptions')
        .select('*')
        .in('status', ['active', 'trial'])
        .gte('created_at', startDate.toISOString());

      if (paymentsError || subsError) throw paymentsError || subsError;

      const totalPayments = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
      const subscriptionRevenue = subscriptions?.reduce((sum, s) => sum + (s.monthly_price * 100), 0) || 0;
      
      return {
        total_revenue: (totalPayments + subscriptionRevenue) / 100,
        landing_page_revenue: payments?.filter(p => p.amount === 499).reduce((sum, p) => sum + p.amount, 0) / 100 || 0,
        subscription_revenue: subscriptionRevenue / 100,
        total_transactions: (payments?.length || 0) + (subscriptions?.length || 0),
        avg_transaction_value: totalPayments > 0 ? totalPayments / (payments?.length || 1) / 100 : 0
      };
    },
  });

  // Buscar estatísticas de leads corrigidas
  const { data: leadsStats, isLoading: leadsLoading } = useQuery({
    queryKey: ['admin-leads-stats', dateRange],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      // Buscar leads da landing page (€4.99)
      const { data: landingPageLeads, error: lpError } = await supabase
        .from('leads')
        .select('*')
        .gte('created_at', startDate.toISOString());

      // Buscar leads da senvia landing page (gratuitos)
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
        senvia_landing_leads: senviaLeads?.length || 0,
        conversion_rate: totalLeads > 0 ? (conversions / totalLeads) * 100 : 0,
        pending_leads: (landingPageLeads?.filter(l => l.lead_status === 'new').length || 0) + 
                      (senviaLeads?.filter(l => l.status === 'new').length || 0)
      };
    },
  });

  // Buscar assinaturas ativas (incluindo trial)
  const { data: subscriptions, isLoading: subsLoading } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('senvia_assistant_subscriptions')
        .select('*')
        .in('status', ['active', 'trial']);
      
      if (error) throw error;
      return data;
    },
  });

  // Buscar atividade recente
  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['admin-recent-activity'],
    queryFn: async () => {
      const { data: recentLeads, error: leadsError } = await supabase
        .from('landing_page_leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      const { data: recentPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (leadsError || paymentsError) throw leadsError || paymentsError;
      
      return {
        leads: recentLeads || [],
        payments: recentPayments || []
      };
    },
  });

  const isLoading = revenueLoading || leadsLoading || subsLoading || activityLoading;

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
              {leadsStats?.pending_leads || 0} pendentes
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Percent className="h-4 w-4 text-orange-500" />
              Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {leadsStats?.conversion_rate ? `${leadsStats.conversion_rate.toFixed(1)}%` : '0%'}
            </div>
            <div className="text-xs text-gray-400">
              taxa de conversão
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
                <div className="text-sm text-gray-400">€4.99 por lead</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-500">
                  €{revenueMetrics?.landing_page_revenue?.toFixed(2) || '0.00'}
                </div>
                <div className="text-xs text-gray-400">
                  {Math.round((revenueMetrics?.landing_page_revenue || 0) / 4.99)} vendas
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
                  €{revenueMetrics?.subscription_revenue?.toFixed(2) || '0.00'}
                </div>
                <div className="text-xs text-gray-400">
                  {subscriptions?.length || 0} assinaturas
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <div className="font-medium">Ticket Médio</div>
                <div className="font-bold text-senvia-500">
                  €{revenueMetrics?.avg_transaction_value?.toFixed(2) || '0.00'}
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
                <div className="font-medium">Landing Pages Pagos</div>
                <div className="text-sm text-gray-400">Leads que pagaram €4.99</div>
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
                <div className="text-sm text-gray-400">Leads gratuitos da Senvia</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-500">
                  {leadsStats?.senvia_landing_leads || 0}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <div className="font-medium">Taxa de Conversão</div>
                <div className="font-bold text-orange-500">
                  {leadsStats?.conversion_rate?.toFixed(1) || '0.0'}%
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
              {recentActivity?.leads?.map((lead) => (
                <div key={lead.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                  <div>
                    <div className="font-medium">{lead.full_name}</div>
                    <div className="text-sm text-gray-400">{lead.email}</div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={lead.status === 'new' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {lead.status}
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
