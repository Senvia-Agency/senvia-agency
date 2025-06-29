
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
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Users className="h-4 w-4 sm:h-5 sm:w-5 text-senvia-500" />
          <span className="truncate">Breakdown de Leads</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm sm:text-base">Landing Page €4.99</div>
            <div className="text-xs sm:text-sm text-gray-400">{basicLeads} leads totais</div>
          </div>
          <div className="flex flex-row sm:flex-col items-start sm:items-end sm:text-right gap-2 sm:gap-1">
            <div className="font-bold text-green-500 text-sm sm:text-base">
              {basicPaid} convertidos
            </div>
            <div className="text-xs text-gray-400 whitespace-nowrap">
              {basicLeads > 0 ? ((basicPaid / basicLeads) * 100).toFixed(1) : '0.0'}%
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm sm:text-base">Landing Page Premium</div>
            <div className="text-xs sm:text-sm text-gray-400">{premiumLeads} leads totais</div>
          </div>
          <div className="flex flex-row sm:flex-col items-start sm:items-end sm:text-right gap-2 sm:gap-1">
            <div className="font-bold text-blue-500 text-sm sm:text-base">
              {premiumPaid} convertidos
            </div>
            <div className="text-xs text-gray-400 whitespace-nowrap">
              {premiumLeads > 0 ? ((premiumPaid / premiumLeads) * 100).toFixed(1) : '0.0'}%
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
            <div className="font-medium text-sm sm:text-base">Taxa Geral de Conversão</div>
            <div className="font-bold text-senvia-500 text-sm sm:text-base">
              {conversionRate.toFixed(1)}%
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {basicPaid + premiumPaid} convertidos de {totalLeads} leads
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminLeadsBreakdown;
