
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, UserCheck, CreditCard, TrendingUp } from "lucide-react";

interface ProductStatsCardsProps {
  stats: {
    totalProducts: number;
    activeSubscriptions: number;
    trialSubscriptions: number;
    totalSales: number;
    totalRevenue: number;
  };
}

const ProductStatsCards = ({ stats }: ProductStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Produtos Stripe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-400" />
            <span className="text-2xl font-bold text-slate-100">{stats.totalProducts}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Assinaturas Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-purple-400" />
            <span className="text-2xl font-bold text-slate-100">{stats.activeSubscriptions}</span>
          </div>
          <div className="text-xs text-slate-400">
            {stats.trialSubscriptions} em trial
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Vendas Únicas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-green-400" />
            <span className="text-2xl font-bold text-slate-100">{stats.totalSales}</span>
          </div>
          <div className="text-xs text-slate-400">
            produtos vendidos
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Receita Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-orange-400" />
            <span className="text-2xl font-bold text-slate-100">€{stats.totalRevenue.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductStatsCards;
