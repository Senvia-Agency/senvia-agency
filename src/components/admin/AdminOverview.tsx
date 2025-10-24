import AdminKPICards from './AdminKPICards';
import AdminRevenueBreakdown from './AdminRevenueBreakdown';
import AdminExpiringSubscriptions from './AdminExpiringSubscriptions';
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useDateRangeFilter } from '@/hooks/useDateRangeFilter';
import { useAdminRevenue } from '@/hooks/useAdminRevenue';
import { useAdminLeads } from '@/hooks/useAdminLeads';
import { useAdminSubscriptions } from '@/hooks/useAdminSubscriptions';

const AdminOverview = () => {
  const { dateRange, setDateRange } = useDateRangeFilter({
    defaultDays: 30,
    storageKey: 'admin-overview-date-range'
  });
  
  const { data: revenueMetrics } = useAdminRevenue(dateRange);
  const { data: leadsStats } = useAdminLeads(dateRange);
  const { data: subscriptions } = useAdminSubscriptions();

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Visão Geral</h1>
          <p className="text-gray-400 text-sm sm:text-base">Dashboard principal do sistema administrativo da SENVIA</p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* KPI Cards */}
      <AdminKPICards 
        revenueMetrics={revenueMetrics} 
        leadsStats={leadsStats} 
        subscriptions={subscriptions || []} 
      />

      {/* Revenue Breakdown */}
      <AdminRevenueBreakdown revenueMetrics={revenueMetrics} />

      {/* Expiring Subscriptions */}
      <AdminExpiringSubscriptions subscriptions={subscriptions || []} />
    </div>
  );
};

export default AdminOverview;
