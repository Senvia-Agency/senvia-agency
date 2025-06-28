
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar } from "lucide-react";

interface PerformanceSummaryProps {
  stats: {
    subscriptionRevenue: number;
    salesRevenue: number;
    totalSubscriptions: number;
    totalSales: number;
    activeSubscriptions: number;
    trialSubscriptions: number;
  };
}

const PerformanceSummary = ({ stats }: PerformanceSummaryProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <TrendingUp className="h-5 w-5 text-senvia-500" />
            Performance por Produto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-slate-200">Receita de Assinaturas</div>
              <div className="text-sm text-slate-400">Mensal recorrente</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-purple-400">
                €{stats.subscriptionRevenue.toFixed(2)}
              </div>
              <div className="text-xs text-slate-400">
                {stats.totalSubscriptions} assinaturas
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-slate-200">Receita de Vendas</div>
              <div className="text-sm text-slate-400">Pagamentos únicos</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-green-400">
                €{stats.salesRevenue.toFixed(2)}
              </div>
              <div className="text-xs text-slate-400">
                {stats.totalSales} vendas
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Calendar className="h-5 w-5 text-senvia-500" />
            Estatísticas de Assinaturas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="font-medium text-slate-200">Assinaturas Ativas</div>
            <div className="font-bold text-green-400">
              {stats.activeSubscriptions}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="font-medium text-slate-200">Em Período Trial</div>
            <div className="font-bold text-yellow-400">
              {stats.trialSubscriptions}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="font-medium text-slate-200">Taxa de Ativação</div>
            <div className="font-bold text-blue-400">
              {stats.totalSubscriptions > 0 ? 
                ((stats.activeSubscriptions / stats.totalSubscriptions) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceSummary;
