
import { useState } from "react";
import { Package } from "lucide-react";
import ProductsTable from "./produtos/ProductsTable";
import CustomServicesSection from "./produtos/CustomServicesSection";
import ProductStatsCards from "./produtos/ProductStatsCards";
import { useAdminSubscriptions } from "@/hooks/useAdminSubscriptions";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { useSyncStripeProducts } from "@/hooks/useSyncStripeProducts";

const AdminProdutosAssinaturas = () => {
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

      {/* Header da seção */}
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-6 w-6 text-senvia-500" />
        <h2 className="text-xl font-semibold text-white">Catálogo</h2>
      </div>

      {/* Products Display */}
      <ProductsTable 
        products={products || []}
        onUpdate={handleSyncWithStripe}
      />

      {/* Custom Services Section */}
      <CustomServicesSection />
    </div>
  );
};

export default AdminProdutosAssinaturas;
