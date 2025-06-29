
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BalanceSummaryCardProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  selectedPeriod: number;
}

const BalanceSummaryCard = ({
  totalRevenue,
  totalExpenses,
  netProfit,
  profitMargin,
  selectedPeriod
}: BalanceSummaryCardProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle>Balanço Atual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Receita Total:</span>
            <span className="font-bold text-green-400">€{totalRevenue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Despesas Total:</span>
            <span className="font-bold text-red-400">€{totalExpenses.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-600 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Lucro Líquido:</span>
              <span className={`font-bold text-lg ${netProfit >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                €{netProfit.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Margem de Lucro:</span>
            <span className="font-bold text-purple-400">{profitMargin.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Período de Análise:</span>
            <span className="font-bold text-senvia-400">{selectedPeriod} dias</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceSummaryCard;
