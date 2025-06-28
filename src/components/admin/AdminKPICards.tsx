
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Euro className="h-4 w-4 text-green-500" />
            Receita Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            €{revenueMetrics?.total_revenue?.toFixed(2) || '0.00'}
          </div>
          <div className="text-xs text-gray-400">
            {revenueMetrics?.total_transactions || 0} transações
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            Total de Leads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">
            {leadsStats?.total_leads || 0}
          </div>
          <div className="text-xs text-gray-400">
            {leadsStats?.total_conversions || 0} convertidos
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Percent className="h-4 w-4 text-orange-500" />
            Taxa de Conversão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-500">
            {leadsStats?.conversion_rate?.toFixed(1) || '0.0'}%
          </div>
          <div className="text-xs text-gray-400">
            lead para venda
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-purple-500" />
            Assinaturas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-500">
            {subscriptions?.length || 0}
          </div>
          <div className="text-xs text-gray-400">
            ativas + trial
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminKPICards;
