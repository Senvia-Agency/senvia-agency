
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRevenue } from "@/hooks/useAdminRevenue";
import { useAdminLeads } from "@/hooks/useAdminLeads";
import { useAdminSubscriptions } from "@/hooks/useAdminSubscriptions";
import { useAdminActivity } from "@/hooks/useAdminActivity";
import AdminRevenueBreakdown from "./AdminRevenueBreakdown"; 
import AdminLeadsBreakdown from "./AdminLeadsBreakdown";
import AdminRecentLeads from "./AdminRecentLeads";
import AdminRecentPayments from "./AdminRecentPayments";
import MobileAdminKPIs from "./mobile/MobileAdminKPIs";
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

  const inspirationalMessages = [
    "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    "Inovação distingue líderes de seguidores. Continue liderando!",
    "Cada cliente satisfeito é uma nova oportunidade de crescimento.",
    "A excelência não é um ato, mas um hábito. Mantenha a qualidade!",
    "Transforme desafios em oportunidades de evolução.",
    "O futuro pertence àqueles que acreditam na beleza de seus sonhos.",
    "Sua dedicação hoje constrói o sucesso de amanhã."
  ];

  const generateDailyMessage = () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    const messageIndex = dayOfYear % inspirationalMessages.length;
    return inspirationalMessages[messageIndex];
  };

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
      <div className="space-y-4 p-4 max-w-full overflow-hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-xl lg:text-3xl font-bold text-white truncate">Dashboard</h1>
        </div>
        <div className="text-center py-8 text-slate-400">
          Carregando métricas...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6 p-4 max-w-full overflow-hidden">
      {/* Mobile Header */}
      <div className="block lg:hidden">
        <h1 className="text-xl font-bold text-white truncate">Dashboard</h1>
        <p className="text-sm text-slate-400 truncate">Olá, {getUserName()}!</p>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block mb-6">
        <h1 className="text-3xl font-bold mb-2 text-white">Dashboard Administrativo</h1>
        <p className="text-slate-400">Visão geral completa dos negócios da SENVIA</p>
      </div>

      {/* Welcome Section - Mobile First */}
      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600/50 overflow-hidden">
          <div className="relative h-24 sm:h-28 lg:h-48">
            <img 
              src="/lovable-uploads/d810e16f-1ebf-4288-9a52-9bf0fa5586c2.png" 
              alt="SENVIA Dashboard" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex items-center justify-center">
              <div className="text-center px-3 w-full">
                <h2 className="text-sm sm:text-base lg:text-2xl font-bold text-white mb-1 lg:mb-2 truncate">
                  Olá, {getUserName()}!
                </h2>
                <p className="text-xs lg:text-lg text-slate-200 mb-1 lg:mb-3">
                  Bem-vindo ao painel
                </p>
                <div className="text-slate-300 space-y-1">
                  <p className="text-xs lg:text-sm">
                    {format(new Date(), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-3 w-3 lg:h-4 lg:w-4 flex-shrink-0" />
                    <p className="text-xs lg:text-lg font-mono">
                      {format(currentTime, "HH:mm:ss")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Inspirational Message */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600/50">
          <CardContent className="p-3 lg:p-6 h-24 sm:h-28 lg:h-48 flex items-center">
            <div className="flex items-start gap-2 lg:gap-4 w-full min-w-0">
              <Sparkles className="h-4 w-4 lg:h-6 lg:w-6 text-amber-400 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs lg:text-lg font-medium text-amber-400 mb-1 lg:mb-3">Mensagem do Dia</p>
                <p className="text-xs lg:text-base text-slate-200 leading-relaxed break-words hyphens-auto">
                  {inspirationalMessage}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Period Filters - Fully Responsive */}
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
        <CardContent className="p-3 lg:p-5">
          <div className="space-y-3">
            {/* Period Buttons - Stack on Mobile */}
            <div className="space-y-2">
              <span className="text-xs lg:text-sm font-medium text-slate-300 block">Período:</span>
              <div className="grid grid-cols-3 gap-2 lg:flex lg:gap-3 lg:w-auto">
                <Button
                  variant={dateRange === 7 ? "default" : "ghost"}
                  onClick={() => setDateRange(7)}
                  className={cn(
                    "text-xs px-2 py-1.5 h-8 rounded-md transition-all w-full lg:w-auto",
                    dateRange === 7 
                      ? "bg-senvia-500 text-slate-900 font-medium shadow-sm hover:bg-senvia-400" 
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  )}
                  size="sm"
                >
                  7 dias
                </Button>
                <Button
                  variant={dateRange === 30 ? "default" : "ghost"}
                  onClick={() => setDateRange(30)}
                  className={cn(
                    "text-xs px-2 py-1.5 h-8 rounded-md transition-all w-full lg:w-auto",
                    dateRange === 30 
                      ? "bg-senvia-500 text-slate-900 font-medium shadow-sm hover:bg-senvia-400" 
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  )}
                  size="sm"
                >
                  30 dias
                </Button>
                <Button
                  variant={dateRange === 90 ? "default" : "ghost"}
                  onClick={() => setDateRange(90)}
                  className={cn(
                    "text-xs px-2 py-1.5 h-8 rounded-md transition-all w-full lg:w-auto",
                    dateRange === 90 
                      ? "bg-senvia-500 text-slate-900 font-medium shadow-sm hover:bg-senvia-400" 
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  )}
                  size="sm"
                >
                  90 dias
                </Button>
              </div>
            </div>
            
            {/* Custom Date Range - Stack Vertically on Mobile */}
            <div className="space-y-2">
              <span className="text-xs lg:text-sm font-medium text-slate-300 block">Personalizado:</span>
              <div className="space-y-2 lg:flex lg:items-center lg:gap-2 lg:space-y-0">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full lg:w-28 justify-start text-left font-normal text-xs h-8 bg-slate-700/50 border-slate-500 hover:bg-slate-600/50 transition-all",
                        !customDateFrom && "text-slate-400",
                        customDateFrom && "text-slate-200"
                      )}
                    >
                      <CalendarIcon className="mr-1 h-3 w-3 flex-shrink-0" />
                      <span className="truncate">
                        {customDateFrom ? format(customDateFrom, "dd/MM/yy") : "Início"}
                      </span>
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
                        "w-full lg:w-28 justify-start text-left font-normal text-xs h-8 bg-slate-700/50 border-slate-500 hover:bg-slate-600/50 transition-all",
                        !customDateTo && "text-slate-400",
                        customDateTo && "text-slate-200"
                      )}
                    >
                      <CalendarIcon className="mr-1 h-3 w-3 flex-shrink-0" />
                      <span className="truncate">
                        {customDateTo ? format(customDateTo, "dd/MM/yy") : "Fim"}
                      </span>
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
                    className="text-xs h-8 px-3 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all w-full lg:w-auto"
                  >
                    Limpar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards - Fully Responsive */}
      <div className="w-full">
        <MobileAdminKPIs 
          revenueMetrics={revenueMetrics}
          leadsStats={leadsStats}
          subscriptions={subscriptions}
        />
      </div>

      {/* Charts Section - Stack on Mobile */}  
      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        <div className="w-full">
          <AdminRevenueBreakdown revenueMetrics={revenueMetrics} />
        </div>
        <div className="w-full">
          <AdminLeadsBreakdown leadsStats={leadsStats} />
        </div>
      </div>

      {/* Recent Activity - Stack on Mobile */}
      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        <div className="w-full">
          <AdminRecentLeads recentActivity={recentActivity} />
        </div>
        <div className="w-full">
          <AdminRecentPayments recentActivity={recentActivity} />
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
