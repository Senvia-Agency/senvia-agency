
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Users, FileText } from "lucide-react";

interface SalesStatsCardsProps {
  stats: {
    totalSales: number;
    totalRevenue: number;
    totalPaid: number;
    pendingSales: number;
  };
}

const SalesStatsCards = ({ stats }: SalesStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Total de Vendas</CardTitle>
          <FileText className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalSales}</div>
          <p className="text-xs text-gray-400">
            {stats.pendingSales} pendentes
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Receita Total</CardTitle>
          <TrendingUp className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-senvia-500">€{stats.totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-gray-400">
            valor total de vendas
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Valor Recebido</CardTitle>
          <DollarSign className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">€{stats.totalPaid.toFixed(2)}</div>
          <p className="text-xs text-gray-400">
            pagamentos recebidos
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Em Aberto</CardTitle>
          <Users className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-500">€{(stats.totalRevenue - stats.totalPaid).toFixed(2)}</div>
          <p className="text-xs text-gray-400">
            a receber
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesStatsCards;
