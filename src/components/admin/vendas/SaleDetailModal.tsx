
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Calendar, DollarSign, User, Package } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SaleDetailModalProps {
  sale: any;
  isOpen: boolean;
  onClose: () => void;
}

const SaleDetailModal = ({ sale, isOpen, onClose }: SaleDetailModalProps) => {
  if (!sale) return null;

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

  const paymentProgress = sale.total_value > 0 ? (Number(sale.paid_amount) / Number(sale.total_value)) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-800 border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-xl">
              Detalhes da Venda - {sale.sale_number}
            </DialogTitle>
            <div className="flex gap-2">
              <Badge className={`${getStatusColor(sale.sale_status)} text-white`}>
                {getStatusLabel(sale.sale_status)}
              </Badge>
              <Badge className={`${getPaymentStatusColor(sale.payment_status)} text-white`}>
                {getPaymentStatusLabel(sale.payment_status)}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cliente */}
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5 text-senvia-500" />
                  Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sale.customers ? (
                  <>
                    <div>
                      <span className="text-gray-400">Nome: </span>
                      <span className="text-white">{sale.customers.full_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Email: </span>
                      <span className="text-white">{sale.customers.email}</span>
                    </div>
                  </>
                ) : sale.unified_leads ? (
                  <>
                    <div>
                      <span className="text-gray-400">Nome: </span>
                      <span className="text-white">{sale.unified_leads.full_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Email: </span>
                      <span className="text-white">{sale.unified_leads.email}</span>
                    </div>
                    <div className="text-xs text-yellow-500">
                      Originado de Lead
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400">Venda Direta</div>
                )}
              </CardContent>
            </Card>

            {/* Serviço */}
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Package className="h-5 w-5 text-senvia-500" />
                  Serviço
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-gray-400">Nome: </span>
                  <span className="text-white">{sale.service_name}</span>
                </div>
                {sale.service_description && (
                  <div>
                    <span className="text-gray-400">Descrição: </span>
                    <span className="text-white">{sale.service_description}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-400">Tipo: </span>
                  <span className="text-white capitalize">
                    {sale.service_type.replace('_', ' ')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Valores e Pagamento */}
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="h-5 w-5 text-senvia-500" />
                Informações Financeiras
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-600 rounded-lg">
                  <div className="text-2xl font-bold text-white">
                    €{Number(sale.total_value).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Valor Total</div>
                </div>
                
                <div className="text-center p-4 bg-gray-600 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">
                    €{Number(sale.paid_amount).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Valor Pago</div>
                </div>
                
                <div className="text-center p-4 bg-gray-600 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-500">
                    €{Number(sale.remaining_amount).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Em Aberto</div>
                </div>
              </div>

              {/* Barra de Progresso */}
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progresso do Pagamento</span>
                  <span>{Math.round(paymentProgress)}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-3">
                  <div 
                    className="bg-senvia-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(paymentProgress, 100)}%` }}
                  ></div>
                </div>
              </div>

              {sale.payment_method && (
                <div>
                  <span className="text-gray-400">Método de Pagamento: </span>
                  <span className="text-white capitalize">
                    {sale.payment_method.replace('_', ' ')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Datas Importantes */}
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="h-5 w-5 text-senvia-500" />
                Cronograma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400">Data da Venda: </span>
                  <span className="text-white">
                    {format(new Date(sale.sale_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
                
                {sale.expected_delivery_date && (
                  <div>
                    <span className="text-gray-400">Entrega Prevista: </span>
                    <span className="text-white">
                      {format(new Date(sale.expected_delivery_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                )}
                
                {sale.delivered_at && (
                  <div>
                    <span className="text-gray-400">Data de Entrega: </span>
                    <span className="text-white">
                      {format(new Date(sale.delivered_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                )}
                
                <div>
                  <span className="text-gray-400">Criada em: </span>
                  <span className="text-white">
                    {format(new Date(sale.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          {(sale.notes || sale.internal_notes) && (
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Observações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sale.notes && (
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Observações Gerais:</div>
                    <div className="text-white bg-gray-600 p-3 rounded">
                      {sale.notes}
                    </div>
                  </div>
                )}
                
                {sale.internal_notes && (
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Notas Internas:</div>
                    <div className="text-white bg-gray-600 p-3 rounded">
                      {sale.internal_notes}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-600">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Venda
            </Button>
            <Button
              onClick={onClose}
              className="bg-senvia-500 hover:bg-senvia-400 text-black"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaleDetailModal;
