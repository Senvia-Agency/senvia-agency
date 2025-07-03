import { useState } from "react";
import { useRealFinancialData } from "@/hooks/useRealFinancialData";
import { useFinancialMovements } from "@/hooks/useFinancialMovements";
import { useAccountsReceivable, useAccountsReceivableStats } from "@/hooks/useAccountsReceivable";
import { useGenerateRecurringReceivables } from "@/hooks/useRecurringServices";
import AddMovementModal from "./AddMovementModal";
import FinancialKPICards from "./financeiro/FinancialKPICards";
import AccountsReceivableKPICards from "./financeiro/AccountsReceivableKPICards";
import RecurringServicesKPICards from "./financeiro/RecurringServicesKPICards";
import RevenueBreakdownCard from "./financeiro/RevenueBreakdownCard";
import FinancialMovementsCard from "./financeiro/FinancialMovementsCard";
import RecentTransactionsCard from "./financeiro/RecentTransactionsCard";
import BalanceSummaryCard from "./financeiro/BalanceSummaryCard";
import AccountsReceivableList from "./financeiro/AccountsReceivableList";
import RecurringReceivablesList from "./financeiro/RecurringReceivablesList";
import ReceivablesEvolutionChart from "./financeiro/ReceivablesEvolutionChart";
import PeriodSelector from "./financeiro/PeriodSelector";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const AdminFinanceiro = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);

  const { data: financialData, isLoading: isLoadingFinancial } = useRealFinancialData(selectedPeriod);
  const { movements, addMovement, isAddingMovement, updateMovement, isUpdatingMovement } = useFinancialMovements(selectedPeriod);
  const { data: accountsReceivable, isLoading: isLoadingAccounts } = useAccountsReceivable(selectedPeriod);
  const accountsStats = useAccountsReceivableStats(accountsReceivable || []);
  const generateRecurring = useGenerateRecurringReceivables();

  const totalRevenue = financialData?.total_revenue || 0;
  const totalExpenses = financialData?.total_expenses || 0;
  const netProfit = financialData?.net_profit || 0;
  const profitMargin = financialData?.profit_margin || 0;

  const handleAddMovement = (movement: any) => {
    addMovement(movement);
  };

  const handleUpdateMovement = (id: string, updates: any) => {
    updateMovement({ id, updates });
  };

  const handleMarkAsPaid = (accountId: string) => {
    console.log('Marcando como pago:', accountId);
  };

  const handleGenerateRecurring = async () => {
    await generateRecurring.mutateAsync();
  };

  if (isLoadingFinancial || isLoadingAccounts) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold whitespace-nowrap">Módulo Financeiro</h1>
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
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 whitespace-nowrap">Módulo Financeiro</h1>
          <p className="text-gray-400 text-sm sm:text-base">Controle completo das finanças da SENVIA</p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button 
              onClick={handleGenerateRecurring}
              disabled={generateRecurring.isPending}
              variant="outline"
              className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RefreshCw className="h-4 w-4" />
              {generateRecurring.isPending ? "Gerando..." : "Gerar Contas Recorrentes"}
            </Button>
          </div>
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>
      </div>

      {/* KPI Cards Financeiros */}
      <FinancialKPICards
        totalRevenue={totalRevenue}
        totalExpenses={totalExpenses}
        netProfit={netProfit}
        profitMargin={profitMargin}
        selectedPeriod={selectedPeriod}
      />

      {/* KPI Cards Serviços Recorrentes */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Serviços Recorrentes</h2>
        <RecurringServicesKPICards />
      </div>

      {/* KPI Cards Contas a Receber */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Contas a Receber</h2>
        <AccountsReceivableKPICards stats={accountsStats} />
      </div>

      {/* Listas de Contas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecurringReceivablesList />
        <AccountsReceivableList 
          accounts={accountsReceivable || []} 
          onMarkAsPaid={handleMarkAsPaid}
        />
      </div>

      {/* Revenue Breakdown and Financial Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueBreakdownCard financialData={financialData} />
        <FinancialMovementsCard
          movements={movements}
          onAddMovement={() => setIsMovementModalOpen(true)}
          onUpdateMovement={handleUpdateMovement}
          isUpdating={isUpdatingMovement}
        />
      </div>

      {/* Recent Transactions and Balance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactionsCard financialData={financialData} />
        <BalanceSummaryCard
          totalRevenue={totalRevenue}
          totalExpenses={totalExpenses}
          netProfit={netProfit}
          profitMargin={profitMargin}
          selectedPeriod={selectedPeriod}
        />
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
