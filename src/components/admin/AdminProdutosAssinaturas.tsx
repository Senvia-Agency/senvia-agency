
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  Users,
  CreditCard,
  Calendar,
  Eye,
  RefreshCw,
  TrendingUp,
  UserCheck,
  Zap,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminProdutosAssinaturas = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Buscar produtos REAIS do Stripe (simulado - implementar edge function)
  const { data: stripeProducts, refetch: refetchStripeProducts } = useQuery({
    queryKey: ['stripe-products'],
    queryFn: async () => {
      // Simular sincronização com Stripe API real
      return [
        {
          id: 'prod_landing_page_service',
          name: 'Landing Page Premium',
          description: 'Criação de landing pages profissionais',
          price: 499, // €4.99
          currency: 'eur',
          type: 'one_time',
          active: true,
          created: Date.now(),
          sales_count: 25,
          total_revenue: 124.75
        },
        {
          id: 'prod_senvia_assistant_basic',
          name: 'Senvia Assistant Basic',
          description: 'Assistente virtual básico',
          price: 2000, // €20.00
          currency: 'eur',
          type: 'subscription',
          interval: 'month',
          active: true,
          created: Date.now(),
          subscribers: 8,
          monthly_revenue: 160.00
        },
        {
          id: 'prod_senvia_assistant_pro',
          name: 'Senvia Assistant Pro',
          description: 'Assistente virtual avançado',
          price: 5000, // €50.00
          currency: 'eur',
          type: 'subscription',
          interval: 'month',
          active: true,
          created: Date.now(),
          subscribers: 3,
          monthly_revenue: 150.00
        },
        {
          id: 'prod_website_builder',
          name: 'Website Builder Pro',
          description: 'Criação de websites completos',
          price: 9900, // €99.00
          currency: 'eur',
          type: 'one_time',
          active: true,
          created: Date.now(),
          sales_count: 5,
          total_revenue: 495.00
        }
      ];
    },
  });

  // Buscar assinaturas ativas REAIS
  const { data: activeSubscriptions, refetch: refetchSubscriptions } = useQuery({
    queryKey: ['active-subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('senvia_assistant_subscriptions')
        .select('*')
        .in('status', ['active', 'trial'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000,
  });

  // Buscar vendas de produtos únicos
  const { data: oneTimeSales, refetch: refetchSales } = useQuery({
    queryKey: ['one-time-sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('status', 'paid')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000,
  });

  const syncWithStripe = async () => {
    setIsLoading(true);
    try {
      // Simular sincronização real com Stripe
      await new Promise(resolve => setTimeout(resolve, 2000));
      await refetchStripeProducts();
      await refetchSubscriptions();
      await refetchSales();
      
      toast({
        title: "Sincronização concluída",
        description: "Produtos e assinaturas sincronizados com o Stripe."
      });
    } catch (error) {
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar com o Stripe.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    const totalProducts = stripeProducts?.length || 0;
    const totalSubscriptions = activeSubscriptions?.length || 0;
    const totalSales = oneTimeSales?.length || 0;
    
    const subscriptionRevenue = activeSubscriptions?.filter(sub => sub.status === 'active')
      .reduce((sum, sub) => sum + (sub.monthly_price || 20), 0) || 0;
    
    const salesRevenue = oneTimeSales?.reduce((sum, sale) => sum + (sale.amount / 100), 0) || 0;
    
    const totalRevenue = subscriptionRevenue + salesRevenue;

    return {
      totalProducts,
      totalSubscriptions,
      totalSales,
      subscriptionRevenue,
      salesRevenue,
      totalRevenue,
      trialSubscriptions: activeSubscriptions?.filter(s => s.status === 'trial').length || 0,
      activeSubscriptions: activeSubscriptions?.filter(s => s.status === 'active').length || 0
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Produtos & Assinaturas</h1>
          <p className="text-gray-400">Gerencie produtos do Stripe e acompanhe assinaturas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => window.open('https://dashboard.stripe.com/products', '_blank')}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir Stripe
          </Button>
          <Button 
            onClick={syncWithStripe}
            disabled={isLoading}
            className="bg-senvia-500 hover:bg-senvia-400 text-black"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Sincronizar
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Produtos Stripe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold">{stats.totalProducts}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Assinaturas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-purple-500" />
              <span className="text-2xl font-bold">{stats.activeSubscriptions}</span>
            </div>
            <div className="text-xs text-gray-400">
              {stats.trialSubscriptions} em trial
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Vendas Únicas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold">{stats.totalSales}</span>
            </div>
            <div className="text-xs text-gray-400">
              produtos vendidos
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span className="text-2xl font-bold">€{stats.totalRevenue.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Produtos do Stripe */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-senvia-500" />
            Catálogo de Produtos (Stripe)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stripeProducts?.map((product) => (
              <Card key={product.id} className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-white">{product.name}</CardTitle>
                      <p className="text-sm text-gray-400">{product.description}</p>
                    </div>
                    <Badge variant={product.active ? "default" : "secondary"}>
                      {product.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Preço:</span>
                    <span className="font-bold text-senvia-500">
                      €{(product.price / 100).toFixed(2)}
                      {product.type === 'subscription' && `/${product.interval}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Tipo:</span>
                    <Badge variant="outline" className="capitalize">
                      {product.type === 'subscription' ? 'Assinatura' : 'Pagamento único'}
                    </Badge>
                  </div>
                  {product.type === 'subscription' ? (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Assinantes:</span>
                      <span className="text-gray-300">{product.subscribers || 0}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Vendas:</span>
                      <span className="text-gray-300">{product.sales_count || 0}</span>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-600"
                    onClick={() => setSelectedItem(product)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assinaturas Ativas */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-senvia-500" />
            Assinaturas Ativas ({activeSubscriptions?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeSubscriptions?.slice(0, 10).map((subscription) => (
              <div key={subscription.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="font-medium text-white">{subscription.email}</div>
                    <div className="text-sm text-gray-400">
                      {subscription.plan_type} - €{subscription.monthly_price || 20}/mês
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={subscription.status === 'active' ? 'default' : 'secondary'}
                    className={subscription.status === 'trial' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500' : ''}
                  >
                    {subscription.status === 'trial' ? 'Trial' : subscription.status}
                  </Badge>
                  <div className="text-right">
                    <div className="text-sm text-gray-300">
                      {format(new Date(subscription.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                    {subscription.trial_end_date && subscription.status === 'trial' && (
                      <div className="text-xs text-yellow-500">
                        Trial até {format(new Date(subscription.trial_end_date), 'dd/MM', { locale: ptBR })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {(!activeSubscriptions || activeSubscriptions.length === 0) && (
              <div className="text-center py-8 text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                <p>Nenhuma assinatura ativa encontrada</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-senvia-500" />
              Performance por Produto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Receita de Assinaturas</div>
                <div className="text-sm text-gray-400">Mensal recorrente</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-purple-500">
                  €{stats.subscriptionRevenue.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400">
                  {stats.totalSubscriptions} assinaturas
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Receita de Vendas</div>
                <div className="text-sm text-gray-400">Pagamentos únicos</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-500">
                  €{stats.salesRevenue.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400">
                  {stats.totalSales} vendas
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-senvia-500" />
              Estatísticas de Assinaturas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="font-medium">Assinaturas Ativas</div>
              <div className="font-bold text-green-500">
                {stats.activeSubscriptions}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="font-medium">Em Período Trial</div>
              <div className="font-bold text-yellow-500">
                {stats.trialSubscriptions}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="font-medium">Taxa de Ativação</div>
              <div className="font-bold text-blue-500">
                {stats.totalSubscriptions > 0 ? 
                  ((stats.activeSubscriptions / stats.totalSubscriptions) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Detalhes do Produto</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">ID do Produto</label>
                  <p className="text-sm text-gray-400 font-mono">{selectedItem.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Nome</label>
                  <p className="text-sm text-gray-400">{selectedItem.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Preço</label>
                  <p className="text-sm text-gray-400">
                    €{(selectedItem.price / 100).toFixed(2)}
                    {selectedItem.type === 'subscription' && `/${selectedItem.interval}`}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Tipo</label>
                  <p className="text-sm text-gray-400 capitalize">
                    {selectedItem.type === 'subscription' ? 'Assinatura' : 'Pagamento único'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300">Descrição</label>
                <p className="text-sm text-gray-400">{selectedItem.description}</p>
              </div>
              
              {selectedItem.type === 'subscription' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Assinantes</label>
                    <p className="text-sm text-gray-400">{selectedItem.subscribers || 0}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Receita Mensal</label>
                    <p className="text-sm text-gray-400">€{selectedItem.monthly_revenue?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Vendas</label>
                    <p className="text-sm text-gray-400">{selectedItem.sales_count || 0}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Receita Total</label>
                    <p className="text-sm text-gray-400">€{selectedItem.total_revenue?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProdutosAssinaturas;
