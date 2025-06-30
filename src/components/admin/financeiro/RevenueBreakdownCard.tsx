
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface RevenueBreakdownCardProps {
  financialData: any;
}

const RevenueBreakdownCard = ({ financialData }: RevenueBreakdownCardProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-senvia-500" />
          Receitas por Produto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Landing Pages</div>
            <div className="text-sm text-gray-400">Valor variável</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-green-500">
              €{financialData?.landing_pages.revenue?.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-gray-400">
              {financialData?.landing_pages.count || 0} vendas
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
              €{financialData?.senvia_assistant.revenue?.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-gray-400">
              {financialData?.senvia_assistant.count || 0} assinaturas
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Outros Movimentos</div>
            <div className="text-sm text-gray-400">Receitas adicionais</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-orange-500">
              €{financialData?.financial_movements.revenue?.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs text-gray-400">
              movimentos manuais
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueBreakdownCard;
