
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Euro, Package, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

interface Sale {
  id: string;
  sale_number: string;
  service_name: string;
  service_description?: string;
  total_value: number;
  paid_amount: number;
  sale_status: string;
  payment_status: string;
  sale_date: string;
  expected_delivery_date?: string;
  delivered_at?: string;
  created_at: string;
}

interface CustomerProjectsSectionProps {
  customerId: string;
}

const CustomerProjectsSection = ({ customerId }: CustomerProjectsSectionProps) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerSales = async () => {
      try {
        const { data, error } = await supabase
          .from('sales')
          .select('*')
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar vendas do cliente:', error);
          return;
        }

        setSales(data || []);
      } catch (error) {
        console.error('Erro ao buscar vendas:', error);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomerSales();
    }
  }, [customerId]);

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'pending': 'bg-yellow-500',
      'confirmed': 'bg-blue-500',
      'in_progress': 'bg-orange-500',
      'completed': 'bg-green-500',
      'cancelled': 'bg-red-500'
    };
    return colorMap[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendente',
      'confirmed': 'Confirmado',
      'in_progress': 'Em Progresso',
      'completed': 'Concluído',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'pending': 'bg-yellow-500',
      'partial': 'bg-orange-500',
      'paid': 'bg-green-500',
      'overdue': 'bg-red-500'
    };
    return colorMap[status] || 'bg-gray-500';
  };

  const getPaymentStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendente',
      'partial': 'Parcial',
      'paid': 'Pago',
      'overdue': 'Em Atraso'
    };
    return statusMap[status] || status;
  };

  const calculateProgress = (sale: Sale) => {
    if (sale.sale_status === 'completed') return 100;
    if (sale.sale_status === 'cancelled') return 0;
    if (sale.sale_status === 'in_progress') return 50;
    if (sale.sale_status === 'confirmed') return 25;
    return 10; // pending
  };

  const calculatePaymentProgress = (sale: Sale) => {
    if (sale.total_value === 0) return 0;
    return Math.round((sale.paid_amount / sale.total_value) * 100);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Carregando projetos...</p>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Nenhum projeto encontrado</h3>
        <p className="text-gray-400">Este cliente ainda não possui projetos/vendas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sales.map((sale) => (
        <Card key={sale.id} className="bg-gray-700 border-gray-600">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-white text-lg">{sale.service_name}</CardTitle>
                <p className="text-sm text-gray-400 mt-1">#{sale.sale_number}</p>
                {sale.service_description && (
                  <p className="text-sm text-gray-300 mt-2">{sale.service_description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Badge className={`${getStatusColor(sale.sale_status)} text-white`}>
                  {getStatusLabel(sale.sale_status)}
                </Badge>
                <Badge className={`${getPaymentStatusColor(sale.payment_status)} text-white`}>
                  {getPaymentStatusLabel(sale.payment_status)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Progresso do Projeto */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Progresso do Projeto</span>
                <span className="text-sm text-gray-300">{calculateProgress(sale)}%</span>
              </div>
              <Progress value={calculateProgress(sale)} className="h-2" />
            </div>

            {/* Progresso do Pagamento */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Pagamento</span>
                <span className="text-sm text-gray-300">{calculatePaymentProgress(sale)}%</span>
              </div>
              <Progress value={calculatePaymentProgress(sale)} className="h-2" />
            </div>

            {/* Informações Financeiras */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Euro className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-400">Valor Total</p>
                  <p className="text-white font-medium">€{Number(sale.total_value).toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Euro className="h-4 w-4 text-green-400" />
                <div>
                  <p className="text-gray-400">Valor Pago</p>
                  <p className="text-green-400 font-medium">€{Number(sale.paid_amount).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Datas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-gray-400">Início</p>
                  <p className="text-white">
                    {format(new Date(sale.sale_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
              </div>
              
              {sale.expected_delivery_date && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-400" />
                  <div>
                    <p className="text-gray-400">Entrega Prevista</p>
                    <p className="text-white">
                      {format(new Date(sale.expected_delivery_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                </div>
              )}

              {sale.delivered_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-400" />
                  <div>
                    <p className="text-gray-400">Entregue em</p>
                    <p className="text-green-400">
                      {format(new Date(sale.delivered_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CustomerProjectsSection;
