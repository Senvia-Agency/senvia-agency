
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AdminRecentLeadsProps {
  recentActivity: any;
}

const AdminRecentLeads = ({ recentActivity }: AdminRecentLeadsProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle>Leads Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentActivity?.leads?.map((lead: any, index: number) => (
            <div key={`${lead.id}-${index}`} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
              <div>
                <div className="font-medium">
                  {lead.name}
                </div>
                <div className="text-sm text-gray-400">
                  {lead.email_contact}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {lead.source}
                </div>
              </div>
              <div className="text-right">
                <div className="flex flex-col gap-1">
                  <Badge 
                    variant={lead.lead_type === 'premium' ? 'secondary' : 'default'}
                    className="text-xs"
                  >
                    {lead.lead_type === 'premium' ? 'Premium' : '€4.99'}
                  </Badge>
                  <Badge 
                    variant={lead.is_paid ? 'default' : 'destructive'}
                    className={`text-xs ${lead.is_paid ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
                  >
                    {lead.is_paid ? 'Pago ✓' : 'Não Pago'}
                  </Badge>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {format(new Date(lead.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                </div>
              </div>
            </div>
          ))}
          {(!recentActivity?.leads || recentActivity.leads.length === 0) && (
            <div className="text-center text-gray-400 py-4">
              Nenhum lead recente
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRecentLeads;
