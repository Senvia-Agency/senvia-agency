
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertTriangle, Euro, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useUnifiedReceivables, useUnifiedReceivablesStats } from "@/hooks/useUnifiedReceivables";

interface AccountsReceivableKPICardsProps {
  stats: {
    totalPending: number;
    totalOverdue: number;
    pendingCount: number;
    overdueCount: number;
    averageTicket: number;
  } | null;
}

const AccountsReceivableKPICards = ({ stats: propStats }: AccountsReceivableKPICardsProps) => {
  const { data: unifiedReceivables, isLoading } = useUnifiedReceivables();
  const unifiedStats = useUnifiedReceivablesStats(unifiedReceivables || []);
  
  // Usar propStats se fornecido, senão usar unifiedStats
  const stats = propStats || unifiedStats;

  // Log de diagnóstico
  console.log('[KPIs] propStats:', propStats, 'unifiedStats:', unifiedStats);

  // Só mostrar loading se não tiver propStats e estiver carregando
  const isLoadingEffective = propStats ? false : isLoading;

  if (isLoadingEffective || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-gray-600 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 bg-gray-600 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-16 bg-gray-600 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Link to="/admin/contas-receber">
        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              Total a Receber
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              €{stats.totalPending.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">
              {stats.pendingCount} pendências
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link to="/admin/contas-atraso">
        <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Em Atraso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              €{stats.totalOverdue.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">
              {stats.overdueCount} atrasadas
            </div>
          </CardContent>
        </Card>
      </Link>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Euro className="h-4 w-4 text-blue-500" />
            Ticket Médio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">
            €{stats.averageTicket.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400">
            por pendência
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            Taxa de Atraso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-500">
            {stats.pendingCount > 0 ? ((stats.overdueCount / stats.pendingCount) * 100).toFixed(1) : '0.0'}%
          </div>
          <div className="text-xs text-gray-400">
            contas atrasadas
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsReceivableKPICards;
