import { useState } from 'react';
import AdminKPICards from './AdminKPICards';
import AdminRevenueBreakdown from './AdminRevenueBreakdown';
import AdminExpiringSubscriptions from './AdminExpiringSubscriptions';
import PeriodSelector from './financeiro/PeriodSelector';
import { useAdminRevenue } from '@/hooks/useAdminRevenue';
import { useAdminLeads } from '@/hooks/useAdminLeads';
import { useAdminSubscriptions } from '@/hooks/useAdminSubscriptions';

const AdminOverview = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(0); // 0 = Tudo
  const { data: revenueMetrics } = useAdminRevenue(selectedPeriod);
  const { data: leadsStats } = useAdminLeads(selectedPeriod);
  const { data: subscriptions } = useAdminSubscriptions();

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Visão Geral</h1>
          <p className="text-gray-400 text-sm sm:text-base">Dashboard principal do sistema administrativo da SENVIA</p>
        </div>
        <PeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
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
