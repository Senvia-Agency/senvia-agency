
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
  
  // Função para verificar se é um movimento manual editável
  const isManualMovement = (movement: FinancialMovement) => {
    // Movimentos manuais são aqueles criados diretamente na tabela financial_movements
    // Eles não têm IDs compostos e não são de fontes externas
    const hasCompositeId = movement.id.includes('-');
    const isFromExternalSource = movement.category === 'venda' || 
      movement.category === 'landing_page' ||
      movement.description === 'Transação de cliente' ||
      movement.description.includes('Landing Page €4.99');
    
    return !hasCompositeId && !isFromExternalSource;
  };
  
  const handleMovementClick = (movement: FinancialMovement) => {
    console.log('Clicando no movimento:', movement);
    console.log('É movimento manual?', isManualMovement(movement));
    
    if (isManualMovement(movement)) {
      setSelectedMovement(movement);
    }
  };
  
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
            {movements.slice(0, 20).map((movement) => {
              const canEdit = isManualMovement(movement);
              
              return (
                <div 
                  key={movement.id} 
                  className={`flex justify-between items-center p-2 rounded transition-colors ${
                    canEdit 
                      ? 'cursor-pointer hover:bg-gray-700' 
                      : 'cursor-default'
                  }`}
                  onClick={() => handleMovementClick(movement)}
                >
                  <div>
                    <div className="font-medium text-sm">{movement.description}</div>
                    <div className="text-xs text-gray-400 capitalize flex items-center gap-2">
                      {movement.category.replace('_', ' ')} • {movement.movement_type === 'receita' ? 'Receita' : 'Despesa'}
                      {!canEdit && (
                        <span className="text-xs bg-gray-600 px-2 py-1 rounded">Automático</span>
                      )}
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
              );
            })}
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
