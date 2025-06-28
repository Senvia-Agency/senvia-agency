
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  CreditCard, 
  Euro, 
  TrendingUp, 
  Calendar,
  Filter,
  Download,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("30");

  // Buscar pagamentos
  const { data: payments, refetch, isLoading } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Filtrar pagamentos
  const filteredPayments = payments?.filter(payment => {
    const matchesSearch = 
      payment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.stripe_customer_id?.includes(searchTerm) ||
      payment.id.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    
    if (dateRange !== "all") {
      const days = parseInt(dateRange);
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - days);
      const paymentDate = new Date(payment.created_at);
      if (paymentDate < dateLimit) return false;
    }

    return matchesSearch && matchesStatus;
  }) || [];

  // Calcular estatísticas
  const stats = {
    total: payments?.length || 0,
    totalRevenue: payments?.reduce((sum, p) => sum + (p.status === 'paid' ? p.amount : 0), 0) || 0,
    paid: payments?.filter(p => p.status === 'paid').length || 0,
    pending: payments?.filter(p => p.status === 'pending').length || 0,
    failed: payments?.filter(p => p.status === 'failed').length || 0,
    avgTransaction: payments?.length ? (payments.reduce((sum, p) => sum + p.amount, 0) / payments.length) : 0
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'paid': 'Pago',
      'pending': 'Pendente',
      'failed': 'Falhado',
      'refunded': 'Reembolsado'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'paid': 'bg-green-500',
      'pending': 'bg-yellow-500',
      'failed': 'bg-red-500',
      'refunded': 'bg-gray-500'
    };
    return colorMap[status] || 'bg-gray-500';
  };

  const getServiceLabel = (amount: number) => {
    if (amount === 499) return 'Landing Page';
    if (amount === 2000) return 'Senvia Assistant';
    return 'Serviço Personalizado';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestão de Pagamentos</h1>
        </div>
        <div className="text-center py-8 text-gray-400">
          Carregando pagamentos...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestão de Pagamentos</h1>
          <p className="text-gray-400">Monitore todas as transações da SENVIA</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold">€{(stats.totalRevenue / 100).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pagamentos Confirmados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold">{stats.paid}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-yellow-500" />
              <span className="text-2xl font-bold">{stats.pending}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-purple-500" />
              <span className="text-2xl font-bold">€{(stats.avgTransaction / 100).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por email, ID do cliente ou ID da transação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-gray-700 border-gray-600">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="failed">Falhado</SelectItem>
                <SelectItem value="refunded">Reembolsado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full md:w-40 bg-gray-700 border-gray-600">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo o período</SelectItem>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">ID da Transação</TableHead>
                  <TableHead className="text-gray-300">Cliente</TableHead>
                  <TableHead className="text-gray-300">Serviço</TableHead>
                  <TableHead className="text-gray-300">Valor</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Data</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className="border-gray-700">
                    <TableCell>
                      <div>
                        <div className="font-mono text-sm text-gray-300">
                          {payment.id.slice(0, 8)}...
                        </div>
                        {payment.stripe_payment_id && (
                          <div className="text-xs text-gray-400">
                            Stripe: {payment.stripe_payment_id.slice(-8)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{payment.email}</div>
                        {payment.stripe_customer_id && (
                          <div className="text-xs text-gray-400">
                            ID: {payment.stripe_customer_id.slice(-8)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline" className="border-blue-500 text-blue-500">
                        {getServiceLabel(payment.amount)}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="font-bold text-green-500">
                        €{(payment.amount / 100).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {payment.currency.toUpperCase()}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(payment.status)}`}></div>
                        <span className="text-sm text-gray-300">{getStatusLabel(payment.status)}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm text-gray-300">
                        {format(new Date(payment.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                      <div className="text-xs text-gray-400">
                        {format(new Date(payment.created_at), 'HH:mm', { locale: ptBR })}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">Nenhum pagamento encontrado.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-senvia-500" />
              Breakdown por Serviço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Landing Pages</div>
                <div className="text-sm text-gray-400">€4.99 por lead</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-500">
                  €{((payments?.filter(p => p.amount === 499 && p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) || 0) / 100).toFixed(2)}
                </div>
                <div className="text-xs text-gray-400">
                  {payments?.filter(p => p.amount === 499 && p.status === 'paid').length || 0} vendas
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Senvia Assistant</div>
                <div className="text-sm text-gray-400">€20.00 por mês</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-purple-500">
                  €{((payments?.filter(p => p.amount === 2000 && p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) || 0) / 100).toFixed(2)}
                </div>
                <div className="text-xs text-gray-400">
                  {payments?.filter(p => p.amount === 2000 && p.status === 'paid').length || 0} assinaturas
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-senvia-500" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="font-medium">Taxa de Sucesso</div>
              <div className="font-bold text-green-500">
                {stats.total > 0 ? ((stats.paid / stats.total) * 100).toFixed(1) : 0}%
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="font-medium">Pagamentos Falhados</div>
              <div className="font-bold text-red-500">
                {stats.failed}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="font-medium">Valor Médio</div>
              <div className="font-bold text-blue-500">
                €{(stats.avgTransaction / 100).toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPayments;
