
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
            <div className="font-medium">Leads Pagos</div>
            <div className="text-sm text-gray-400">Compraram landing page</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-blue-500">
              {leadsStats?.paid_leads || 0}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Leads Orgânicos</div>
            <div className="text-sm text-gray-400">Cadastros gratuitos</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-green-500">
              {leadsStats?.organic_leads || 0}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div className="font-medium">Total de Conversões</div>
            <div className="font-bold text-orange-500">
              {leadsStats?.total_conversions || 0}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminLeadsBreakdown;
