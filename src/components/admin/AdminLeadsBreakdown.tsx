
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
    <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base lg:text-lg text-white">
          <Users className="h-4 w-4 lg:h-5 lg:w-5 text-senvia-500" />
          Breakdown de Leads
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 lg:p-6 pt-0 space-y-3 lg:space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
          <div>
            <div className="font-medium text-sm lg:text-base text-white">Landing Page €4.99</div>
            <div className="text-xs lg:text-sm text-slate-400">{basicLeads} leads totais</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-green-400 text-sm lg:text-base">
              {basicPaid} convertidos
            </div>
            <div className="text-xs text-slate-400">
              {basicLeads > 0 ? ((basicPaid / basicLeads) * 100).toFixed(1) : '0.0'}%
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
          <div>
            <div className="font-medium text-sm lg:text-base text-white">Landing Page Premium</div>
            <div className="text-xs lg:text-sm text-slate-400">{premiumLeads} leads totais</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-blue-400 text-sm lg:text-base">
              {premiumPaid} convertidos
            </div>
            <div className="text-xs text-slate-400">
              {premiumLeads > 0 ? ((premiumPaid / premiumLeads) * 100).toFixed(1) : '0.0'}%
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/50">
          <div className="flex justify-between items-center">
            <div className="font-medium text-sm lg:text-base text-white">Taxa Geral de Conversão</div>
            <div className="font-bold text-senvia-400 text-sm lg:text-base">
              {conversionRate.toFixed(1)}%
            </div>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {basicPaid + premiumPaid} convertidos de {totalLeads} leads
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminLeadsBreakdown;
