
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import EditMovementModal from "./EditMovementModal";
import { FinancialMovement } from "@/hooks/useFinancialMovements";

interface FinancialMovementsCardProps {
  movements: FinancialMovement[];
  onAddMovement: () => void;
  onUpdateMovement: (id: string, updates: Partial<FinancialMovement>) => void;
  isUpdating: boolean;
}

const FinancialMovementsCard = ({ movements, onAddMovement, onUpdateMovement, isUpdating }: FinancialMovementsCardProps) => {
  const [selectedMovement, setSelectedMovement] = useState<FinancialMovement | null>(null);
  
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5 text-senvia-400" />
            Movimentos Financeiros
          </CardTitle>
          <Button 
            size="sm" 
            className="bg-senvia-500 hover:bg-senvia-400 text-slate-900 font-semibold shadow-md hover:shadow-lg transition-all"
            onClick={onAddMovement}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px] px-6">
          <div className="space-y-3 py-3">
            {movements.slice(0, 20).map((movement) => (
              <div 
                key={movement.id} 
                className="flex justify-between items-center cursor-pointer hover:bg-gray-700 p-2 rounded transition-colors"
                onClick={() => setSelectedMovement(movement)}
              >
                <div>
                  <div className="font-medium text-sm">{movement.description}</div>
                  <div className="text-xs text-gray-400 capitalize">
                    {movement.category.replace('_', ' ')} • {movement.movement_type === 'receita' ? 'Receita' : 'Despesa'}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${movement.movement_type === 'receita' ? 'text-green-400' : 'text-red-400'}`}>
                    {movement.movement_type === 'receita' ? '+' : '-'}€{Number(movement.amount).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {format(new Date(movement.movement_date), 'dd/MM', { locale: ptBR })}
                  </div>
                </div>
              </div>
            ))}
            {movements.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                Nenhum movimento registrado
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <EditMovementModal
        movement={selectedMovement}
        isOpen={!!selectedMovement}
        onClose={() => setSelectedMovement(null)}
        onUpdate={onUpdateMovement}
        isUpdating={isUpdating}
      />
    </Card>
  );
};

export default FinancialMovementsCard;
