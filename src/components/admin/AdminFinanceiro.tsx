
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus,
  TrendingUp,
  TrendingDown,
  Euro,
  Calendar,
  Eye,
  Edit,
  Trash2,
  CreditCard,
  Wallet,
  BarChart3,
  Filter
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  created_at: string;
  receipt_url?: string;
  notes?: string;
}

const AdminFinanceiro = () => {
  const { toast } = useToast();
  const [dateFilter, setDateFilter] = useState("30");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Buscar receitas (pagamentos + assinaturas)
  const { data: revenues, isLoading: revenuesLoading } = useQuery({
    queryKey: ['admin-revenues', dateFilter, startDate, endDate],
    queryFn: async () => {
      let dateFilterCondition = new Date();
      if (dateFilter !== "all" && !startDate && !endDate) {
        dateFilterCondition.setDate(dateFilterCondition.getDate() - parseInt(dateFilter));
      }

      // Buscar pagamentos
      let paymentsQuery = supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .order('created_at', { ascending: false });

      if (startDate && endDate) {
        paymentsQuery = paymentsQuery
          .gte('created_at', startDate)
          .lte('created_at', endDate);
      } else if (dateFilter !== "all") {
        paymentsQuery = paymentsQuery.gte('created_at', dateFilterCondition.toISOString());
      }

      const { data: payments, error: paymentsError } = await paymentsQuery;

      // Buscar assinaturas ativas
      let subscriptionsQuery = supabase
        .from('senvia_assistant_subscriptions')
        .select('*')
        .in('status', ['active', 'trial'])
        .order('created_at', { ascending: false });

      if (startDate && endDate) {
        subscriptionsQuery = subscriptionsQuery
          .gte('created_at', startDate)
          .lte('created_at', endDate);
      } else if (dateFilter !== "all") {
        subscriptionsQuery = subscriptionsQuery.gte('created_at', dateFilterCondition.toISOString());
      }

      const { data: subscriptions, error: subsError } = await subscriptionsQuery;

      if (paymentsError || subsError) throw paymentsError || subsError;

      return {
        payments: payments || [],
        subscriptions: subscriptions || []
      };
    },
  });

  // Buscar despesas
  const { data: expenses = [], refetch: refetchExpenses } = useQuery({
    queryKey: ['admin-expenses', dateFilter, categoryFilter, startDate, endDate],
    queryFn: async () => {
      // Como não temos tabela de despesas ainda, retornamos array vazio
      // Você pode criar uma tabela de despesas posteriormente
      return [];
    },
  });

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'created_at'>) => {
    try {
      // Implementar quando criar a tabela de despesas
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "A gestão de despesas será implementada em breve."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a despesa.",
        variant: "destructive"
      });
    }
  };

  // Calcular totais
  const calculateTotals = () => {
    const paymentsTotal = revenues?.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const subscriptionsTotal = revenues?.subscriptions?.reduce((sum, s) => sum + (s.monthly_price * 100), 0) || 0;
    const expensesTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    const totalRevenue = (paymentsTotal + subscriptionsTotal) / 100;
    const totalExpenses = expensesTotal / 100;
    const netProfit = totalRevenue - totalExpenses;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      paymentsRevenue: paymentsTotal / 100,
      subscriptionsRevenue: subscriptionsTotal / 100
    };
  };

  const totals = calculateTotals();

  if (revenuesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Módulo Financeiro</h1>
        </div>
        <div className="text-center py-8 text-gray-400">
          Carregando dados financeiros...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Módulo Financeiro</h1>
          <p className="text-gray-400">Controle completo de receitas e despesas</p>
        </div>
        <Button 
          onClick={() => setIsAddExpenseOpen(true)}
          className="bg-senvia-500 hover:bg-senvia-400 text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Despesa
        </Button>
      </div>

      {/* Filtros */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-2">
              <Input
                type="date"
                placeholder="Data inicial"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
              <Input
                type="date"
                placeholder="Data final"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-40 bg-gray-700 border-gray-600">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="365">Último ano</SelectItem>
                <SelectItem value="all">Todo o período</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-40 bg-gray-700 border-gray-600">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="hosting">Hospedagem</SelectItem>
                <SelectItem value="office">Escritório</SelectItem>
                <SelectItem value="other">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              €{totals.totalRevenue.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">
              {(revenues?.payments?.length || 0) + (revenues?.subscriptions?.length || 0)} transações
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Despesas Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              €{totals.totalExpenses.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">
              {expenses.length} despesas
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Euro className="h-4 w-4 text-purple-500" />
              Lucro Líquido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totals.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              €{totals.netProfit.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">
              {totals.netProfit >= 0 ? 'Lucro' : 'Prejuízo'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              Margem de Lucro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {totals.totalRevenue > 0 ? ((totals.netProfit / totals.totalRevenue) * 100).toFixed(1) : '0.0'}%
            </div>
            <div className="text-xs text-gray-400">
              margem atual
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown de Receitas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-senvia-500" />
              Receitas por Fonte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Landing Pages</div>
                <div className="text-sm text-gray-400">€4.99 por venda</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-500">
                  €{totals.paymentsRevenue.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400">
                  {revenues?.payments?.filter(p => p.amount === 499).length || 0} vendas
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
                  €{totals.subscriptionsRevenue.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400">
                  {revenues?.subscriptions?.length || 0} assinaturas
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-senvia-500" />
              Despesas por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                <p>Nenhuma despesa registrada</p>
                <p className="text-sm">Adicione suas primeiras despesas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Implementar breakdown de despesas quando tiver dados */}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Transações */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Todas as Transações</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Data</TableHead>
                  <TableHead className="text-gray-300">Descrição</TableHead>
                  <TableHead className="text-gray-300">Tipo</TableHead>
                  <TableHead className="text-gray-300">Categoria</TableHead>
                  <TableHead className="text-gray-300">Valor</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Receitas */}
                {revenues?.payments?.map((payment) => (
                  <TableRow key={`payment-${payment.id}`} className="border-gray-700">
                    <TableCell className="text-sm text-gray-300">
                      {format(new Date(payment.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">Pagamento - Landing Page</div>
                        <div className="text-sm text-gray-400">{payment.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/20 text-green-500 border-green-500">
                        Receita
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-300">Vendas</TableCell>
                    <TableCell className="font-bold text-green-500">
                      +€{(payment.amount / 100).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}

                {revenues?.subscriptions?.map((subscription) => (
                  <TableRow key={`subscription-${subscription.id}`} className="border-gray-700">
                    <TableCell className="text-sm text-gray-300">
                      {format(new Date(subscription.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">Assinatura - Senvia Assistant</div>
                        <div className="text-sm text-gray-400">{subscription.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-purple-500/20 text-purple-500 border-purple-500">
                        Assinatura
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-300">Recorrente</TableCell>
                    <TableCell className="font-bold text-green-500">
                      +€{subscription.monthly_price.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                        {subscription.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}

                {/* Despesas */}
                {expenses.map((expense) => (
                  <TableRow key={`expense-${expense.id}`} className="border-gray-700">
                    <TableCell className="text-sm text-gray-300">
                      {format(new Date(expense.date), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-white">{expense.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-red-500/20 text-red-500 border-red-500">
                        Despesa
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-300 capitalize">{expense.category}</TableCell>
                    <TableCell className="font-bold text-red-500">
                      -€{(expense.amount / 100).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Pago</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {(revenues?.payments?.length === 0 && revenues?.subscriptions?.length === 0 && expenses.length === 0) && (
            <div className="text-center py-8">
              <p className="text-gray-400">Nenhuma transação encontrada para o período selecionado.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para adicionar despesa */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Nova Despesa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Descrição</Label>
              <Input placeholder="Ex: Hospedagem do servidor" className="bg-gray-700 border-gray-600" />
            </div>
            <div>
              <Label className="text-gray-300">Valor (€)</Label>
              <Input type="number" step="0.01" placeholder="0.00" className="bg-gray-700 border-gray-600" />
            </div>
            <div>
              <Label className="text-gray-300">Categoria</Label>
              <Select>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="hosting">Hospedagem</SelectItem>
                  <SelectItem value="office">Escritório</SelectItem>
                  <SelectItem value="other">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Data</Label>
              <Input type="date" className="bg-gray-700 border-gray-600" />
            </div>
            <div>
              <Label className="text-gray-300">Notas (opcional)</Label>
              <Textarea placeholder="Observações sobre esta despesa..." className="bg-gray-700 border-gray-600" />
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => setIsAddExpenseOpen(false)}
                variant="outline" 
                className="flex-1 border-gray-600"
              >
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: "Funcionalidade em desenvolvimento",
                    description: "A gestão de despesas será implementada em breve."
                  });
                  setIsAddExpenseOpen(false);
                }}
                className="flex-1 bg-senvia-500 hover:bg-senvia-400 text-black"
              >
                Salvar Despesa
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFinanceiro;
