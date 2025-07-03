
import AdminKPICards from './AdminKPICards';
import AdminRevenueBreakdown from './AdminRevenueBreakdown';
import AdminLeadsBreakdown from './AdminLeadsBreakdown';
import AdminRecentLeads from './AdminRecentLeads';
import AdminRecentPayments from './AdminRecentPayments';
import { useAdminRevenue } from '@/hooks/useAdminRevenue';
import { useAdminLeads } from '@/hooks/useAdminLeads';
import { useAdminSubscriptions } from '@/hooks/useAdminSubscriptions';
import { useAdminActivity } from '@/hooks/useAdminActivity';

const AdminOverview = () => {
  const { data: revenueMetrics } = useAdminRevenue(30);
  const { data: leadsStats } = useAdminLeads(30);
  const { data: subscriptions } = useAdminSubscriptions();
  const { data: recentActivity } = useAdminActivity();

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Visão Geral</h1>
        <p className="text-gray-400 text-sm sm:text-base">Dashboard principal do sistema administrativo da SENVIA</p>
      </div>

      {/* KPI Cards */}
      <AdminKPICards 
        revenueMetrics={revenueMetrics} 
        leadsStats={leadsStats} 
        subscriptions={subscriptions || []} 
      />

      {/* Revenue Breakdown */}
      <AdminRevenueBreakdown revenueMetrics={revenueMetrics} />

      {/* Leads Breakdown */}
      <AdminLeadsBreakdown leadsStats={leadsStats} />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminRecentLeads recentActivity={recentActivity} />
        <AdminRecentPayments recentActivity={recentActivity} />
      </div>
    </div>
  );
};

export default AdminOverview;
