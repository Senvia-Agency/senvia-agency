
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Search,
  FileText,
  Eye,
  Edit
} from "lucide-react";
import { useSales } from "@/hooks/useSales";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import CreateSaleModal from "./vendas/CreateSaleModal";
import SaleDetailModal from "./vendas/SaleDetailModal";

const AdminVendas = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);

  const { data: sales, isLoading } = useSales(selectedPeriod);

  // Filtrar vendas
  const filteredSales = sales?.filter(sale => {
    const matchesSearch = 
      sale.sale_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customers?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customers?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || sale.sale_status === statusFilter;
    const matchesPayment = paymentFilter === "all" || sale.payment_status === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Calcular estatísticas
  const totalSales = sales?.length || 0;
  const totalRevenue = sales?.reduce((sum, sale) => sum + Number(sale.total_value), 0) || 0;
  const totalPaid = sales?.reduce((sum, sale) => sum + Number(sale.paid_amount), 0) || 0;
  const pendingSales = sales?.filter(sale => sale.sale_status === 'pending').length || 0;

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold whitespace-nowrap">Módulo de Vendas</h1>
        </div>
        <div className="text-center py-8 text-gray-400">
          Carregando vendas...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 whitespace-nowrap">Módulo de Vendas</h1>
          <p className="text-gray-400 text-sm sm:text-base">Gerencie todas as vendas da SENVIA</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-senvia-500 hover:bg-senvia-400 text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Venda
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total de Vendas</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalSales}</div>
            <p className="text-xs text-gray-400">
              {pendingSales} pendentes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-senvia-500">€{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-400">
              valor total de vendas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Valor Recebido</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">€{totalPaid.toFixed(2)}</div>
            <p className="text-xs text-gray-400">
              pagamentos recebidos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Em Aberto</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">€{(totalRevenue - totalPaid).toFixed(2)}</div>
            <p className="text-xs text-gray-400">
              a receber
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por número, serviço ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Status da Venda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="confirmed">Confirmada</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Status Pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Pagamentos</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="partial">Parcial</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="overdue">Em Atraso</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPeriod.toString()} onValueChange={(value) => setSelectedPeriod(Number(value))}>
              <SelectTrigger className="w-full sm:w-32 bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 dias</SelectItem>
                <SelectItem value="30">30 dias</SelectItem>
                <SelectItem value="90">90 dias</SelectItem>
                <SelectItem value="365">1 ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Vendas */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSales?.map((sale) => (
          <Card key={sale.id} className="bg-gray-800 border-gray-700">
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
                    onClick={() => setSelectedSale(sale)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-600"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {(!filteredSales || filteredSales.length === 0) && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Nenhuma venda encontrada</h3>
            <p className="text-gray-400 mb-4">Comece criando sua primeira venda ou ajuste os filtros.</p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-senvia-500 hover:bg-senvia-400 text-black"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Venda
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modais */}
      <CreateSaleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <SaleDetailModal
        sale={selectedSale}
        isOpen={!!selectedSale}
        onClose={() => setSelectedSale(null)}
      />
    </div>
  );
};

export default AdminVendas;
