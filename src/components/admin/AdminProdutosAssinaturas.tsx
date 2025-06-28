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

  // Buscar produtos REAIS do Supabase (sincronizados do Stripe)
  const { data: products, refetch: refetchProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products-real'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_plans (*)
        `)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
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
      const { data, error } = await supabase.functions.invoke('sync-stripe-products');
      
      if (error) throw error;
      
      // Refetch dos dados após sincronização
      await refetchProducts();
      await refetchSubscriptions();
      await refetchSales();
      
      toast({
        title: "Sincronização concluída",
        description: `Produtos sincronizados com sucesso! ${data?.results?.products_synced || 0} produtos e ${data?.results?.plans_synced || 0} planos sincronizados.`
      });
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar com o Stripe. Verifique os logs.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    const totalProducts = products?.length || 0;
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

  const getProductIcon = (category: string) => {
    const iconMap: { [key: string]: any } = {
      'assistant': Users,
      'landing_pages': Package,
      'websites': CreditCard,
      'ecommerce': TrendingUp
    };
    const Icon = iconMap[category] || Package;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-slate-100">Produtos & Assinaturas</h1>
          <p className="text-slate-400">Gerencie produtos do Stripe e acompanhe assinaturas</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => window.open('https://dashboard.stripe.com/products', '_blank')}
            className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir Stripe
          </Button>
          <Button 
            onClick={syncWithStripe}
            disabled={isLoading}
            className="bg-senvia-500 hover:bg-senvia-400 text-slate-900 font-medium"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Sincronizar Stripe
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
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

      {/* Produtos Sincronizados do Stripe */}
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Package className="h-5 w-5 text-senvia-500" />
            Catálogo de Produtos (Sincronizados do Stripe)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {productsLoading ? (
            <div className="text-center py-8 text-slate-400">
              Carregando produtos...
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="bg-slate-700/70 border-slate-600/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-senvia-500/20 rounded-lg">
                          {getProductIcon(product.category)}
                        </div>
                        <div>
                          <CardTitle className="text-lg text-slate-100">{product.name}</CardTitle>
                          <p className="text-sm text-slate-400 capitalize">{product.category.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <Badge variant={product.active ? "default" : "secondary"} className={product.active ? "bg-green-500/20 text-green-400 border-green-500/50" : ""}>
                        {product.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-300 text-sm line-clamp-2">
                      {product.description || 'Sem descrição disponível'}
                    </p>

                    {/* Product Plans */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-slate-300">Planos Disponíveis:</h4>
                      <div className="space-y-1">
                        {product.product_plans?.slice(0, 3).map((plan: any) => (
                          <div key={plan.id} className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">{plan.name}</span>
                            <span className="text-senvia-400 font-medium">
                              €{plan.price_monthly || plan.price_yearly || 0}
                              {plan.price_monthly ? '/mês' : plan.price_yearly ? '/ano' : ''}
                            </span>
                          </div>
                        ))}
                        {product.product_plans?.length > 3 && (
                          <div className="text-xs text-slate-500">
                            +{product.product_plans.length - 3} mais planos
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stripe Info */}
                    {product.stripe_product_id && (
                      <div className="pt-2 border-t border-slate-600/50">
                        <div className="text-xs text-slate-500">
                          Stripe ID: {product.stripe_product_id}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                            onClick={() => setSelectedItem(product)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-slate-800 border-slate-600">
                          <DialogHeader>
                            <DialogTitle className="text-slate-100">Detalhes do Produto</DialogTitle>
                          </DialogHeader>
                          
                          {selectedItem && (
                            <div className="space-y-6">
                              {/* Basic Info */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-slate-300">Nome</label>
                                  <p className="text-sm text-slate-400">{selectedItem.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-slate-300">Categoria</label>
                                  <p className="text-sm text-slate-400 capitalize">
                                    {selectedItem.category.replace('_', ' ')}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-slate-300">Status</label>
                                  <p className="text-sm text-slate-400">
                                    {selectedItem.status === 'active' && selectedItem.active ? 'Ativo' : 'Inativo'}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-slate-300">Modelo de Preços</label>
                                  <p className="text-sm text-slate-400 capitalize">
                                    {selectedItem.pricing_model}
                                  </p>
                                </div>
                              </div>

                              {/* Description */}
                              <div>
                                <label className="text-sm font-medium text-slate-300">Descrição</label>
                                <p className="text-sm text-slate-400 mt-1">
                                  {selectedItem.description || 'Sem descrição disponível'}
                                </p>
                              </div>

                              {/* Features */}
                              {selectedItem.features && (
                                <div>
                                  <label className="text-sm font-medium text-slate-300">Funcionalidades</label>
                                  <div className="mt-2 space-y-1">
                                    {Object.entries(selectedItem.features).map(([key, value]) => (
                                      <div key={key} className="flex justify-between text-sm">
                                        <span className="text-slate-400 capitalize">{key.replace('_', ' ')}</span>
                                        <span className="text-slate-300">
                                          {typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : String(value)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Plans */}
                              <div>
                                <label className="text-sm font-medium text-slate-300">Planos</label>
                                <div className="mt-2 space-y-2">
                                  {selectedItem.product_plans?.map((plan: any) => (
                                    <Card key={plan.id} className="bg-slate-700 border-slate-600">
                                      <CardContent className="p-3">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <h4 className="font-medium text-white">{plan.name}</h4>
                                            <p className="text-xs text-slate-400">{plan.description}</p>
                                          </div>
                                          <div className="text-right">
                                            <div className="text-sm font-bold text-senvia-500">
                                              €{plan.price_monthly}/mês
                                            </div>
                                            {plan.price_yearly && (
                                              <div className="text-xs text-slate-400">
                                                €{plan.price_yearly}/ano
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>

                              {/* Metadata */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-600">
                                <div>
                                  <label className="text-sm font-medium text-slate-300">Data de Criação</label>
                                  <p className="text-sm text-slate-400">
                                    {format(new Date(selectedItem.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-slate-300">Última Atualização</label>
                                  <p className="text-sm text-slate-400">
                                    {format(new Date(selectedItem.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-200 mb-2">Nenhum produto encontrado</h3>
              <p className="text-slate-400 mb-4">Sincronize com o Stripe para importar seus produtos.</p>
              <Button 
                onClick={syncWithStripe}
                disabled={isLoading}
                className="bg-senvia-500 hover:bg-senvia-400 text-slate-900"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Sincronizar com Stripe
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assinaturas Ativas */}
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Users className="h-5 w-5 text-senvia-500" />
            Assinaturas Ativas ({activeSubscriptions?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeSubscriptions?.slice(0, 10).map((subscription) => (
              <div key={subscription.id} className="flex items-center justify-between p-4 bg-slate-700/70 rounded-lg border border-slate-600/50">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-purple-400" />
                  <div>
                    <div className="font-medium text-slate-100">{subscription.email}</div>
                    <div className="text-sm text-slate-400">
                      {subscription.plan_type} - €{subscription.monthly_price || 20}/mês
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={subscription.status === 'active' ? 'default' : 'secondary'}
                    className={subscription.status === 'trial' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : ''}
                  >
                    {subscription.status === 'trial' ? 'Trial' : subscription.status}
                  </Badge>
                  <div className="text-right">
                    <div className="text-sm text-slate-300">
                      {format(new Date(subscription.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                    {subscription.trial_end_date && subscription.status === 'trial' && (
                      <div className="text-xs text-yellow-400">
                        Trial até {format(new Date(subscription.trial_end_date), 'dd/MM', { locale: ptBR })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {(!activeSubscriptions || activeSubscriptions.length === 0) && (
              <div className="text-center py-8 text-slate-400">
                <Users className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                <p>Nenhuma assinatura ativa encontrada</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
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
    </div>
  );
};

export default AdminProdutosAssinaturas;
