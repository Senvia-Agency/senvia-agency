
import { useState } from "react";
import { useRealFinancialData } from "@/hooks/useRealFinancialData";
import { useFinancialMovements } from "@/hooks/useFinancialMovements";
import AddMovementModal from "./AddMovementModal";
import FinancialKPICards from "./financeiro/FinancialKPICards";
import RevenueBreakdownCard from "./financeiro/RevenueBreakdownCard";
import FinancialMovementsCard from "./financeiro/FinancialMovementsCard";
import RecentTransactionsCard from "./financeiro/RecentTransactionsCard";
import BalanceSummaryCard from "./financeiro/BalanceSummaryCard";
import PeriodSelector from "./financeiro/PeriodSelector";

const AdminFinanceiro = () => {
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
      <div className="space-y-4 lg:space-y-6 p-4 lg:p-6">
        <div className="text-center py-8 text-gray-400">
          Carregando dados financeiros...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6 p-4 lg:p-6 w-full max-w-full overflow-x-hidden">
      {/* Header - Mobile Optimized */}
      <div className="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl lg:text-3xl font-bold mb-1 lg:mb-2 truncate">Módulo Financeiro</h1>
          <p className="text-sm lg:text-base text-gray-400 truncate">Controle completo das finanças da SENVIA</p>
        </div>
        <div className="w-full lg:w-auto">
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <FinancialKPICards
        totalRevenue={totalRevenue}
        totalExpenses={totalExpenses}
        netProfit={netProfit}
        profitMargin={profitMargin}
        selectedPeriod={selectedPeriod}
      />

      {/* Revenue Breakdown and Financial Movements */}
      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
        <RevenueBreakdownCard financialData={financialData} />
        <FinancialMovementsCard
          movements={movements}
          onAddMovement={() => setIsMovementModalOpen(true)}
        />
      </div>

      {/* Recent Transactions and Balance Summary */}
      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
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
