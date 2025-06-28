
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRevenue } from "@/hooks/useAdminRevenue";
import { useAdminLeads } from "@/hooks/useAdminLeads";
import { useAdminSubscriptions } from "@/hooks/useAdminSubscriptions";
import { useAdminActivity } from "@/hooks/useAdminActivity";
import AdminKPICards from "./AdminKPICards";
import AdminRevenueBreakdown from "./AdminRevenueBreakdown";
import AdminLeadsBreakdown from "./AdminLeadsBreakdown";
import AdminRecentLeads from "./AdminRecentLeads";
import AdminRecentPayments from "./AdminRecentPayments";
import { Sparkles } from "lucide-react";

const AdminOverview = () => {
  const [dateRange, setDateRange] = useState(30);
  const [inspirationalMessage, setInspirationalMessage] = useState("");
  const { user } = useAuth();

  const { data: revenueMetrics, isLoading: revenueLoading, refetch: refetchRevenue } = useAdminRevenue(dateRange);
  const { data: leadsStats, isLoading: leadsLoading, refetch: refetchLeads } = useAdminLeads(dateRange);
  const { data: subscriptions, isLoading: subsLoading, refetch: refetchSubs } = useAdminSubscriptions();
  const { data: recentActivity, isLoading: activityLoading, refetch: refetchActivity } = useAdminActivity();

  const isLoading = revenueLoading || leadsLoading || subsLoading || activityLoading;

  // Mensagens inspiradoras (simulando IA - em produção seria uma API)
  const inspirationalMessages = [
    "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    "Inovação distingue líderes de seguidores. Continue liderando!",
    "Cada cliente satisfeito é uma nova oportunidade de crescimento.",
    "A excelência não é um ato, mas um hábito. Mantenha a qualidade!",
    "Transforme desafios em oportunidades de evolução.",
    "O futuro pertence àqueles que acreditam na beleza de seus sonhos.",
    "Sua dedicação hoje constrói o sucesso de amanhã."
  ];

  // Função para gerar mensagem baseada no dia
  const generateDailyMessage = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const messageIndex = dayOfYear % inspirationalMessages.length;
    return inspirationalMessages[messageIndex];
  };

  useEffect(() => {
    setInspirationalMessage(generateDailyMessage());
  }, []);

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

  // Extrair nome do usuário
  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Admin';
  };

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
      {/* Header com Imagem e Saudação */}
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
            <p className="text-gray-400">
              Visão geral completa dos negócios da SENVIA
            </p>
          </div>
          
          {/* Mensagem Inspiradora */}
          <Card className="bg-gradient-to-r from-senvia-500/20 to-purple-500/20 border-senvia-500/30 max-w-md">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-senvia-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-senvia-400 mb-1">Mensagem do Dia</p>
                  <p className="text-sm text-gray-300 leading-relaxed">{inspirationalMessage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Imagem de Fundo com Saudação */}
        <div className="relative rounded-lg overflow-hidden mb-6">
          <img 
            src="/lovable-uploads/e29257f0-dc8b-4672-accb-c98d9b83e84e.png" 
            alt="SENVIA Dashboard" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-2">
                Olá, {getUserName()}!
              </h2>
              <p className="text-xl text-white/90">
                Bem-vindo ao seu painel administrativo
              </p>
            </div>
          </div>
        </div>

        {/* Filtros de Período */}
        <div className="flex gap-2 justify-center mb-6">
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
      <AdminKPICards 
        revenueMetrics={revenueMetrics}
        leadsStats={leadsStats}
        subscriptions={subscriptions}
      />

      {/* Breakdown de Receita */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminRevenueBreakdown revenueMetrics={revenueMetrics} />
        <AdminLeadsBreakdown leadsStats={leadsStats} />
      </div>

      {/* Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminRecentLeads recentActivity={recentActivity} />
        <AdminRecentPayments recentActivity={recentActivity} />
      </div>
    </div>
  );
};

export default AdminOverview;
