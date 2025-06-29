
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface AdminLeadsBreakdownProps {
  leadsStats: any;
}

const AdminLeadsBreakdown = ({ leadsStats }: AdminLeadsBreakdownProps) => {
  console.log('AdminLeadsBreakdown - Dados recebidos:', leadsStats);

  const totalLeads = leadsStats?.total_leads || 0;
  const basicLeads = leadsStats?.landing_page_basic_leads || 0;
  const premiumLeads = leadsStats?.landing_page_premium_leads || 0;
  const basicPaid = leadsStats?.landing_page_basic_paid || 0;
  const premiumPaid = leadsStats?.landing_page_premium_paid || 0;
  const conversionRate = leadsStats?.conversion_rate || 0;

  return (
    <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm w-full min-w-0">
      <CardHeader className="pb-2 lg:pb-3">
        <CardTitle className="flex items-center gap-2 text-base lg:text-lg text-white">
          <Users className="h-4 w-4 lg:h-5 lg:w-5 text-senvia-500 flex-shrink-0" />
          <span className="truncate">Breakdown de Leads</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 lg:p-6 pt-0 space-y-2 lg:space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-slate-700/50 min-w-0 gap-2">
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm lg:text-base text-white truncate">
              Landing Page €4.99
            </div>
            <div className="text-xs lg:text-sm text-slate-400 truncate">
              {basicLeads} leads totais
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-bold text-green-400 text-sm lg:text-base">
              {basicPaid} convertidos
            </div>
            <div className="text-xs text-slate-400">
              {basicLeads > 0 ? ((basicPaid / basicLeads) * 100).toFixed(1) : '0.0'}%
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-slate-700/50 min-w-0 gap-2">
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm lg:text-base text-white truncate">
              Landing Page Premium
            </div>
            <div className="text-xs lg:text-sm text-slate-400 truncate">
              {premiumLeads} leads totais
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-bold text-blue-400 text-sm lg:text-base">
              {premiumPaid} convertidos
            </div>
            <div className="text-xs text-slate-400">
              {premiumLeads > 0 ? ((premiumPaid / premiumLeads) * 100).toFixed(1) : '0.0'}%
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/50">
          <div className="flex justify-between items-center min-w-0 gap-2">
            <div className="font-medium text-sm lg:text-base text-white truncate flex-1">
              Taxa Geral de Conversão
            </div>
            <div className="font-bold text-senvia-400 text-sm lg:text-base flex-shrink-0">
              {conversionRate.toFixed(1)}%
            </div>
          </div>
          <div className="text-xs text-slate-400 mt-1 truncate">
            {basicPaid + premiumPaid} convertidos de {totalLeads} leads
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminLeadsBreakdown;
