
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

  // Buscar métricas de receita REAIS e CORRETAS
  const { data: revenueMetrics, isLoading: revenueLoading, refetch: refetchRevenue } = useQuery({
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
        .filter(p => p.amount === 499) // €4.99 para landing pages
        .reduce((sum, p) => sum + (p.amount / 100), 0);
      
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
        landing_page_sales: paidPayments?.filter(p => p.amount === 499).length || 0,
        active_subscriptions: activeSubscriptions?.length || 0
      };
    },
    refetchInterval: 10000, // Atualizar a cada 10 segundos
  });

  // Buscar estatísticas de leads CORRETAS
  const { data: leadsStats, isLoading: leadsLoading, refetch: refetchLeads } = useQuery({
    queryKey: ['admin-leads-stats', dateRange],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      
      console.log('Buscando leads desde:', startDate.toISOString());
      
      // Buscar leads pagos (da tabela leads)
      const { data: paidLeads, error: paidError } = await supabase
        .from('leads')
        .select('*')
        .gte('created_at', startDate.toISOString());

      // Buscar leads orgânicos (da tabela landing_page_leads)
      const { data: organicLeads, error: organicError } = await supabase
        .from('landing_page_leads')
        .select('*')
        .gte('created_at', startDate.toISOString());

      // Buscar conversões REAIS (pagamentos confirmados)
      const { data: realConversions, error: conversionsError } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .gte('created_at', startDate.toISOString());

      console.log('Dados de leads encontrados:', {
        paidLeads: paidLeads?.length,
        organicLeads: organicLeads?.length,
        realConversions: realConversions?.length
      });

      if (paidError || organicError || conversionsError) {
        console.error('Erro ao buscar leads:', paidError || organicError || conversionsError);
        throw paidError || organicError || conversionsError;
      }

      const totalLeads = (paidLeads?.length || 0) + (organicLeads?.length || 0);
      const totalConversions = realConversions?.length || 0;
      
      return {
        total_leads: totalLeads,
        paid_leads: paidLeads?.length || 0,
        organic_leads: organicLeads?.length || 0,
        conversion_rate: totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0,
        total_conversions: totalConversions
      };
    },
    refetchInterval: 10000, // Atualizar a cada 10 segundos
  });

  // Buscar assinaturas ativas TODAS
  const { data: subscriptions, isLoading: subsLoading, refetch: refetchSubs } = useQuery({
    queryKey: ['admin-active-subscriptions'],
    queryFn: async () => {
      console.log('Buscando todas as assinaturas...');
      
      const { data, error } = await supabase
        .from('senvia_assistant_subscriptions')
        .select('*')
        .in('status', ['active', 'trial'])
        .order('created_at', { ascending: false });
      
      console.log('Assinaturas encontradas:', data);
      
      if (error) {
        console.error('Erro ao buscar assinaturas:', error);
        throw error;
      }
      return data || [];
    },
    refetchInterval: 10000, // Atualizar a cada 10 segundos
  });

  // Buscar atividade recente CORRETA
  const { data: recentActivity, isLoading: activityLoading, refetch: refetchActivity } = useQuery({
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
    refetchInterval: 10000, // Atualizar a cada 10 segundos
  });

  const isLoading = revenueLoading || leadsLoading || subsLoading || activityLoading;

  // Função de refresh manual
  const refreshAllData = () => {
    console.log('Atualizando todos os dados...');
    refetchRevenue();
    refetchLeads();
    refetchSubs();
    refetchActivity();
  };

  // Auto-refresh quando alterar período
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
              {leadsStats?.conversion_rate?.toFixed(1) || '0.0'}%
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
                  {revenueMetrics?.active_subscriptions || 0} assinaturas
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <div className="font-medium">Total</div>
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
                  {leadsStats?.paid_leads || 0}
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
                  {leadsStats?.organic_leads || 0}
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
                      {lead.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {lead.email_contact}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex flex-col gap-1">
                      <Badge 
                        variant={lead.lead_type === 'organic' ? 'secondary' : 'default'}
                        className="text-xs"
                      >
                        {lead.lead_type === 'organic' ? 'Orgânico' : 'Pago'}
                      </Badge>
                      {lead.lead_type === 'paid' && (
                        <Badge 
                          variant={lead.is_paid ? 'default' : 'destructive'}
                          className={`text-xs ${lead.is_paid ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
                        >
                          {lead.is_paid ? 'Pago ✓' : 'Não Pago'}
                        </Badge>
                      )}
                    </div>
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
                      variant="default"
                      className="text-xs bg-green-500/20 text-green-500"
                    >
                      Pago ✓
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
