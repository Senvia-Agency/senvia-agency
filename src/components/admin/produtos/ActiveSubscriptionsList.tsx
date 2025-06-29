
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Zap } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ActiveSubscriptionsListProps {
  activeSubscriptions: any[];
}

const ActiveSubscriptionsList = ({ activeSubscriptions }: ActiveSubscriptionsListProps) => {
  return (
    <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm w-full overflow-hidden">
      <CardHeader className="p-4 lg:p-5">
        <CardTitle className="flex items-center gap-2 text-slate-100 text-base lg:text-lg">
          <Users className="h-5 w-5 text-senvia-500 flex-shrink-0" />
          <span className="truncate">
            Assinaturas Ativas ({activeSubscriptions?.length || 0})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 lg:p-5 pt-0">
        <div className="space-y-4">
          {activeSubscriptions?.slice(0, 10).map((subscription) => (
            <div key={subscription.id} className="p-4 bg-slate-700/70 rounded-lg border border-slate-600/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Zap className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-slate-100 text-base truncate">
                      {subscription.email}
                    </div>
                    <div className="text-sm text-slate-400 truncate">
                      {subscription.plan_type} - €{subscription.monthly_price || 20}/mês
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                  <Badge 
                    variant={subscription.status === 'active' ? 'default' : 'secondary'}
                    className={`${subscription.status === 'trial' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : ''} text-xs`}
                  >
                    {subscription.status === 'trial' ? 'Trial' : subscription.status}
                  </Badge>
                  <div className="text-right">
                    <div className="text-sm text-slate-300">
                      {format(new Date(subscription.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                    {subscription.trial_end_date && subscription.status === 'trial' && (
                      <div className="text-xs text-yellow-400">
                        Trial até {format(new Date(subscription.trial_end_date), 'dd/MM', { locale: ptBR })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {(!activeSubscriptions || activeSubscriptions.length === 0) && (
            <div className="text-center py-8 text-slate-400">
              <Users className="h-12 w-12 mx-auto mb-4 text-slate-600" />
              <p className="text-sm">Nenhuma assinatura ativa encontrada</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveSubscriptionsList;
