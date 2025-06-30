
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface RevenueBreakdownCardProps {
  financialData: any;
}

const RevenueBreakdownCard = ({ financialData }: RevenueBreakdownCardProps) => {
  const landingPagesRevenue = financialData?.landing_pages?.revenue || 0;
  const assistantRevenue = financialData?.senvia_assistant?.revenue || 0;
  const salesRevenue = financialData?.sales_module?.revenue || 0;
  const movementsRevenue = financialData?.financial_movements?.revenue || 0;
  const totalRevenue = financialData?.total_revenue || 0;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-senvia-500" />
          Breakdown de Receita
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Landing Pages</div>
            <div className="text-sm text-gray-400">
              {financialData?.landing_pages?.count || 0} transações
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-green-500">
              €{landingPagesRevenue.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Senvia Assistant</div>
            <div className="text-sm text-gray-400">
              {financialData?.senvia_assistant?.count || 0} assinaturas
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-purple-500">
              €{assistantRevenue.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Módulo de Vendas</div>
            <div className="text-sm text-gray-400">
              {financialData?.sales_module?.count || 0} vendas - €{(financialData?.sales_module?.pending_amount || 0).toFixed(2)} pendente
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-blue-500">
              €{salesRevenue.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Movimentos Manuais</div>
            <div className="text-sm text-gray-400">
              {financialData?.financial_movements?.movements?.filter(m => m.movement_type === 'receita')?.length || 0} entradas
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-orange-500">
              €{movementsRevenue.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div className="font-medium text-lg">Total</div>
            <div className="font-bold text-senvia-500 text-lg">
              €{totalRevenue.toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueBreakdownCard;
