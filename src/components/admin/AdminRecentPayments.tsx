
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AdminRecentPaymentsProps {
  recentActivity: any;
}

const AdminRecentPayments = ({ recentActivity }: AdminRecentPaymentsProps) => {
  return (
    <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm w-full min-w-0">
      <CardHeader className="pb-2 lg:pb-3">
        <CardTitle className="text-base lg:text-lg text-white">Pagamentos Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-3 lg:p-6 pt-0">
        <div className="space-y-3">
          {recentActivity?.payments?.map((payment: any, index: number) => (
            <div key={`${payment.id}-${index}`} className="border-b border-slate-700/50 last:border-0 pb-3 last:pb-0">
              {/* Mobile Layout - Stacked */}
              <div className="space-y-2">
                {/* Email and Amount */}
                <div className="min-w-0">
                  <div className="font-medium text-white text-sm truncate">
                    {payment.email}
                  </div>
                  <div className="text-lg font-bold text-green-400">
                    €{payment.amount ? (payment.amount / 100).toFixed(2) : '0.00'}
                  </div>
                  {payment.product_description && (
                    <div className="text-xs text-slate-500 mt-1 truncate">
                      {payment.product_description}
                    </div>
                  )}
                </div>
                
                {/* Status and Date - Organized Row */}
                <div className="flex items-center justify-between gap-2">
                  <Badge 
                    className="text-xs px-2 py-0.5 flex-shrink-0 bg-green-500/20 text-green-400 border-green-500/50"
                  >
                    {payment.status === 'completed' ? 'Concluído ✓' : 'Pago ✓'}
                  </Badge>
                  <div className="text-xs text-slate-400 flex-shrink-0">
                    {format(new Date(payment.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {(!recentActivity?.payments || recentActivity.payments.length === 0) && (
            <div className="text-center text-slate-400 py-6">
              <p className="text-sm">Nenhum pagamento recente</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRecentPayments;
