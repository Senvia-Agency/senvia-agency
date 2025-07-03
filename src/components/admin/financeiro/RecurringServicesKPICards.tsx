
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Repeat, AlertTriangle, Calendar, TrendingUp } from "lucide-react";
import { useRecurringStats } from "@/hooks/useRecurringServices";

const RecurringServicesKPICards = () => {
  const { data: stats, isLoading } = useRecurringStats();

  if (isLoading || !stats) {
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
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Repeat className="h-4 w-4 text-blue-500" />
            Serviços Ativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">
            {stats.total_active_services}
          </div>
          <div className="text-xs text-gray-400">
            serviços recorrentes
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Receita Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            €{Number(stats.total_monthly_revenue).toFixed(2)}
          </div>
          <div className="text-xs text-gray-400">
            receita recorrente
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Em Atraso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            €{Number(stats.overdue_amount).toFixed(2)}
          </div>
          <div className="text-xs text-gray-400">
            {stats.overdue_count} contas atrasadas
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-yellow-500" />
            Próxima Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-500">
            €{Number(stats.next_week_due_amount).toFixed(2)}
          </div>
          <div className="text-xs text-gray-400">
            {stats.next_week_due_count} contas a vencer
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecurringServicesKPICards;
