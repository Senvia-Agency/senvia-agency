
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 w-full">
      {cards.map((card, index) => (
        <Card key={index} className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-1 lg:pb-2 p-3 lg:p-4">
            <CardTitle className="text-xs lg:text-sm font-medium text-slate-300 truncate">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 lg:p-4 pt-0">
            <div className="flex items-center gap-1 lg:gap-2 mb-1">
              <card.icon className={`h-3 w-3 lg:h-4 lg:w-4 ${card.color} flex-shrink-0`} />
              <span className="text-sm lg:text-2xl font-bold text-slate-100 truncate">
                {card.value}
              </span>
            </div>
            {card.subtitle && (
              <div className="text-xs text-slate-400 truncate">
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
