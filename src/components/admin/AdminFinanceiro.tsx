import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Calendar,
  Euro,
  CreditCard,
  Receipt,
  Target,
  BarChart3
} from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminFinanceiro = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });

  // Buscar receitas CORRIGIDA
  const { data: revenueData, refetch: refetchRevenue } = useQuery({
    queryKey: ['admin-revenue', selectedPeriod],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - selectedPeriod);
      
      // Buscar APENAS pagamentos confirmados (status = 'paid')
      const { data: paidPayments } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .gte('created_at', startDate.toISOString());

      // Receitas do Senvia Assistant
      const { data: assistantSubs } = await supabase
        .from('senvia_assistant_subscriptions')
        .select('*')
        .eq('status', 'active')
        .gte('created_at', startDate.toISOString());

      // Calcular receitas reais baseadas nos amounts
      const landingPageRevenue = (paidPayments || [])
        .reduce((sum, p) => sum + (p.amount / 100), 0); // Converter de centavos para euros
      
      const assistantRevenue = (assistantSubs || [])
        .reduce((sum, s) => sum + (s.monthly_price || 20), 0);
      
      return {
        landing_pages: {
          count: paidPayments?.length || 0,
          revenue: landingPageRevenue,
          transactions: paidPayments || []
        },
        senvia_assistant: {
          count: assistantSubs?.length || 0,
          revenue: assistantRevenue,
          subscriptions: assistantSubs || []
        },
        total_revenue: landingPageRevenue + assistantRevenue
      };
    },
    refetchInterval: 60000,
  });

  // Buscar despesas simuladas (criar tabela expense no futuro)
  const { data: expensesData, refetch: refetchExpenses } = useQuery({
    queryKey: ['admin-expenses', selectedPeriod],
    queryFn: async () => {
      // Simular despesas até criar tabela de expenses
      const mockExpenses = [
        { id: 1, description: 'Hospedagem AWS', amount: 45.50, category: 'infraestrutura', date: new Date() },
        { id: 2, description: 'Stripe Fees', amount: 12.30, category: 'taxas', date: new Date() },
        { id: 3, description: 'Supabase Pro', amount: 25.00, category: 'saas', date: new Date() },
        { id: 4, description: 'Marketing Ads', amount: 150.00, category: 'marketing', date: new Date() }
      ];
      
      return {
        expenses: mockExpenses,
        total_expenses: mockExpenses.reduce((sum, exp) => sum + exp.amount, 0)
      };
    },
  });

  const addExpense = async () => {
    try {
      // Simular adição de despesa (implementar com tabela real no futuro)
      toast({
        title: "Despesa adicionada",
        description: `Despesa de €${newExpense.amount} foi registrada.`
      });
      
      setNewExpense({
        description: '',
        amount: '',
        category: '',
        date: format(new Date(), 'yyyy-MM-dd')
      });
      setIsExpenseModalOpen(false);
      refetchExpenses();
    } catch (error) {
      toast({
        title: "Erro ao adicionar despesa",
        description: "Não foi possível registrar a despesa.",
        variant: "destructive"
      });
    }
  };

  const totalRevenue = revenueData?.total_revenue || 0;
  const totalExpenses = expensesData?.total_expenses || 0;
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Módulo Financeiro</h1>
          <p className="text-gray-400">Controle completo das finanças da SENVIA</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === 7 ? "default" : "outline"}
            onClick={() => setSelectedPeriod(7)}
            className="text-sm"
          >
            7 dias
          </Button>
          <Button
            variant={selectedPeriod === 30 ? "default" : "outline"}
            onClick={() => setSelectedPeriod(30)}
            className="text-sm"
          >
            30 dias
          </Button>
          <Button
            variant={selectedPeriod === 90 ? "default" : "outline"}
            onClick={() => setSelectedPeriod(90)}
            className="text-sm"
          >
            90 dias
          </Button>
        </div>
      </div>

      {/* Resumo Financeiro */}
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
              €{totalRevenue.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">
              {selectedPeriod} dias
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Despesas Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              €{totalExpenses.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">
              {selectedPeriod} dias
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Euro className="h-4 w-4 text-blue-500" />
              Lucro Líquido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
              €{netProfit.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">
              receita - despesas
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-500" />
              Margem de Lucro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {profitMargin.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400">
              margem líquida
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
              Receitas por Produto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Landing Pages</div>
                <div className="text-sm text-gray-400">Valor variável</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-500">
                  €{revenueData?.landing_pages.revenue?.toFixed(2) || '0.00'}
                </div>
                <div className="text-xs text-gray-400">
                  {revenueData?.landing_pages.count || 0} vendas
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
                  €{revenueData?.senvia_assistant.revenue?.toFixed(2) || '0.00'}
                </div>
                <div className="text-xs text-gray-400">
                  {revenueData?.senvia_assistant.count || 0} assinaturas
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-senvia-500" />
                Despesas por Categoria
              </CardTitle>
              <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-senvia-500 hover:bg-senvia-400 text-black">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Nova Despesa</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Descrição</label>
                      <Input
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                        className="bg-gray-700 border-gray-600"
                        placeholder="Ex: Hospedagem AWS"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300">Valor (€)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                        className="bg-gray-700 border-gray-600"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300">Categoria</label>
                      <Select value={newExpense.category} onValueChange={(value) => setNewExpense({...newExpense, category: value})}>
                        <SelectTrigger className="bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Selecionar categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="taxas">Taxas</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300">Data</label>
                      <Input
                        type="date"
                        value={newExpense.date}
                        onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <Button onClick={addExpense} className="w-full bg-senvia-500 hover:bg-senvia-400 text-black">
                      Adicionar Despesa
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {expensesData?.expenses?.map((expense) => (
              <div key={expense.id} className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm">{expense.description}</div>
                  <div className="text-xs text-gray-400 capitalize">{expense.category}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-500">€{expense.amount.toFixed(2)}</div>
                  <div className="text-xs text-gray-400">
                    {format(new Date(expense.date), 'dd/MM', { locale: ptBR })}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Transações Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Receitas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenueData?.landing_pages.transactions?.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                  <div>
                    <div className="font-medium text-sm">Landing Page</div>
                    <div className="text-xs text-gray-400">{transaction.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-500">€{(transaction.amount / 100).toFixed(2)}</div>
                    <div className="text-xs text-gray-400">
                      {format(new Date(transaction.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                    </div>
                  </div>
                </div>
              ))}
              
              {revenueData?.senvia_assistant.subscriptions?.slice(0, 3).map((subscription) => (
                <div key={subscription.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                  <div>
                    <div className="font-medium text-sm">Senvia Assistant</div>
                    <div className="text-xs text-gray-400">{subscription.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-purple-500">€20.00</div>
                    <div className="text-xs text-gray-400">
                      {format(new Date(subscription.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Balanço Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Receita Total:</span>
                <span className="font-bold text-green-500">€{totalRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Despesas Total:</span>
                <span className="font-bold text-red-500">€{totalExpenses.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-600 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Lucro Líquido:</span>
                  <span className={`font-bold text-lg ${netProfit >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
                    €{netProfit.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Margem de Lucro:</span>
                <span className="font-bold text-purple-500">{profitMargin.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminFinanceiro;
