
import { useState } from "react";
import { useRealFinancialData } from "@/hooks/useRealFinancialData";
import { useFinancialMovements } from "@/hooks/useFinancialMovements";
import { useAccountsReceivableStats } from "@/hooks/useAccountsReceivable";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import AddMovementModal from "./AddMovementModal";
import FinancialKPICards from "./financeiro/FinancialKPICards";
import AccountsReceivableKPICards from "./financeiro/AccountsReceivableKPICards";
import FinancialMovementsCard from "./financeiro/FinancialMovementsCard";

const AdminFinanceiro = () => {
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const { dateRange, setDateRange, getDaysInRange } = useDateRangeFilter({
    defaultDays: 30,
    storageKey: 'admin-financeiro-date-range'
  });

  const selectedPeriod = dateRange ? getDaysInRange() : null;
  const { data: financialData, isLoading: isLoadingFinancial } = useRealFinancialData(selectedPeriod);
  const { movements, addMovement, isAddingMovement, updateMovement, isUpdatingMovement } = useFinancialMovements(selectedPeriod);

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

  if (isLoadingFinancial) {
    return (
      <div className="space-y-6 p-6 h-screen overflow-hidden">
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
    <div className="space-y-6 p-6 h-screen overflow-hidden">
      {/* Header */}
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 whitespace-nowrap">Módulo Financeiro</h1>
          <p className="text-gray-400 text-sm sm:text-base">Controle completo das finanças da SENVIA</p>
        </div>
        <div className="flex justify-end items-center">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
      </div>

      {/* KPI Cards Financeiros */}
      <FinancialKPICards
        totalRevenue={totalRevenue}
        totalExpenses={totalExpenses}
        netProfit={netProfit}
        profitMargin={profitMargin}
        selectedPeriod={selectedPeriod || 0}
      />

      {/* KPI Cards Contas a Receber */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Contas a Receber</h2>
        <AccountsReceivableKPICards stats={null} />
      </div>

      {/* Financial Movements */}
      <div className="grid grid-cols-1 gap-4 flex-1 min-h-0">
        <FinancialMovementsCard
          movements={movements}
          onAddMovement={() => setIsMovementModalOpen(true)}
          onUpdateMovement={handleUpdateMovement}
          isUpdating={isUpdatingMovement}
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
