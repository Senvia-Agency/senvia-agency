
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
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Leads Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentActivity?.leads?.map((lead: any, index: number) => (
            <div key={`${lead.id}-${index}`} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-700 last:border-0 gap-2 sm:gap-0">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-base truncate">
                  {lead.name}
                </div>
                <div className="text-sm text-gray-400 truncate">
                  {lead.email_contact}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {lead.source}
                </div>
              </div>
              <div className="flex sm:flex-col sm:text-right items-start sm:items-end gap-2 sm:gap-1">
                <div className="flex flex-wrap gap-1">
                  <Badge 
                    variant={lead.lead_type === 'premium' ? 'secondary' : 'default'}
                    className="text-xs whitespace-nowrap"
                  >
                    {lead.lead_type === 'premium' ? 'Premium' : '€4.99'}
                  </Badge>
                  <Badge 
                    variant={lead.is_paid ? 'default' : 'destructive'}
                    className={`text-xs whitespace-nowrap ${lead.is_paid ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
                  >
                    {lead.is_paid ? 'Pago ✓' : 'Não Pago'}
                  </Badge>
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {format(new Date(lead.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                </div>
              </div>
            </div>
          ))}
          {(!recentActivity?.leads || recentActivity.leads.length === 0) && (
            <div className="text-center text-gray-400 py-6 text-sm">
              Nenhum lead recente
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRecentLeads;
