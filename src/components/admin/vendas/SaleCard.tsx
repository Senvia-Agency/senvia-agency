
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sale } from "@/hooks/useSales";

interface SaleCardProps {
  sale: Sale;
  onViewDetails: (sale: Sale) => void;
}

const SaleCard = ({ sale, onViewDetails }: SaleCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'in_progress': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmada';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'partial': return 'bg-orange-500';
      case 'paid': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'partial': return 'Parcial';
      case 'paid': return 'Pago';
      case 'overdue': return 'Em Atraso';
      default: return status;
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Informações da Venda */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <h3 className="font-semibold text-white text-sm md:text-base">
                {sale.sale_number}
              </h3>
              
              <div className="flex flex-wrap gap-1">
                <Badge className={`${getStatusColor(sale.sale_status)} text-white text-xs`}>
                  {getStatusLabel(sale.sale_status)}
                </Badge>
                
                <Badge className={`${getPaymentStatusColor(sale.payment_status)} text-white text-xs`}>
                  {getPaymentStatusLabel(sale.payment_status)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm text-gray-300">
              <div>
                <span className="text-gray-400">Serviço: </span>
                <span className="truncate">{sale.service_name}</span>
              </div>
              
              <div>
                <span className="text-gray-400">Cliente: </span>
                <span className="truncate">
                  {sale.customers?.full_name || sale.unified_leads?.full_name || 'Cliente Direto'}
                </span>
              </div>
              
              <div>
                <span className="text-gray-400">Data: </span>
                <span>{format(new Date(sale.sale_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
              
              <div>
                <span className="text-gray-400">Valor: </span>
                <span className="font-medium">€{Number(sale.total_value).toFixed(2)}</span>
              </div>
            </div>

            {/* Progresso de Pagamento */}
            {sale.total_value > 0 && (
              <div className="mt-3 p-2 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-gray-400">Pagamento:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">€{Number(sale.paid_amount).toFixed(2)}</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-white">€{Number(sale.total_value).toFixed(2)}</span>
                    {sale.remaining_amount > 0 && (
                      <span className="text-yellow-500 ml-2">
                        (Faltam €{Number(sale.remaining_amount).toFixed(2)})
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-senvia-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((Number(sale.paid_amount) / Number(sale.total_value)) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(sale)}
              className="border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SaleCard;
