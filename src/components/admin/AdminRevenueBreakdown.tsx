
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
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-senvia-500" />
          <span className="truncate">Breakdown de Receita</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm sm:text-base">Landing Pages</div>
            <div className="text-xs sm:text-sm text-gray-400">Pagamentos confirmados</div>
          </div>
          <div className="text-left sm:text-right">
            <div className="font-bold text-green-500 text-sm sm:text-base">
              €{landingPageRevenue.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">
              {revenueMetrics?.landing_page_sales || 0} vendas
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm sm:text-base">Senvia Assistant</div>
            <div className="text-xs sm:text-sm text-gray-400">€20.00 por mês</div>
          </div>
          <div className="text-left sm:text-right">
            <div className="font-bold text-purple-500 text-sm sm:text-base">
              €{assistantRevenue.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">
              {revenueMetrics?.active_subscriptions || 0} assinaturas
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
            <div className="font-medium text-sm sm:text-base">Total</div>
            <div className="font-bold text-senvia-500 text-sm sm:text-base">
              €{totalRevenue.toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRevenueBreakdown;
