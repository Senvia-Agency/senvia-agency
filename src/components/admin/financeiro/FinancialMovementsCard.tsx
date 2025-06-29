
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FinancialMovementsCardProps {
  movements: any[];
  onAddMovement: () => void;
}

const FinancialMovementsCard = ({ movements, onAddMovement }: FinancialMovementsCardProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5 text-senvia-500" />
            Movimentos Financeiros
          </CardTitle>
          <Button 
            size="sm" 
            className="bg-senvia-500 hover:bg-senvia-400 text-black"
            onClick={onAddMovement}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {movements.slice(0, 5).map((movement) => (
          <div key={movement.id} className="flex justify-between items-center">
            <div>
              <div className="font-medium text-sm">{movement.description}</div>
              <div className="text-xs text-gray-400 capitalize">
                {movement.category.replace('_', ' ')} • {movement.movement_type}
              </div>
            </div>
            <div className="text-right">
              <div className={`font-bold ${movement.movement_type === 'receita' ? 'text-green-500' : 'text-red-500'}`}>
                {movement.movement_type === 'receita' ? '+' : '-'}€{Number(movement.amount).toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">
                {format(new Date(movement.movement_date), 'dd/MM', { locale: ptBR })}
              </div>
            </div>
          </div>
        ))}
        {movements.length === 0 && (
          <div className="text-center text-gray-400 py-4">
            Nenhum movimento registrado
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialMovementsCard;
