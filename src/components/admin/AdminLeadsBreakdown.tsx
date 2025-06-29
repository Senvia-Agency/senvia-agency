
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-senvia-500" />
          Breakdown de Leads
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Landing Page €4.99</div>
            <div className="text-sm text-gray-400">{basicLeads} leads totais</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-green-500">
              {basicPaid} convertidos
            </div>
            <div className="text-xs text-gray-400">
              {basicLeads > 0 ? ((basicPaid / basicLeads) * 100).toFixed(1) : '0.0'}%
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Landing Page Premium</div>
            <div className="text-sm text-gray-400">{premiumLeads} leads totais</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-blue-500">
              {premiumPaid} convertidos
            </div>
            <div className="text-xs text-gray-400">
              {premiumLeads > 0 ? ((premiumPaid / premiumLeads) * 100).toFixed(1) : '0.0'}%
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div className="font-medium">Taxa Geral de Conversão</div>
            <div className="font-bold text-senvia-500">
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
