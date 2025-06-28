
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface AdminLeadsBreakdownProps {
  leadsStats: any;
}

const AdminLeadsBreakdown = ({ leadsStats }: AdminLeadsBreakdownProps) => {
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
          </div>
          <div className="text-right">
            <div className="font-bold text-blue-500">
              {leadsStats?.landing_page_basic_leads || 0}
            </div>
            <div className="text-xs text-gray-400">
              {leadsStats?.landing_page_basic_paid || 0} pagos
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Landing Page Premium</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-purple-500">
              {leadsStats?.landing_page_premium_leads || 0}
            </div>
            <div className="text-xs text-gray-400">
              {leadsStats?.landing_page_premium_paid || 0} pagos
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div className="font-medium">Total de Leads</div>
            <div className="font-bold text-senvia-500">
              {leadsStats?.total_leads || 0}
            </div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className="text-sm text-gray-400">Conversões Confirmadas</div>
            <div className="font-bold text-orange-500">
              {leadsStats?.confirmed_conversions || 0}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminLeadsBreakdown;
