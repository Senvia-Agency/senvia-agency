
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AdminRecentPaymentsProps {
  recentActivity: any;
}

const AdminRecentPayments = ({ recentActivity }: AdminRecentPaymentsProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">Pagamentos Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        <div className="space-y-2 sm:space-y-3">
          {recentActivity?.payments?.map((payment: any) => (
            <div key={payment.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 sm:py-2 border-b border-gray-700 last:border-0 gap-2 sm:gap-0">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-base truncate">{payment.email}</div>
                <div className="text-xs sm:text-sm text-gray-400">
                  €{payment.amount ? (payment.amount / 100).toFixed(2) : '0.00'}
                </div>
                {payment.product_description && (
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2 sm:line-clamp-1">
                    {payment.product_description}
                  </div>
                )}
              </div>
              <div className="flex flex-row sm:flex-col items-start sm:items-end sm:text-right gap-2 sm:gap-1">
                <Badge 
                  variant="default"
                  className="text-xs bg-green-500/20 text-green-500 whitespace-nowrap"
                >
                  {payment.status === 'completed' ? 'Concluído' : 'Pago'} ✓
                </Badge>
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {format(new Date(payment.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                </div>
              </div>
            </div>
          ))}
          {(!recentActivity?.payments || recentActivity.payments.length === 0) && (
            <div className="text-center text-gray-400 py-6 sm:py-4 text-sm">
              Nenhum pagamento recente
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRecentPayments;
