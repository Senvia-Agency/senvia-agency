
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RecentTransactionsCardProps {
  financialData: any;
}

const RecentTransactionsCard = ({ financialData }: RecentTransactionsCardProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle>Receitas Automáticas Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {financialData?.landing_pages.transactions?.slice(0, 3).map((transaction: any) => (
            <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
              <div>
                <div className="font-medium text-sm">Landing Page</div>
                <div className="text-xs text-gray-400">{transaction.email}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-500">
                  €{transaction.amount ? (Number(transaction.amount) / (transaction.amount > 100 ? 100 : 1)).toFixed(2) : '0.00'}
                </div>
                <div className="text-xs text-gray-400">
                  {format(new Date(transaction.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                </div>
              </div>
            </div>
          ))}
          
          {financialData?.senvia_assistant.subscriptions?.slice(0, 2).map((subscription: any) => (
            <div key={subscription.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
              <div>
                <div className="font-medium text-sm">Senvia Assistant</div>
                <div className="text-xs text-gray-400">{subscription.email}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-purple-500">€20.00</div>
                <div className="text-xs text-gray-400">
                  {format(new Date(subscription.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsCard;
