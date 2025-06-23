
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ProductCard from "@/components/dashboard/ProductCard";
import { useAuth } from "@/contexts/AuthContext";

const DashboardProducts = () => {
  const { user } = useAuth();

  // Mock data for SENVIA Assistant only
  const products = [
    {
      id: "senvia-assistant",
      name: "SENVIA Assistant",
      description: "Assistente de IA avançado para automatização de atendimento",
      category: "assistant",
      status: "active",
      features: {
        ai_responses: true,
        whatsapp_integration: true,
        custom_training: true,
        analytics: true,
        multi_agent: true
      },
      product_plans: [
        {
          id: "senvia-assistant-pro",
          name: "SENVIA Assistant Pro",
          price_monthly: 20,
          description: "Plano completo com todas as funcionalidades",
          stripe_price_id_monthly: "https://buy.stripe.com/dRmeVdcsteTugNSd3T9AA02"
        }
      ]
    }
  ];

  const { data: userSubscriptions } = useQuery({
    queryKey: ['user-subscriptions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_subscriptions')
        .select('product_id, status')
        .eq('user_id', user?.id)
        .eq('status', 'active');
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Produtos SENVIA</h1>
              <p className="text-muted-foreground">
                Explore e gerencie os produtos e serviços da SENVIA
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const hasSubscription = userSubscriptions?.some(
                  sub => sub.product_id === product.id
                );

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    hasSubscription={hasSubscription}
                  />
                );
              })}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardProducts;
