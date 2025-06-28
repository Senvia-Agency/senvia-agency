
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
      <CardHeader>
        <CardTitle>Pagamentos Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentActivity?.payments?.map((payment: any) => (
            <div key={payment.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
              <div>
                <div className="font-medium">{payment.email}</div>
                <div className="text-sm text-gray-400">
                  €{payment.amount ? (payment.amount / 100).toFixed(2) : '0.00'}
                </div>
                {payment.product_description && (
                  <div className="text-xs text-gray-500 mt-1">
                    {payment.product_description}
                  </div>
                )}
              </div>
              <div className="text-right">
                <Badge 
                  variant="default"
                  className="text-xs bg-green-500/20 text-green-500"
                >
                  {payment.status === 'completed' ? 'Concluído' : 'Pago'} ✓
                </Badge>
                <div className="text-xs text-gray-400 mt-1">
                  {format(new Date(payment.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                </div>
              </div>
            </div>
          ))}
          {(!recentActivity?.payments || recentActivity.payments.length === 0) && (
            <div className="text-center text-gray-400 py-4">
              Nenhum pagamento recente
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRecentPayments;
