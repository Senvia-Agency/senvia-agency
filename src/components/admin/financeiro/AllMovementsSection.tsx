import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useAllFinancialMovements } from "@/hooks/useAllFinancialMovements";
import { DateRange } from "@/components/ui/date-range-picker";
import UnifiedMovementModal from "./UnifiedMovementModal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AllMovementsSectionProps {
  dateRange: DateRange | null;
}

const AllMovementsSection = ({ dateRange }: AllMovementsSectionProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  
  const { data: movements, isLoading } = useAllFinancialMovements(dateRange);

  const getSourceBadge = (source: string) => {
    const variants = {
      casual: { label: 'Casual', className: 'bg-purple-600 text-white' },
      recurring: { label: 'Recorrente', className: 'bg-blue-600 text-white' },
      sale: { label: 'Venda', className: 'bg-orange-600 text-white' },
    };
    
    const variant = variants[source as keyof typeof variants] || variants.casual;
    
    return (
      <Badge className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Registro de Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            Carregando movimentos...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-white">Registro de Movimentações</CardTitle>
            <Button
              onClick={() => setModalOpen(true)}
              variant="default"
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Registro
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!movements || movements.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Nenhum movimento registrado no período selecionado.
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {movements.map((movement) => (
                <div
                  key={movement.id}
                  className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-white">
                          {movement.description}
                        </h4>
                        {getSourceBadge(movement.source)}
                        {movement.type === 'receita' ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      
                      {movement.customer_name && (
                        <p className="text-sm text-gray-400">
                          Cliente: {movement.customer_name}
                        </p>
                      )}
                      
                      {movement.category && (
                        <p className="text-sm text-gray-400">
                          Categoria: {movement.category}
                        </p>
                      )}
                      
                      {movement.notes && (
                        <p className="text-sm text-gray-400 italic">
                          {movement.notes}
                        </p>
                      )}
                      
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>
                          {format(new Date(movement.movement_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </span>
                        {movement.payment_method && (
                          <span>• {movement.payment_method}</span>
                        )}
                        {movement.reference && (
                          <span>• {movement.reference}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-xl font-bold ${
                        movement.type === 'receita' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {movement.type === 'receita' ? '+' : '-'}€{movement.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <UnifiedMovementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default AllMovementsSection;
