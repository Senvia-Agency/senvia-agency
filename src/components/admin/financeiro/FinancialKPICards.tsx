
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Euro, Target } from "lucide-react";

interface FinancialKPICardsProps {
  selectedPeriod: number;
}

const FinancialKPICards = ({ selectedPeriod }: FinancialKPICardsProps) => {
  // Mock data for now - in a real app, this would come from props or API
  const totalRevenue = 15420.50;
  const totalExpenses = 8750.25;
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Receita Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            €{totalRevenue.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400">
            {selectedPeriod} dias
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-500" />
            Despesas Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            €{totalExpenses.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400">
            {selectedPeriod} dias
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Euro className="h-4 w-4 text-blue-500" />
            Lucro Líquido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
            €{netProfit.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400">
            receita - despesas
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Target className="h-4 w-4 text-purple-500" />
            Margem de Lucro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-500">
            {profitMargin.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400">
            margem líquida
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialKPICards;
