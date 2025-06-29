
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AdminRecentLeadsProps {
  recentActivity: any;
}

const AdminRecentLeads = ({ recentActivity }: AdminRecentLeadsProps) => {
  return (
    <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm w-full min-w-0">
      <CardHeader className="pb-2 lg:pb-3">
        <CardTitle className="text-base lg:text-lg text-white">Leads Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-3 lg:p-6 pt-0">
        <div className="space-y-3">
          {recentActivity?.leads?.map((lead: any, index: number) => (
            <div key={`${lead.id}-${index}`} className="border-b border-slate-700/50 last:border-0 pb-3 last:pb-0">
              {/* Mobile Layout - Stacked */}
              <div className="space-y-2">
                {/* Name and Email */}
                <div className="min-w-0">
                  <div className="font-medium text-white text-sm truncate">
                    {lead.name}
                  </div>
                  <div className="text-xs text-slate-400 truncate">
                    {lead.email_contact}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 truncate">
                    {lead.source}
                  </div>
                </div>
                
                {/* Badges and Date - Organized Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Badge 
                      variant={lead.lead_type === 'premium' ? 'secondary' : 'default'}
                      className="text-xs px-2 py-0.5 flex-shrink-0 bg-blue-500/20 text-blue-400 border-blue-500/50"
                    >
                      {lead.lead_type === 'premium' ? 'Premium' : '€4.99'}
                    </Badge>
                    <Badge 
                      className={`text-xs px-2 py-0.5 flex-shrink-0 whitespace-nowrap ${
                        lead.is_paid 
                          ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                          : 'bg-red-500/20 text-red-400 border-red-500/50'
                      }`}
                    >
                      {lead.is_paid ? 'Pago ✓' : 'Não Pago'}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-400 flex-shrink-0">
                    {format(new Date(lead.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {(!recentActivity?.leads || recentActivity.leads.length === 0) && (
            <div className="text-center text-slate-400 py-6">
              <p className="text-sm">Nenhum lead recente</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRecentLeads;
