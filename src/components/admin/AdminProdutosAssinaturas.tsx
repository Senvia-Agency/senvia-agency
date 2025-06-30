
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, ExternalLink } from "lucide-react";
import ProductStatsCards from "./produtos/ProductStatsCards";
import ProductCatalog from "./produtos/ProductCatalog";
import ActiveSubscriptionsList from "./produtos/ActiveSubscriptionsList";
import PerformanceSummary from "./produtos/PerformanceSummary";

const AdminProdutosAssinaturas = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
      <ProductStatsCards stats={stats} />

      {/* Produtos Sincronizados do Stripe */}
      <ProductCatalog 
        products={products}
        productsLoading={productsLoading}
        syncWithStripe={syncWithStripe}
        isLoading={isLoading}
      />

      {/* Assinaturas Ativas */}
      <ActiveSubscriptionsList activeSubscriptions={activeSubscriptions} />

      {/* Performance Summary */}
      <PerformanceSummary stats={stats} />
    </div>
  );
};

export default AdminProdutosAssinaturas;
