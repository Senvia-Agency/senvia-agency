
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface AdminRevenueBreakdownProps {
  revenueMetrics: any;
}

const AdminRevenueBreakdown = ({ revenueMetrics }: AdminRevenueBreakdownProps) => {
  console.log('AdminRevenueBreakdown - Dados recebidos:', revenueMetrics);

  const landingPageRevenue = revenueMetrics?.landing_page_revenue || 0;
  const assistantRevenue = revenueMetrics?.assistant_revenue || 0;
  const totalRevenue = revenueMetrics?.total_revenue || 0;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-senvia-500" />
          Breakdown de Receita
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Landing Pages</div>
            <div className="text-sm text-gray-400">Pagamentos confirmados</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-green-500">
              €{landingPageRevenue.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">
              {revenueMetrics?.landing_page_sales || 0} vendas
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Senvia Assistant</div>
            <div className="text-sm text-gray-400">€20.00 por mês</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-purple-500">
              €{assistantRevenue.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">
              {revenueMetrics?.active_subscriptions || 0} assinaturas
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div className="font-medium">Total</div>
            <div className="font-bold text-senvia-500">
              €{totalRevenue.toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRevenueBreakdown;
