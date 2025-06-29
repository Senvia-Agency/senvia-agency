
import { Euro, Users, TrendingUp, CreditCard } from "lucide-react";
import MobileKPICard from "./MobileKPICard";

interface MobileAdminKPIsProps {
  revenueMetrics: any;
  leadsStats: any;
  subscriptions: any;
}

const MobileAdminKPIs = ({ revenueMetrics, leadsStats, subscriptions }: MobileAdminKPIsProps) => {
  const totalRevenue = revenueMetrics?.total_revenue || 0;
  const totalLeads = leadsStats?.total_leads || 0;
  const conversionRate = leadsStats?.conversion_rate || 0;
  const activeSubscriptions = subscriptions?.filter((sub: any) => sub.status === 'active')?.length || 0;

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <div className="w-full min-w-0">
          <MobileKPICard
            title="Receita Total"
            value={`€${totalRevenue.toFixed(2)}`}
            subtitle="30 dias"
            icon={Euro}
            color="green"
            trend={{
              value: 12.5,
              isPositive: true
            }}
          />
        </div>
        
        <div className="w-full min-w-0">
          <MobileKPICard
            title="Total Leads"
            value={totalLeads}
            subtitle="30 dias"
            icon={Users}
            color="blue"
            trend={{
              value: 8.2,
              isPositive: true
            }}
          />
        </div>
        
        <div className="w-full min-w-0 xs:col-span-1 lg:col-span-1">
          <MobileKPICard
            title="Conversão"
            value={`${conversionRate.toFixed(1)}%`}
            subtitle="Taxa geral"
            icon={TrendingUp}
            color="orange"
            trend={{
              value: -2.1,
              isPositive: false
            }}
          />
        </div>
        
        <div className="w-full min-w-0 xs:col-span-1 lg:col-span-1">
          <MobileKPICard
            title="Assinaturas"
            value={activeSubscriptions}
            subtitle="Ativas"
            icon={CreditCard}
            color="purple"
            trend={{
              value: 5.7,
              isPositive: true
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileAdminKPIs;
