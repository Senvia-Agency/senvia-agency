
import { useState } from "react";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { useRealFinancialData } from "@/hooks/useRealFinancialData";
import { useUnifiedReceivables } from "@/hooks/useUnifiedReceivables";
import { useRecurringStats } from "@/hooks/useRecurringServices";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import FinancialAllKPICards from "./financeiro/FinancialAllKPICards";
import AllMovementsSection from "./financeiro/AllMovementsSection";

const AdminFinanceiro = () => {
  const [movementTypeFilter, setMovementTypeFilter] = useState<'all' | 'receita' | 'despesa' | 'receivables' | 'overdue' | 'monthly_revenues' | 'monthly_expenses'>('all');
  
  const { dateRange, setDateRange, getPeriodDescription } = useDateRangeFilter({
    defaultDays: 30,
    storageKey: 'admin-financeiro-date-range'
  });

  const periodDescription = getPeriodDescription();
  const { data: financialData, isLoading: isLoadingFinancial } = useRealFinancialData(dateRange);
  const { data: receivables } = useUnifiedReceivables();
  const { data: recurringStats } = useRecurringStats();

  const totalRevenue = financialData?.total_revenue || 0;
  const totalExpenses = financialData?.total_expenses || 0;
  const netProfit = financialData?.net_profit || 0;
  const profitMargin = financialData?.profit_margin || 0;
  const totalPaidAmount = financialData?.total_paid_amount || 0;

  // Calcular totais de recebíveis
  const totalReceivable = receivables
    ?.filter(r => r.payment_status === 'pending' || r.payment_status === 'partial')
    .reduce((sum, r) => sum + Number(r.remaining_amount || 0), 0) || 0;

  const totalOverdue = receivables
    ?.filter(r => r.days_overdue > 0)
    .reduce((sum, r) => sum + Number(r.remaining_amount || 0), 0) || 0;

  return (
    <div className={`space-y-6 p-6 overflow-y-auto pb-12 transition-opacity duration-200 ${isLoadingFinancial ? 'opacity-60' : 'opacity-100'}`}>
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

      {/* KPIs Completos - Grid 5x2 */}
      <FinancialAllKPICards
        totalRevenue={totalRevenue}
        totalExpenses={totalExpenses}
        netProfit={netProfit}
        profitMargin={profitMargin}
        periodDescription={periodDescription}
        totalReceivable={totalReceivable}
        totalOverdue={totalOverdue}
        monthlyRevenue={recurringStats?.total_monthly_revenue || 0}
        monthlyExpenses={recurringStats?.total_monthly_expenses || 0}
        monthlyBalance={recurringStats?.net_monthly_balance || 0}
        activeRevenueServices={recurringStats?.total_active_revenue_services || 0}
        activeExpenseServices={recurringStats?.total_active_expense_services || 0}
        totalPaidAmount={totalPaidAmount}
        totalInvoicedAmount={totalRevenue}
        activeFilter={movementTypeFilter}
        onFilterChange={setMovementTypeFilter}
      />

      {/* Registro Completo de Movimentações */}
      <AllMovementsSection 
        dateRange={dateRange} 
        setDateRange={setDateRange}
        typeFilter={movementTypeFilter}
        onClearFilter={() => setMovementTypeFilter('all')}
      />
    </div>
  );
};

export default AdminFinanceiro;
