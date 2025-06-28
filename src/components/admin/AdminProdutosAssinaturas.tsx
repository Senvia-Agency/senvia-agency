
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
  Zap
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminProdutosAssinaturas = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Buscar produtos do Stripe via edge function (quando implementada)
  const { data: stripeProducts, refetch: refetchStripeProducts } = useQuery({
    queryKey: ['stripe-products'],
    queryFn: async () => {
      // Simular produtos do Stripe até implementar edge function
      return [
        {
          id: 'prod_landing_page',
          name: 'Landing Page Service',
          description: 'Serviço de criação de landing pages',
          pricing: {
            type: 'one_time',
            amount: 499, // €4.99
            currency: 'eur'
          },
          active: true,
          created: new Date().toISOString(),
          metadata: {
            category: 'landing_page'
          }
        },
        {
          id: 'prod_senvia_assistant',
          name: 'Senvia Assistant',
          description: 'Assistente virtual inteligente',
          pricing: {
            type: 'recurring',
            amount: 2000, // €20.00
            currency: 'eur',
            interval: 'month'
          },
          active: true,
          created: new Date().toISOString(),
          metadata: {
            category: 'assistant'
          }
        }
      ];
    },
  });

  // Buscar assinaturas ativas
  const { data: activeSubscriptions } = useQuery({
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
  });

  // Buscar vendas de landing pages
  const { data: landingPageSales } = useQuery({
    queryKey: ['landing-page-sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('amount', 499)
        .eq('status', 'paid')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const syncWithStripe = async () => {
    setIsLoading(true);
    try {
      // Simular sincronização com Stripe
      await new Promise(resolve => setTimeout(resolve, 2000));
      await refetchStripeProducts();
      
      toast({
        title: "Sincronização concluída",
        description: "Produtos sincronizados com o Stripe com sucesso."
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
    const totalSubscriptions = activeSubscriptions?.length || 0;
    const totalSales = landingPageSales?.length || 0;
    const subscriptionRevenue = totalSubscriptions * 20; // €20 por assinatura
    const salesRevenue = totalSales * 4.99; // €4.99 por venda
    const totalRevenue = subscriptionRevenue + salesRevenue;

    return {
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
          <p className="text-gray-400">Gerencie produtos e acompanhe assinaturas da SENVIA</p>
        </div>
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
          Sincronizar Stripe
        </Button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Produtos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold">{stripeProducts?.length || 0}</span>
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
              Landing pages vendidas
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
            Produtos do Stripe
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
                      €{(product.pricing.amount / 100).toFixed(2)}
                      {product.pricing.type === 'recurring' && `/${product.pricing.interval}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Tipo:</span>
                    <Badge variant="outline" className="capitalize">
                      {product.pricing.type === 'recurring' ? 'Assinatura' : 'Pagamento único'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Categoria:</span>
                    <span className="text-gray-300 capitalize">
                      {product.metadata?.category || 'N/A'}
                    </span>
                  </div>
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
            Assinaturas Ativas
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
                      {subscription.plan_type} - €{subscription.monthly_price}/mês
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

      {/* Breakdown de Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-senvia-500" />
              Performance de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Senvia Assistant</div>
                <div className="text-sm text-gray-400">Assinaturas mensais</div>
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
                <div className="font-medium">Landing Pages</div>
                <div className="text-sm text-gray-400">Vendas únicas</div>
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
              <div className="font-medium">Taxa de Conversão Trial</div>
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
                    €{(selectedItem.pricing.amount / 100).toFixed(2)}
                    {selectedItem.pricing.type === 'recurring' && `/${selectedItem.pricing.interval}`}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Tipo</label>
                  <p className="text-sm text-gray-400 capitalize">
                    {selectedItem.pricing.type === 'recurring' ? 'Assinatura' : 'Pagamento único'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300">Descrição</label>
                <p className="text-sm text-gray-400">{selectedItem.description}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300">Data de Criação</label>
                <p className="text-sm text-gray-400">
                  {format(new Date(selectedItem.created), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProdutosAssinaturas;
