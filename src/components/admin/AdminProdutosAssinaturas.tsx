
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Settings } from "lucide-react";
import ProductsTable from "./produtos/ProductsTable";
import CustomServicesSection from "./produtos/CustomServicesSection";
import ProductStatsCards from "./produtos/ProductStatsCards";
import { useAdminSubscriptions } from "@/hooks/useAdminSubscriptions";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { useSyncStripeProducts } from "@/hooks/useSyncStripeProducts";

const AdminProdutosAssinaturas = () => {
  const [activeTab, setActiveTab] = useState("produtos");
  const { data: subscriptions } = useAdminSubscriptions();
  const { data: products, isLoading: productsLoading } = useAdminProducts();
  const syncStripeProductsMutation = useSyncStripeProducts();

  const handleSyncWithStripe = () => {
    syncStripeProductsMutation.mutate();
  };

  // Stats for ProductStatsCards component
  const mockStatsCards = {
    totalProducts: products?.length || 0,
    activeSubscriptions: subscriptions?.filter(s => s.status === 'active').length || 0,
    trialSubscriptions: subscriptions?.filter(s => s.status === 'trial').length || 0,
    totalSales: 0,
    totalRevenue: 0
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Produtos & Serviços</h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Gerencie o catálogo de produtos e serviços personalizados
        </p>
      </div>

      {/* Stats Cards */}
      <ProductStatsCards stats={mockStatsCards} />

      {/* Tabs para diferentes seções */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
          <TabsTrigger 
            value="produtos" 
            className="flex items-center gap-2 data-[state=active]:bg-gray-700"
          >
            <Package className="h-4 w-4" />
            Produtos Stripe
          </TabsTrigger>
          <TabsTrigger 
            value="servicos" 
            className="flex items-center gap-2 data-[state=active]:bg-gray-700"
          >
            <Settings className="h-4 w-4" />
            Serviços
          </TabsTrigger>
        </TabsList>

        <TabsContent value="produtos" className="space-y-6">
          {/* Header da seção */}
          <div className="flex items-center gap-2 mb-6">
            <Package className="h-6 w-6 text-senvia-500" />
            <h2 className="text-xl font-semibold text-white">Produtos Stripe</h2>
          </div>

          {/* Products Display */}
          <ProductsTable 
            products={products || []}
            onUpdate={handleSyncWithStripe}
          />
        </TabsContent>

        <TabsContent value="servicos" className="space-y-6">
          {/* Custom Services Section */}
          <CustomServicesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProdutosAssinaturas;
