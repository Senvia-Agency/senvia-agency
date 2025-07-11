import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { format, addDays, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AdminExpiringSubscriptionsProps {
  subscriptions: any[];
}

const AdminExpiringSubscriptions = ({ subscriptions }: AdminExpiringSubscriptionsProps) => {
  const sevenDaysFromNow = addDays(new Date(), 7);
  
  const expiringSubscriptions = subscriptions?.filter(subscription => {
    if (!subscription.subscription_end_date) return false;
    const endDate = new Date(subscription.subscription_end_date);
    return isBefore(endDate, sevenDaysFromNow) && isBefore(new Date(), endDate);
  }) || [];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
          <span className="truncate">Assinaturas Prestes a Vencer</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {expiringSubscriptions.length === 0 ? (
          <div className="text-center py-4">
            <div className="text-gray-400 text-sm">Nenhuma assinatura vence nos próximos 7 dias</div>
          </div>
        ) : (
          <div className="space-y-3">
            {expiringSubscriptions.slice(0, 5).map((subscription) => (
              <div
                key={subscription.id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-gray-700/50 rounded-lg border border-gray-600"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-white truncate">
                    {subscription.email}
                  </div>
                  <div className="text-xs text-gray-400">
                    {subscription.plan_type}
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-1">
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                    {format(new Date(subscription.subscription_end_date), "dd MMM", { locale: ptBR })}
                  </Badge>
                  <div className="text-xs text-gray-400">
                    €{subscription.monthly_price?.toFixed(2) || '0.00'}/mês
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminExpiringSubscriptions;