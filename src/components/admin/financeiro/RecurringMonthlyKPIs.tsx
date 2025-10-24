import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Repeat } from "lucide-react";
import { useRecurringStats } from "@/hooks/useRecurringServices";

const RecurringMonthlyKPIs = () => {
  const { data: stats, isLoading } = useRecurringStats();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-gray-600 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 bg-gray-600 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Receitas Mensais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            €{Number(stats.total_monthly_revenue).toFixed(2)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {stats.total_active_revenue_services} serviços ativos
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-500" />
            Despesas Mensais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            €{Number(stats.total_monthly_expenses).toFixed(2)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {stats.total_active_expense_services} despesas ativas
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Repeat className="h-4 w-4 text-blue-500" />
            Balanço Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${Number(stats.net_monthly_balance) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            €{Number(stats.net_monthly_balance).toFixed(2)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Receitas - Despesas
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecurringMonthlyKPIs;
