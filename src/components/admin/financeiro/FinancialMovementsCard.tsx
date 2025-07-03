
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
  
  const handleMovementClick = (movement: FinancialMovement) => {
    console.log('Clicando no movimento:', movement);
    // Agora todos os movimentos são editáveis
    setSelectedMovement(movement);
  };
  
  return (
    <>
      <Card className="bg-gray-800 border-gray-700 flex flex-col h-full">
        <CardHeader className="pb-4 flex-shrink-0">
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
        <CardContent className="flex-1 p-0 overflow-hidden">
          <div className="h-full max-h-[400px] overflow-y-auto custom-scrollbar">
            <div className="space-y-3 p-6">
              {movements.slice(0, 50).map((movement) => {
                return (
                  <div 
                    key={movement.id} 
                    className="flex justify-between items-center p-3 rounded cursor-pointer hover:bg-gray-700 transition-colors border border-gray-600/50"
                    onClick={() => handleMovementClick(movement)}
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
                );
              })}
              {movements.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  Nenhum movimento registrado
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <EditMovementModal
          movement={selectedMovement}
          isOpen={!!selectedMovement}
          onClose={() => setSelectedMovement(null)}
          onUpdate={onUpdateMovement}
          isUpdating={isUpdating}
        />
      </Card>

      {/* CSS customizado para scrollbar mais discreta */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.7);
        }
        
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(107, 114, 128, 0.5) rgba(55, 65, 81, 0.3);
        }
      `}</style>
    </>
  );
};

export default FinancialMovementsCard;
