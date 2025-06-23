
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CreditCard, FileText, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  subscriptions: any[];
  invoices: any[];
}

const DashboardStats = ({ subscriptions, invoices }: DashboardStatsProps) => {
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
  const totalSpent = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0);
  const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending').length;

  const stats = [
    {
      title: "Assinaturas Ativas",
      value: activeSubscriptions,
      icon: Package,
      description: "Produtos ativos",
    },
    {
      title: "Total Gasto",
      value: `€${totalSpent.toFixed(2)}`,
      icon: TrendingUp,
      description: "Este mês",
    },
    {
      title: "Faturas Pendentes",
      value: pendingInvoices,
      icon: FileText,
      description: "Aguardando pagamento",
    },
    {
      title: "Status da Conta",
      value: "Ativa",
      icon: CreditCard,
      description: "Todos os serviços funcionando",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
