
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Euro,
  CreditCard,
  Receipt,
  Target,
  ArrowUpDown
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRealFinancialData } from "@/hooks/useRealFinancialData";
import { useFinancialMovements } from "@/hooks/useFinancialMovements";
import AddMovementModal from "./AddMovementModal";

const AdminFinanceiro = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);

  const { data: financialData, isLoading: isLoadingFinancial } = useRealFinancialData(selectedPeriod);
  const { movements, addMovement, isAddingMovement } = useFinancialMovements(selectedPeriod);

  const totalRevenue = financialData?.total_revenue || 0;
  const totalExpenses = financialData?.total_expenses || 0;
  const netProfit = financialData?.net_profit || 0;
  const profitMargin = financialData?.profit_margin || 0;

  const handleAddMovement = (movement: any) => {
    addMovement(movement);
  };

  if (isLoadingFinancial) {
    return (
      <div className="space-y-6">
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
                  €{financialData?.landing_pages.revenue?.toFixed(2) || '0.00'}
                </div>
                <div className="text-xs text-gray-400">
                  {financialData?.landing_pages.count || 0} vendas
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
                  €{financialData?.senvia_assistant.revenue?.toFixed(2) || '0.00'}
                </div>
                <div className="text-xs text-gray-400">
                  {financialData?.senvia_assistant.count || 0} assinaturas
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Outros Movimentos</div>
                <div className="text-sm text-gray-400">Receitas adicionais</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-orange-500">
                  €{financialData?.financial_movements.revenue?.toFixed(2) || '0.00'}
                </div>
                <div className="text-xs text-gray-400">
                  movimentos manuais
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5 text-senvia-500" />
                Movimentos Financeiros
              </CardTitle>
              <Button 
                size="sm" 
                className="bg-senvia-500 hover:bg-senvia-400 text-black"
                onClick={() => setIsMovementModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {movements.slice(0, 5).map((movement) => (
              <div key={movement.id} className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm">{movement.description}</div>
                  <div className="text-xs text-gray-400 capitalize">
                    {movement.category.replace('_', ' ')} • {movement.movement_type}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${movement.movement_type === 'receita' ? 'text-green-500' : 'text-red-500'}`}>
                    {movement.movement_type === 'receita' ? '+' : '-'}€{Number(movement.amount).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {format(new Date(movement.movement_date), 'dd/MM', { locale: ptBR })}
                  </div>
                </div>
              </div>
            ))}
            {movements.length === 0 && (
              <div className="text-center text-gray-400 py-4">
                Nenhum movimento registrado
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transações Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Receitas Automáticas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {financialData?.landing_pages.transactions?.slice(0, 3).map((transaction: any) => (
                <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                  <div>
                    <div className="font-medium text-sm">Landing Page</div>
                    <div className="text-xs text-gray-400">{transaction.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-500">
                      €{transaction.amount ? (Number(transaction.amount) / (transaction.amount > 100 ? 100 : 1)).toFixed(2) : '0.00'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {format(new Date(transaction.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                    </div>
                  </div>
                </div>
              ))}
              
              {financialData?.senvia_assistant.subscriptions?.slice(0, 2).map((subscription: any) => (
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
            <CardTitle>Balanço Atual</CardTitle>
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
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Período de Análise:</span>
                <span className="font-bold text-senvia-500">{selectedPeriod} dias</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddMovementModal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        onSubmit={handleAddMovement}
        isLoading={isAddingMovement}
      />
    </div>
  );
};

export default AdminFinanceiro;
