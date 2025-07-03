
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, User, Eye, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sale } from "@/hooks/sales/types";

interface SaleCardProps {
  sale: Sale;
  onViewDetails: (sale: Sale) => void;
  onConvertToRecurring?: (sale: Sale) => void;
}

const SaleCard = ({ sale, onViewDetails, onConvertToRecurring }: SaleCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'overdue':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'overdue': return 'Vencido';
      default: return status;
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-white text-lg mb-1 truncate">
              {sale.service_name}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>#{sale.sale_number}</span>
              {sale.customers && (
                <>
                  <span>•</span>
                  <span className="truncate">{sale.customers.full_name}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 ml-4">
            <Badge variant="outline" className={getStatusColor(sale.sale_status)}>
              {getStatusText(sale.sale_status)}
            </Badge>
            <Badge variant="outline" className={getPaymentStatusColor(sale.payment_status)}>
              {getPaymentStatusText(sale.payment_status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="font-medium">€{sale.total_value}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span>{format(new Date(sale.sale_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
          </div>
          
          {sale.assigned_to && (
            <div className="flex items-center gap-2 text-gray-300">
              <User className="h-4 w-4 text-purple-500" />
              <span className="truncate">{sale.assigned_to}</span>
            </div>
          )}
        </div>

        {sale.service_description && (
          <p className="text-sm text-gray-400 line-clamp-2">
            {sale.service_description}
          </p>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(sale)}
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
          
          {onConvertToRecurring && sale.sale_status !== 'cancelled' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onConvertToRecurring(sale)}
              className="border-senvia-500 text-senvia-500 hover:bg-senvia-500/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tornar Recorrente
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SaleCard;
