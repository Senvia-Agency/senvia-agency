
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
  const cards = [
    {
      title: "Produtos Stripe",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-400"
    },
    {
      title: "Assinaturas Ativas",
      value: stats.activeSubscriptions,
      subtitle: `${stats.trialSubscriptions} em trial`,
      icon: UserCheck,
      color: "text-purple-400"
    },
    {
      title: "Vendas Únicas",
      value: stats.totalSales,
      subtitle: "produtos vendidos",
      icon: CreditCard,
      color: "text-green-400"
    },
    {
      title: "Receita Total",
      value: `€${stats.totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-orange-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-300">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`h-5 w-5 ${card.color}`} />
              <span className="text-2xl font-bold text-slate-100">
                {card.value}
              </span>
            </div>
            {card.subtitle && (
              <div className="text-sm text-slate-400">
                {card.subtitle}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductStatsCards;
