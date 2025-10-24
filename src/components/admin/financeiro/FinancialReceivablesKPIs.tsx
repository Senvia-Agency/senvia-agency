import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, AlertTriangle } from "lucide-react";
import { useUnifiedReceivables } from "@/hooks/useUnifiedReceivables";
import { Link } from "react-router-dom";

const FinancialReceivablesKPIs = () => {
  const { data: receivables, isLoading } = useUnifiedReceivables();

  const totalPending = receivables
    ?.filter(r => r.payment_status === 'pending' || r.payment_status === 'partial')
    .reduce((sum, r) => sum + Number(r.remaining_amount || 0), 0) || 0;

  const totalOverdue = receivables
    ?.filter(r => r.days_overdue > 0)
    .reduce((sum, r) => sum + Number(r.remaining_amount || 0), 0) || 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Card key={i} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-gray-600 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 bg-gray-600 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Link to="/admin/contas-receber">
        <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-yellow-500" />
              Total a Receber
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              €{totalPending.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Pendentes + Em Atraso
            </div>
          </CardContent>
        </Card>
      </Link>

      <Link to="/admin/contas-atraso">
        <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Em Atraso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              €{totalOverdue.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Contas Vencidas
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default FinancialReceivablesKPIs;
