
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Euro, Calendar, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CustomerPaymentCardProps {
  customer: any;
  onManagePayment: (customer: any) => void;
}

const CustomerPaymentCard = ({ customer, onManagePayment }: CustomerPaymentCardProps) => {
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

  const remainingAmount = (customer.total_value || 0) - (customer.paid_amount || 0);
  const paymentProgress = customer.total_value > 0 ? (customer.paid_amount / customer.total_value) * 100 : 0;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white text-base">{customer.full_name}</CardTitle>
            <p className="text-gray-400 text-sm">{customer.email}</p>
          </div>
          <div className="flex items-center gap-2">
            {customer.payment_status && (
              <Badge className={`${getPaymentStatusColor(customer.payment_status)} text-white text-xs`}>
                {getPaymentStatusLabel(customer.payment_status)}
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onManagePayment(customer)}
              className="border-senvia-500 text-senvia-500 hover:bg-senvia-500 hover:text-black"
            >
              <Euro className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Service Info */}
        {customer.service_type && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Serviço:</span>
            <span className="text-white text-sm font-medium">
              {customer.service_type === 'landing_page_basic' && 'Landing Page Básica'}
              {customer.service_type === 'landing_page_premium' && 'Landing Page Premium'}
              {customer.service_type === 'website_basic' && 'Website Básico'}
              {customer.service_type === 'website_premium' && 'Website Premium'}
              {customer.service_type === 'ecommerce' && 'E-commerce'}
              {customer.service_type === 'custom' && 'Serviço Personalizado'}
            </span>
          </div>
        )}

        {/* Payment Info */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Valor Total:</span>
            <span className="text-white font-bold">€{(customer.total_value || 0).toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Valor Pago:</span>
            <span className="text-green-500 font-bold">€{(customer.paid_amount || 0).toFixed(2)}</span>
          </div>

          {remainingAmount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Em Falta:</span>
              <span className="text-yellow-500 font-bold">€{remainingAmount.toFixed(2)}</span>
            </div>
          )}

          {/* Progress Bar */}
          {customer.total_value > 0 && (
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-senvia-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(paymentProgress, 100)}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Payment Method */}
        {customer.payment_method && (
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400 text-sm">
              {customer.payment_method === 'stripe' && 'Stripe'}
              {customer.payment_method === 'bank_transfer' && 'Transferência'}
              {customer.payment_method === 'cash' && 'Dinheiro'}
              {customer.payment_method === 'mbway' && 'MB Way'}
              {customer.payment_method === 'other' && 'Outro'}
            </span>
          </div>
        )}

        {/* Last Payment Date */}
        {customer.last_payment_date && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400 text-sm">
              Último pagamento: {format(new Date(customer.last_payment_date), 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          </div>
        )}

        {/* Notes */}
        {customer.payment_notes && (
          <div className="bg-gray-700 p-2 rounded text-sm text-gray-300">
            {customer.payment_notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerPaymentCard;
