
import AdminKPICards from './AdminKPICards';
import AdminRevenueBreakdown from './AdminRevenueBreakdown';
import AdminLeadsBreakdown from './AdminLeadsBreakdown';
import AdminRecentLeads from './AdminRecentLeads';
import AdminRecentPayments from './AdminRecentPayments';

const AdminOverview = () => {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Visão Geral</h1>
        <p className="text-gray-400 text-sm sm:text-base">Dashboard principal do sistema administrativo da SENVIA</p>
      </div>

      {/* KPI Cards */}
      <AdminKPICards />

      {/* Revenue Breakdown */}
      <AdminRevenueBreakdown />

      {/* Leads Breakdown */}
      <AdminLeadsBreakdown />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminRecentLeads />
        <AdminRecentPayments />
      </div>
    </div>
  );
};

export default AdminOverview;
