
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { useRealFinancialData } from "@/hooks/useRealFinancialData";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import FinancialKPICards from "./financeiro/FinancialKPICards";
import FinancialReceivablesKPIs from "./financeiro/FinancialReceivablesKPIs";
import RecurringMonthlyKPIs from "./financeiro/RecurringMonthlyKPIs";
import AllMovementsSection from "./financeiro/AllMovementsSection";

const AdminFinanceiro = () => {
  const { dateRange, setDateRange, getDaysInRange } = useDateRangeFilter({
    defaultDays: 30,
    storageKey: 'admin-financeiro-date-range'
  });

  const selectedPeriod = getDaysInRange();
  const { data: financialData, isLoading: isLoadingFinancial } = useRealFinancialData(dateRange);

  const totalRevenue = financialData?.total_revenue || 0;
  const totalExpenses = financialData?.total_expenses || 0;
  const netProfit = financialData?.net_profit || 0;
  const profitMargin = financialData?.profit_margin || 0;

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
    <div className="space-y-6 p-6 overflow-y-auto pb-12">
      {/* Header com Filtro de Data */}
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Módulo Financeiro</h1>
          <p className="text-gray-400 text-sm sm:text-base">Controle completo das finanças da SENVIA</p>
        </div>
        <div className="flex justify-end items-center">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
      </div>

      {/* KPIs Principais (afetados pelo período) */}
      <FinancialKPICards
        totalRevenue={totalRevenue}
        totalExpenses={totalExpenses}
        netProfit={netProfit}
        profitMargin={profitMargin}
        selectedPeriod={selectedPeriod}
      />

      {/* Contas a Receber (SEM filtro de período) */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Contas a Receber</h2>
        <FinancialReceivablesKPIs />
      </div>

      {/* Recorrência Mensal (valores fixos) */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Recorrência Mensal</h2>
        <RecurringMonthlyKPIs />
      </div>

      {/* Registro Completo de Movimentações */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Registro de Movimentações</h2>
        <AllMovementsSection dateRange={dateRange} />
      </div>
    </div>
  );
};

export default AdminFinanceiro;
