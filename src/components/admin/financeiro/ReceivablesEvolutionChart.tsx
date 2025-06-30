
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp } from "lucide-react";
import { AccountReceivable } from "@/hooks/useAccountsReceivable";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReceivablesEvolutionChartProps {
  accounts: AccountReceivable[];
}

const ReceivablesEvolutionChart = ({ accounts }: ReceivablesEvolutionChartProps) => {
  // Agrupar dados por mês para o gráfico de evolução
  const monthlyData = accounts.reduce((acc, account) => {
    const month = format(new Date(account.sale_date), 'MMM/yyyy', { locale: ptBR });
    
    if (!acc[month]) {
      acc[month] = {
        month,
        pending: 0,
        overdue: 0,
        total: 0
      };
    }
    
    acc[month].total += account.remaining_amount;
    
    if (account.days_overdue > 0) {
      acc[month].overdue += account.remaining_amount;
    } else {
      acc[month].pending += account.remaining_amount;
    }
    
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(monthlyData).slice(-6); // Últimos 6 meses

  // Dados para o gráfico de status
  const statusData = [
    {
      name: 'Pendente',
      value: accounts.filter(a => a.payment_status === 'pending').reduce((sum, a) => sum + a.remaining_amount, 0),
      color: '#f59e0b'
    },
    {
      name: 'Parcial',
      value: accounts.filter(a => a.payment_status === 'partial').reduce((sum, a) => sum + a.remaining_amount, 0),
      color: '#f97316'
    },
    {
      name: 'Em Atraso',
      value: accounts.filter(a => a.payment_status === 'overdue').reduce((sum, a) => sum + a.remaining_amount, 0),
      color: '#ef4444'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Evolução Mensal */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-senvia-500" />
            Evolução dos Recebimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => `€${value.toFixed(0)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                  formatter={(value: number) => [`€${value.toFixed(2)}`, '']}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Status */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-senvia-500" />
            Distribuição por Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => `€${value.toFixed(0)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                  formatter={(value: number) => [`€${value.toFixed(2)}`, 'Valor']}
                />
                <Bar 
                  dataKey="value" 
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceivablesEvolutionChart;
