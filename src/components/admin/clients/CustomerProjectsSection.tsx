import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Euro, Package, Clock, Edit3, User, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useUpdateSale } from "@/hooks/useSales";

type SaleStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue';

interface Sale {
  id: string;
  sale_number: string;
  service_name: string;
  service_description?: string;
  total_value: number;
  paid_amount: number;
  sale_status: SaleStatus;
  payment_status: PaymentStatus;
  sale_date: string;
  expected_delivery_date?: string;
  delivered_at?: string;
  created_at: string;
  assigned_to?: string;
}

interface CustomerProjectsSectionProps {
  customerId: string;
}

const CustomerProjectsSection = ({ customerId }: CustomerProjectsSectionProps) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [editingAssignee, setEditingAssignee] = useState<string | null>(null);
  const { toast } = useToast();
  const { data: adminUsers, isLoading: adminUsersLoading, error: adminUsersError } = useAdminUsers();
  const updateSale = useUpdateSale();

  // Debug dos usuários admin
  useEffect(() => {
    if (adminUsers) {
      console.log('AdminUsers carregados:', adminUsers);
      console.log('Número de admin users:', adminUsers.length);
    }
    if (adminUsersError) {
      console.error('Erro ao carregar admin users:', adminUsersError);
    }
  }, [adminUsers, adminUsersError]);

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

  const updateSaleStatus = async (saleId: string, newStatus: SaleStatus) => {
    try {
      await updateSale.mutateAsync({
        id: saleId,
        updates: { sale_status: newStatus }
      });

      setSales(prev => prev.map(sale => 
        sale.id === saleId ? { ...sale, sale_status: newStatus } : sale
      ));

      setEditingStatus(null);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const updateSaleAssignee = async (saleId: string, newAssignee: string) => {
    try {
      console.log('Atualizando responsável:', { saleId, newAssignee });
      
      await updateSale.mutateAsync({
        id: saleId,
        updates: { assigned_to: newAssignee }
      });

      setSales(prev => prev.map(sale => 
        sale.id === saleId ? { ...sale, assigned_to: newAssignee } : sale
      ));

      setEditingAssignee(null);
      
      toast({
        title: "Responsável atualizado",
        description: "O responsável pelo projeto foi atualizado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao atualizar responsável:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o responsável.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: SaleStatus) => {
    const colorMap: { [key in SaleStatus]: string } = {
      'pending': 'bg-yellow-500',
      'confirmed': 'bg-blue-500',
      'in_progress': 'bg-orange-500',
      'completed': 'bg-green-500',
      'cancelled': 'bg-red-500'
    };
    return colorMap[status];
  };

  const getStatusLabel = (status: SaleStatus) => {
    const statusMap: { [key in SaleStatus]: string } = {
      'pending': 'Pendente',
      'confirmed': 'Confirmado',
      'in_progress': 'Em Progresso',
      'completed': 'Concluído',
      'cancelled': 'Cancelado'
    };
    return statusMap[status];
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    const colorMap: { [key in PaymentStatus]: string } = {
      'pending': 'bg-yellow-500',
      'partial': 'bg-orange-500',
      'paid': 'bg-green-500',
      'overdue': 'bg-red-500'
    };
    return colorMap[status];
  };

  const getPaymentStatusLabel = (status: PaymentStatus) => {
    const statusMap: { [key in PaymentStatus]: string } = {
      'pending': 'Pendente',
      'partial': 'Parcial', 
      'paid': 'Pago',
      'overdue': 'Em Atraso'
    };
    return statusMap[status];
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

  const getAssignedUserName = (assignedTo: string) => {
    if (!assignedTo) return 'Não atribuído';
    const user = adminUsers?.find(u => u.user_id === assignedTo || u.email === assignedTo);
    return user?.full_name || assignedTo;
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400 text-sm">Carregando projetos...</p>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="text-center py-6">
        <Package className="h-8 w-8 text-gray-500 mx-auto mb-2" />
        <h3 className="text-base font-medium text-white mb-1">Nenhum projeto encontrado</h3>
        <p className="text-gray-400 text-sm">Este cliente ainda não possui projetos/vendas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Debug info */}
      {adminUsersLoading && (
        <div className="text-xs text-yellow-400 mb-2">
          Carregando usuários admin...
        </div>
      )}
      {adminUsersError && (
        <div className="text-xs text-red-400 mb-2">
          Erro ao carregar usuários admin: {adminUsersError.message}
        </div>
      )}
      {adminUsers && (
        <div className="text-xs text-green-400 mb-2">
          {adminUsers.length} usuários admin encontrados
        </div>
      )}

      {sales.map((sale) => (
        <Card key={sale.id} className="bg-gray-700 border-gray-600">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-white text-base truncate">{sale.service_name}</CardTitle>
                <p className="text-xs text-gray-400 mt-1">#{sale.sale_number}</p>
              </div>
              <div className="flex gap-1 ml-2">
                <div className="flex items-center gap-1">
                  {editingStatus === sale.id ? (
                    <div className="flex items-center gap-1">
                      <Select
                        value={sale.sale_status}
                        onValueChange={(value: SaleStatus) => updateSaleStatus(sale.id, value)}
                      >
                        <SelectTrigger className="w-28 h-6 text-xs bg-gray-600 border-gray-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="confirmed">Confirmado</SelectItem>
                          <SelectItem value="in_progress">Em Progresso</SelectItem>
                          <SelectItem value="completed">Concluído</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => setEditingStatus(null)}
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Badge className={`${getStatusColor(sale.sale_status)} text-white text-xs px-2 py-1`}>
                        {getStatusLabel(sale.sale_status)}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 ml-1"
                        onClick={() => setEditingStatus(sale.id)}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3 pt-0">
            {/* Responsável do Projeto */}
            <div className="flex items-center gap-2">
              <User className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-400">Responsável:</span>
              {editingAssignee === sale.id ? (
                <div className="flex items-center gap-1 flex-1">
                  <Select
                    value={sale.assigned_to || 'unassigned'}
                    onValueChange={(value) => updateSaleAssignee(sale.id, value === 'unassigned' ? '' : value)}
                  >
                    <SelectTrigger className="h-6 text-xs bg-gray-600 border-gray-500 flex-1">
                      <SelectValue placeholder="Selecionar responsável" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="unassigned">Não atribuído</SelectItem>
                      {adminUsers?.map((user) => {
                        console.log('Renderizando usuário admin:', user);
                        return (
                          <SelectItem key={user.user_id} value={user.user_id}>
                            {user.full_name} ({user.email})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => setEditingAssignee(null)}
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1 flex-1">
                  <span className="text-xs text-white flex-1">
                    {getAssignedUserName(sale.assigned_to || '')}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => setEditingAssignee(sale.id)}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {/* Progresso compacto */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-300">Projeto</span>
                  <span className="text-xs text-gray-300">{calculateProgress(sale)}%</span>
                </div>
                <Progress value={calculateProgress(sale)} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-300">Pagamento</span>
                  <span className="text-xs text-gray-300">{calculatePaymentProgress(sale)}%</span>
                </div>
                <Progress value={calculatePaymentProgress(sale)} className="h-1.5" />
              </div>
            </div>

            {/* Informações compactas */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Euro className="h-3 w-3 text-gray-400" />
                <div>
                  <span className="text-gray-400">Total: </span>
                  <span className="text-white font-medium">€{Number(sale.total_value).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Euro className="h-3 w-3 text-green-400" />
                <div>
                  <span className="text-gray-400">Pago: </span>
                  <span className="text-green-400 font-medium">€{Number(sale.paid_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Datas compactas */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-blue-400" />
                <div>
                  <span className="text-gray-400">Início: </span>
                  <span className="text-white">
                    {format(new Date(sale.sale_date), 'dd/MM/yy', { locale: ptBR })}
                  </span>
                </div>
              </div>
              
              {sale.expected_delivery_date && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-orange-400" />
                  <div>
                    <span className="text-gray-400">Entrega: </span>
                    <span className="text-white">
                      {format(new Date(sale.expected_delivery_date), 'dd/MM/yy', { locale: ptBR })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Status de pagamento */}
            <div className="flex justify-end">
              <Badge className={`${getPaymentStatusColor(sale.payment_status)} text-white text-xs px-2 py-1`}>
                {getPaymentStatusLabel(sale.payment_status)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CustomerProjectsSection;
