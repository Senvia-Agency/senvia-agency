import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingDown, TrendingUp, Percent, AlertTriangle, Repeat, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FinancialAllKPICardsProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  periodDescription: string;
  totalReceivable: number;
  totalOverdue: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  monthlyBalance: number;
  activeRevenueServices: number;
  activeExpenseServices: number;
  totalPaidAmount: number;
  totalInvoicedAmount: number;
  activeFilter?: 'all' | 'receita' | 'despesa' | 'receivables' | 'overdue';
  onFilterChange?: (filter: 'all' | 'receita' | 'despesa' | 'receivables' | 'overdue') => void;
}

const FinancialAllKPICards = ({
  totalRevenue,
  totalExpenses,
  netProfit,
  profitMargin,
  periodDescription,
  totalReceivable,
  totalOverdue,
  monthlyRevenue,
  monthlyExpenses,
  monthlyBalance,
  activeRevenueServices,
  activeExpenseServices,
  totalPaidAmount,
  totalInvoicedAmount,
  activeFilter = 'all',
  onFilterChange,
}: FinancialAllKPICardsProps) => {
  
  const handleKPIClick = (filter: 'receita' | 'despesa' | 'receivables' | 'overdue') => {
    if (!onFilterChange) return;
    // Toggle: se já está ativo, volta para 'all'
    onFilterChange(activeFilter === filter ? 'all' : filter);
  };
  const receivingRate = totalInvoicedAmount > 0
    ? ((totalPaidAmount / totalInvoicedAmount) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {/* Linha 1: Métricas do Período */}
      
      {/* 1. Receita Total - CLICÁVEL */}
      <Card 
        className={`bg-card border-border transition-all cursor-pointer ${
          activeFilter === 'receita' 
            ? 'ring-2 ring-green-500 shadow-lg shadow-green-500/20' 
            : 'hover:shadow-lg hover:ring-1 hover:ring-green-500/50'
        }`}
        onClick={() => handleKPIClick('receita')}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className={`h-4 w-4 ${activeFilter === 'receita' ? 'text-green-400' : 'text-green-500'}`} />
            Receita Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            €{totalRevenue.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {periodDescription}
          </div>
        </CardContent>
      </Card>

      {/* 2. Despesas Total - CLICÁVEL */}
      <Card 
        className={`bg-card border-border transition-all cursor-pointer ${
          activeFilter === 'despesa' 
            ? 'ring-2 ring-red-500 shadow-lg shadow-red-500/20' 
            : 'hover:shadow-lg hover:ring-1 hover:ring-red-500/50'
        }`}
        onClick={() => handleKPIClick('despesa')}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingDown className={`h-4 w-4 ${activeFilter === 'despesa' ? 'text-red-400' : 'text-red-500'}`} />
            Despesas Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            €{totalExpenses.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {periodDescription}
          </div>
        </CardContent>
      </Card>

      {/* 3. Lucro Líquido */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-500" />
            Lucro Líquido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
            €{netProfit.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Receitas - Despesas
          </div>
        </CardContent>
      </Card>

      {/* 4. Margem de Lucro */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Percent className="h-4 w-4 text-purple-500" />
            Margem de Lucro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-500">
            {profitMargin.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Lucratividade do período
          </div>
        </CardContent>
      </Card>

      {/* 5. Taxa de Recebimento (NOVO) */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Percent className="h-4 w-4 text-cyan-500" />
            Taxa de Recebimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cyan-500">
            {receivingRate.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            €{totalPaidAmount.toFixed(2)} de €{totalInvoicedAmount.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      {/* Linha 2: Métricas de Recebíveis e Recorrentes */}

      {/* 6. Total a Receber - CLICÁVEL */}
      <Card 
        className={`bg-card border-border transition-all cursor-pointer ${
          activeFilter === 'receivables' 
            ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' 
            : 'hover:shadow-lg hover:ring-1 hover:ring-blue-500/50'
        }`}
        onClick={() => handleKPIClick('receivables')}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <DollarSign className={`h-4 w-4 ${activeFilter === 'receivables' ? 'text-blue-400' : 'text-yellow-500'}`} />
            Total a Receber
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-500">
            €{totalReceivable.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Pendentes + Em Atraso
          </div>
        </CardContent>
      </Card>

      {/* 7. Em Atraso - CLICÁVEL */}
      <Card 
        className={`bg-card border-border transition-all cursor-pointer ${
          activeFilter === 'overdue' 
            ? 'ring-2 ring-red-500 shadow-lg shadow-red-500/20' 
            : 'hover:shadow-lg hover:ring-1 hover:ring-red-500/50'
        }`}
        onClick={() => handleKPIClick('overdue')}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <AlertTriangle className={`h-4 w-4 ${activeFilter === 'overdue' ? 'text-red-400' : 'text-red-500'}`} />
            Em Atraso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            €{totalOverdue.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Contas Vencidas
          </div>
        </CardContent>
      </Card>

      {/* 8. Receitas Mensais */}
      <Link to="/admin/receitas-mensais" className="block">
        <Card className="bg-card border-border hover:border-muted-foreground/50 transition-colors cursor-pointer h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Receitas Mensais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              €{Number(monthlyRevenue).toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {activeRevenueServices} serviços ativos
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* 9. Despesas Mensais */}
      <Link to="/admin/despesas-mensais" className="block">
        <Card className="bg-card border-border hover:border-muted-foreground/50 transition-colors cursor-pointer h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Despesas Mensais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              €{Number(monthlyExpenses).toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {activeExpenseServices} despesas ativas
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* 10. Balanço Mensal */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Repeat className="h-4 w-4 text-blue-500" />
            Balanço Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${Number(monthlyBalance) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            €{Number(monthlyBalance).toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Receitas - Despesas
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialAllKPICards;
