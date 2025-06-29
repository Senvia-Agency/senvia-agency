
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Euro,
  Users, 
  Percent,
  UserCheck
} from "lucide-react";

interface AdminKPICardsProps {
  revenueMetrics: any;
  leadsStats: any;
  subscriptions: any[];
}

const AdminKPICards = ({ revenueMetrics, leadsStats, subscriptions }: AdminKPICardsProps) => {
  console.log('AdminKPICards - Dados recebidos:', {
    revenueMetrics,
    leadsStats,
    subscriptions
  });

  const totalRevenue = revenueMetrics?.total_revenue || 0;
  const totalTransactions = revenueMetrics?.total_transactions || 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2 px-3 md:px-6 pt-3 md:pt-6">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-400 flex items-center gap-1 md:gap-2">
            <Euro className="h-3 w-3 md:h-4 md:w-4 text-green-500 flex-shrink-0" />
            <span className="truncate">Receita Total</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
          <div className="text-lg md:text-2xl font-bold text-green-500">
            €{totalRevenue.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400 truncate">
            {totalTransactions} transações
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2 px-3 md:px-6 pt-3 md:pt-6">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-400 flex items-center gap-1 md:gap-2">
            <Users className="h-3 w-3 md:h-4 md:w-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">Total de Leads</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
          <div className="text-lg md:text-2xl font-bold text-blue-500">
            {leadsStats?.total_leads || 0}
          </div>
          <div className="text-xs text-gray-400 truncate">
            {leadsStats?.total_conversions || 0} convertidos
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2 px-3 md:px-6 pt-3 md:pt-6">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-400 flex items-center gap-1 md:gap-2">
            <Percent className="h-3 w-3 md:h-4 md:w-4 text-orange-500 flex-shrink-0" />
            <span className="truncate">Taxa de Conversão</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
          <div className="text-lg md:text-2xl font-bold text-orange-500">
            {leadsStats?.conversion_rate?.toFixed(1) || '0.0'}%
          </div>
          <div className="text-xs text-gray-400 truncate">
            lead para venda
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2 px-3 md:px-6 pt-3 md:pt-6">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-400 flex items-center gap-1 md:gap-2">
            <UserCheck className="h-3 w-3 md:h-4 md:w-4 text-purple-500 flex-shrink-0" />
            <span className="truncate">Assinaturas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
          <div className="text-lg md:text-2xl font-bold text-purple-500">
            {subscriptions?.length || 0}
          </div>
          <div className="text-xs text-gray-400 truncate">
            ativas + trial
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminKPICards;
