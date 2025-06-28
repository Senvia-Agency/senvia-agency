
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
import { Sparkles, Clock, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const AdminOverview = () => {
  const [dateRange, setDateRange] = useState(30);
  const [customDateFrom, setCustomDateFrom] = useState<Date | undefined>();
  const [customDateTo, setCustomDateTo] = useState<Date | undefined>();
  const [inspirationalMessage, setInspirationalMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useAuth();

  const { data: revenueMetrics, isLoading: revenueLoading, refetch: refetchRevenue } = useAdminRevenue(dateRange);
  const { data: leadsStats, isLoading: leadsLoading, refetch: refetchLeads } = useAdminLeads(dateRange);
  const { data: subscriptions, isLoading: subsLoading, refetch: refetchSubs } = useAdminSubscriptions();
  const { data: recentActivity, isLoading: activityLoading, refetch: refetchActivity } = useAdminActivity();

  const isLoading = revenueLoading || leadsLoading || subsLoading || activityLoading;

  // Mensagens inspiradoras
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
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    const messageIndex = dayOfYear % inspirationalMessages.length;
    return inspirationalMessages[messageIndex];
  };

  // Atualizar relógio com fuso horário de Lisboa
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Converter para fuso horário de Lisboa (GMT+1/GMT+2 dependendo do horário de verão)
      const lisbonTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Lisbon"}));
      setCurrentTime(lisbonTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
        <p className="text-gray-400">
          Visão geral completa dos negócios da SENVIA
        </p>
      </div>

      {/* Seção com Imagem e Mensagem em duas colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Imagem com Saudação, Data e Relógio */}
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src="/lovable-uploads/d810e16f-1ebf-4288-9a52-9bf0fa5586c2.png" 
            alt="SENVIA Dashboard" 
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                Olá, {getUserName()}!
              </h2>
              <p className="text-lg text-white/90 mb-3">
                Bem-vindo ao seu painel
              </p>
              <div className="text-white/80 space-y-1">
                <p className="text-sm">
                  {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4" />
                  <p className="text-lg font-mono">
                    {format(currentTime, "HH:mm:ss")} (Lisboa)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensagem Inspiradora */}
        <Card className="bg-gradient-to-r from-senvia-500/20 to-purple-500/20 border-senvia-500/30 h-48 flex items-center">
          <CardContent className="p-6 w-full">
            <div className="flex items-start gap-4 h-full">
              <Sparkles className="h-6 w-6 text-senvia-400 mt-1 flex-shrink-0" />
              <div className="flex flex-col justify-center h-full">
                <p className="text-lg font-medium text-senvia-400 mb-3">Mensagem do Dia</p>
                <p className="text-base text-gray-300 leading-relaxed">{inspirationalMessage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros de Período - Design Elegante */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Período de análise:</span>
              <div className="flex bg-gray-900/50 rounded-lg p-1">
                <Button
                  variant={dateRange === 7 ? "default" : "ghost"}
                  onClick={() => setDateRange(7)}
                  className="text-xs px-3 py-1 h-7"
                  size="sm"
                >
                  7 dias
                </Button>
                <Button
                  variant={dateRange === 30 ? "default" : "ghost"}
                  onClick={() => setDateRange(30)}
                  className="text-xs px-3 py-1 h-7"
                  size="sm"
                >
                  30 dias
                </Button>
                <Button
                  variant={dateRange === 90 ? "default" : "ghost"}
                  onClick={() => setDateRange(90)}
                  className="text-xs px-3 py-1 h-7"
                  size="sm"
                >
                  90 dias
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Período personalizado:</span>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[130px] justify-start text-left font-normal text-xs h-8 bg-gray-700 border-gray-600 hover:bg-gray-600",
                        !customDateFrom && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {customDateFrom ? format(customDateFrom, "dd/MM/yyyy") : "De"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                    <Calendar
                      mode="single"
                      selected={customDateFrom}
                      onSelect={setCustomDateFrom}
                      initialFocus
                      className="bg-gray-800 text-white pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[130px] justify-start text-left font-normal text-xs h-8 bg-gray-700 border-gray-600 hover:bg-gray-600",
                        !customDateTo && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {customDateTo ? format(customDateTo, "dd/MM/yyyy") : "Até"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                    <Calendar
                      mode="single"
                      selected={customDateTo}
                      onSelect={setCustomDateTo}
                      initialFocus
                      className="bg-gray-800 text-white pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                {(customDateFrom || customDateTo) && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setCustomDateFrom(undefined);
                      setCustomDateTo(undefined);
                    }}
                    className="text-xs h-8 px-2 text-gray-400 hover:text-white"
                  >
                    Limpar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
