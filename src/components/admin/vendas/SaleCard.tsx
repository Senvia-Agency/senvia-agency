
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Repeat, Calendar, User, Euro } from "lucide-react";
import { Sale } from "@/hooks/sales/types";
import { useState } from "react";
import ConvertToRecurringModal from "./ConvertToRecurringModal";

interface SaleCardProps {
  sale: Sale;
  onViewDetails: (sale: Sale) => void;
}

const SaleCard = ({ sale, onViewDetails }: SaleCardProps) => {
  const [showConvertModal, setShowConvertModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'partial': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  return (
    <>
      <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">{sale.service_name}</h3>
              <p className="text-sm text-gray-400">#{sale.sale_number}</p>
            </div>
            <div className="flex gap-2">
              <Badge className={`${getStatusColor(sale.sale_status)} text-white`}>
                {sale.sale_status}
              </Badge>
              <Badge className={`${getPaymentStatusColor(sale.payment_status)} text-white`}>
                {sale.payment_status}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Cliente */}
          {sale.customers && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300">{sale.customers.full_name}</span>
            </div>
          )}

          {/* Valor */}
          <div className="flex items-center gap-2 text-sm">
            <Euro className="h-4 w-4 text-green-500" />
            <span className="text-white font-medium">€{Number(sale.total_value).toFixed(2)}</span>
            {sale.paid_amount > 0 && (
              <span className="text-gray-400">
                (Pago: €{Number(sale.paid_amount).toFixed(2)})
              </span>
            )}
          </div>

          {/* Data */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-300">{formatDate(sale.sale_date)}</span>
          </div>

          {/* Descrição */}
          {sale.service_description && (
            <p className="text-sm text-gray-400 line-clamp-2">
              {sale.service_description}
            </p>
          )}

          {/* Ações */}
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
            
            {sale.sale_status !== 'cancelled' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConvertModal(true)}
                className="border-senvia-500 text-senvia-500 hover:bg-senvia-500/10"
              >
                <Repeat className="h-4 w-4 mr-2" />
                Tornar Recorrente
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ConvertToRecurringModal
        sale={sale}
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
      />
    </>
  );
};

export default SaleCard;
