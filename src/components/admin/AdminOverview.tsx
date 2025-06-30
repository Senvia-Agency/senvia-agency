import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  const refreshAllData = () => {
    console.log('Atualizando todos os dados...');
    refetchRevenue();
    refetchLeads();
    refetchSubs();
    refetchActivity();
  };

  useEffect(() => {
    refreshAllData();
  }, [dateRange]);

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
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100">Dashboard Administrativo</h1>
        </div>
        <div className="text-center py-8 text-slate-400">
          Carregando métricas...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white leading-tight break-words">
          Visão Geral<br className="sm:hidden" /> do Sistema
        </h1>
        <p className="text-gray-400 text-sm md:text-base break-words">
          Dashboard principal com<br className="sm:hidden" /> métricas importantes
        </p>
      </div>

      {/* Seção com Imagem e Mensagem - Stack no mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        {/* Imagem com Saudação, Data e Relógio */}
        <div className="relative rounded-xl overflow-hidden shadow-xl">
          <img 
            src="/lovable-uploads/d810e16f-1ebf-4288-9a52-9bf0fa5586c2.png" 
            alt="SENVIA Dashboard" 
            className="w-full h-40 md:h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex items-center justify-center">
            <div className="text-center px-4">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                Olá, {getUserName()}!
              </h2>
              <p className="text-base md:text-lg text-slate-200 mb-3">
                Bem-vindo ao seu painel
              </p>
              <div className="text-slate-300 space-y-1">
                <p className="text-xs md:text-sm">
                  {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-3 w-3 md:h-4 md:w-4" />
                  <p className="text-base md:text-lg font-mono">
                    {format(currentTime, "HH:mm:ss")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensagem Inspiradora */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600/50 h-40 md:h-48 flex items-center shadow-xl">
          <CardContent className="p-4 md:p-6 w-full">
            <div className="flex items-start gap-3 md:gap-4 h-full">
              <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-amber-400 mt-1 flex-shrink-0" />
              <div className="flex flex-col justify-center h-full min-w-0">
                <p className="text-base md:text-lg font-medium text-amber-400 mb-2 md:mb-3">Mensagem do Dia</p>
                <p className="text-sm md:text-base text-slate-200 leading-relaxed">{inspirationalMessage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros de Período - Mobile First */}
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm shadow-lg">
        <CardContent className="p-3 md:p-5">
          <div className="space-y-4">
            {/* Botões de período - Stack no mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3">
                <span className="text-xs md:text-sm font-medium text-slate-300 whitespace-nowrap">Período:</span>
                <div className="flex bg-slate-900/70 rounded-lg p-1 border border-slate-700/50 w-full xs:w-auto">
                  <Button
                    variant={dateRange === 7 ? "default" : "ghost"}
                    onClick={() => setDateRange(7)}
                    className={cn(
                      "text-xs px-2 md:px-4 py-2 h-7 md:h-8 rounded-md transition-all flex-1 xs:flex-none",
                      dateRange === 7 
                        ? "bg-senvia-500 text-slate-900 font-medium shadow-sm hover:bg-senvia-400" 
                        : "text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
                    )}
                    size="sm"
                  >
                    7 dias
                  </Button>
                  <Button
                    variant={dateRange === 30 ? "default" : "ghost"}
                    onClick={() => setDateRange(30)}
                    className={cn(
                      "text-xs px-2 md:px-4 py-2 h-7 md:h-8 rounded-md transition-all flex-1 xs:flex-none",
                      dateRange === 30 
                        ? "bg-senvia-500 text-slate-900 font-medium shadow-sm hover:bg-senvia-400" 
                        : "text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
                    )}
                    size="sm"
                  >
                    30 dias
                  </Button>
                  <Button
                    variant={dateRange === 90 ? "default" : "ghost"}
                    onClick={() => setDateRange(90)}
                    className={cn(
                      "text-xs px-2 md:px-4 py-2 h-7 md:h-8 rounded-md transition-all flex-1 xs:flex-none",
                      dateRange === 90 
                        ? "bg-senvia-500 text-slate-900 font-medium shadow-sm hover:bg-senvia-400" 
                        : "text-slate-300 hover:text-slate-100 hover:bg-slate-700/50"
                    )}
                    size="sm"
                  >
                    90 dias
                  </Button>
                </div>
              </div>
              
              {/* Personalizado - Stack no mobile */}
              <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3">
                <span className="text-xs md:text-sm font-medium text-slate-300 whitespace-nowrap">Personalizado:</span>
                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full xs:w-[120px] md:w-[140px] justify-start text-left font-normal text-xs h-8 md:h-9 bg-slate-700/50 border-slate-500 hover:bg-slate-600/50 transition-all",
                          !customDateFrom && "text-slate-400",
                          customDateFrom && "text-slate-200"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{customDateFrom ? format(customDateFrom, "dd/MM/yyyy") : "Data início"}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600" align="start">
                      <Calendar
                        mode="single"
                        selected={customDateFrom}
                        onSelect={setCustomDateFrom}
                        initialFocus
                        className="bg-slate-800 text-slate-200"
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full xs:w-[120px] md:w-[140px] justify-start text-left font-normal text-xs h-8 md:h-9 bg-slate-700/50 border-slate-500 hover:bg-slate-600/50 transition-all",
                          !customDateTo && "text-slate-400",
                          customDateTo && "text-slate-200"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{customDateTo ? format(customDateTo, "dd/MM/yyyy") : "Data fim"}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600" align="start">
                      <Calendar
                        mode="single"
                        selected={customDateTo}
                        onSelect={setCustomDateTo}
                        initialFocus
                        className="bg-slate-800 text-slate-200"
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
                      className="text-xs h-8 md:h-9 px-3 text-slate-400 hover:text-slate-100 hover:bg-slate-700/50 transition-all w-full xs:w-auto"
                    >
                      Limpar
                    </Button>
                  )}
                </div>
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

      {/* Breakdown de Receita - Stack no mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <AdminRevenueBreakdown revenueMetrics={revenueMetrics} />
        <AdminLeadsBreakdown leadsStats={leadsStats} />
      </div>

      {/* Atividade Recente - Stack no mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <AdminRecentLeads recentActivity={recentActivity} />
        <AdminRecentPayments recentActivity={recentActivity} />
      </div>
    </div>
  );
};

export default AdminOverview;
