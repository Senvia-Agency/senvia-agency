import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, CreditCard, TrendingUp, Users, Calendar, DollarSign, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30');
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, [searchTerm, statusFilter, dateRange]);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('payments')
        .select('*');

      if (searchTerm) {
        query = query.ilike('customer_name', `%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const daysAgo = parseInt(dateRange);
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - daysAgo);
      query = query.gte('created_at', dateThreshold.toISOString());

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar pagamentos:', error);
        return;
      }

      setPayments(data || []);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalRevenue = () => {
    return payments.reduce((sum, payment) => sum + (payment.amount / 100), 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight break-words">
            Gestão de<br className="sm:hidden" /> Pagamentos
          </h1>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400">Carregando pagamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight break-words">
            Gestão de<br className="sm:hidden" /> Pagamentos
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-1 break-words">
            Acompanhe todos os<br className="sm:hidden" /> pagamentos recebidos
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-3 md:p-4">
          <div className="space-y-3 md:space-y-0 md:flex md:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Pesquisar pagamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:flex md:gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all" className="text-white hover:bg-gray-600">Todos os Status</SelectItem>
                  <SelectItem value="paid" className="text-white hover:bg-gray-600">Pago</SelectItem>
                  <SelectItem value="pending" className="text-white hover:bg-gray-600">Pendente</SelectItem>
                  <SelectItem value="failed" className="text-white hover:bg-gray-600">Falhou</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="7" className="text-white hover:bg-gray-600">Últimos 7 dias</SelectItem>
                  <SelectItem value="30" className="text-white hover:bg-gray-600">Últimos 30 dias</SelectItem>
                  <SelectItem value="90" className="text-white hover:bg-gray-600">Últimos 90 dias</SelectItem>
                  <SelectItem value="365" className="text-white hover:bg-gray-600">Últimos 365 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <CardTitle className="text-lg font-medium text-white">Receita Total</CardTitle>
                <div className="text-2xl font-bold text-green-500">€{getTotalRevenue().toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-blue-500" />
              <div>
                <CardTitle className="text-lg font-medium text-white">Pagamentos Recebidos</CardTitle>
                <div className="text-2xl font-bold text-blue-500">{payments.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <CardTitle className="text-lg font-medium text-white">Valor Médio</CardTitle>
                <div className="text-2xl font-bold text-purple-500">
                  €{(payments.length > 0 ? getTotalRevenue() / payments.length : 0).toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-white">Lista de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-700">
                <tr>
                  <th className="p-2 text-left">Cliente</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Valor</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Data</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id} className="hover:bg-gray-600 cursor-pointer">
                    <td className="p-2 text-white">{payment.customer_name}</td>
                    <td className="p-2 text-gray-300">{payment.customer_email}</td>
                    <td className="p-2 text-white">€{(payment.amount / 100).toFixed(2)}</td>
                    <td className="p-2">
                      <Badge className={`${getStatusColor(payment.status)} text-white`}>{payment.status}</Badge>
                    </td>
                    <td className="p-2 text-gray-300">
                      {format(new Date(payment.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {payments.length === 0 && (
            <div className="text-center py-4 text-gray-400">Nenhum pagamento encontrado.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments;
