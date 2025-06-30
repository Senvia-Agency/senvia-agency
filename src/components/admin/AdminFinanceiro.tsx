import { useState } from "react";
import FinancialKPICards from "./financeiro/FinancialKPICards";
import RevenueBreakdownCard from "./financeiro/RevenueBreakdownCard";
import BalanceSummaryCard from "./financeiro/BalanceSummaryCard";
import RecentTransactionsCard from "./financeiro/RecentTransactionsCard";
import FinancialMovementsCard from "./financeiro/FinancialMovementsCard";
import PeriodSelector from "./financeiro/PeriodSelector";

const AdminFinanceiro = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  return (
    <div className="space-y-4 md:space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight break-words">
            Módulo<br className="sm:hidden" /> Financeiro
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-1 break-words">
            Controle completo das<br className="sm:hidden" /> suas finanças
          </p>
        </div>
        <div className="w-full sm:w-auto flex-shrink-0">
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>
      </div>

      {/* Financial KPI Cards */}
      <FinancialKPICards selectedPeriod={selectedPeriod} />

      {/* Revenue Breakdown Card */}
      <RevenueBreakdownCard selectedPeriod={selectedPeriod} />

      {/* Balance Summary Card */}
      <BalanceSummaryCard selectedPeriod={selectedPeriod} />

      {/* Recent Transactions Card */}
      <RecentTransactionsCard selectedPeriod={selectedPeriod} />

      {/* Financial Movements Card */}
      <FinancialMovementsCard selectedPeriod={selectedPeriod} />
    </div>
  );
};

export default AdminFinanceiro;
