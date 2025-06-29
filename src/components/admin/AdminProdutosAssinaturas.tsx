
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Users, TrendingUp } from "lucide-react";
import ProductCatalog from "./produtos/ProductCatalog";
import ActiveSubscriptionsList from "./produtos/ActiveSubscriptionsList";
import ProductStatsCards from "./produtos/ProductStatsCards";
import PerformanceSummary from "./produtos/PerformanceSummary";

const AdminProdutosAssinaturas = () => {
  const [activeTab, setActiveTab] = useState("produtos");

  // Mock data - in real app these would come from hooks
  const mockStats = {
    totalProducts: 5,
    activeSubscriptions: 24,
    trialSubscriptions: 8,
    totalSales: 156,
    totalRevenue: 4500.00
  };

  const mockActiveSubscriptions: any[] = [];

  const mockPerformanceStats = {
    subscriptionRevenue: 2400.00,
    salesRevenue: 2100.00,
    totalSubscriptions: 32,
    totalSales: 156,
    activeSubscriptions: 24,
    trialSubscriptions: 8
  };

  return (
    <div className="space-y-4 lg:space-y-6 p-4 lg:p-6 w-full max-w-full overflow-x-hidden">
      {/* Header - Mobile Optimized */}
      <div className="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl lg:text-3xl font-bold mb-1 lg:mb-2 truncate">Produtos & Assinaturas</h1>
          <p className="text-sm lg:text-base text-gray-400 truncate">Gerencie produtos, planos e assinaturas</p>
        </div>
      </div>

      {/* Stats Cards */}
      <ProductStatsCards stats={mockStats} />

      {/* Tabs - Mobile Optimized */}
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-slate-600/50">
            <TabsList className="w-full h-auto bg-transparent p-0 rounded-none">
              <div className="grid w-full grid-cols-3 gap-0">
                <TabsTrigger 
                  value="produtos" 
                  className="flex-1 data-[state=active]:bg-slate-700/50 data-[state=active]:text-white text-slate-400 border-b-2 border-transparent data-[state=active]:border-senvia-500 rounded-none px-3 py-3 lg:px-6 lg:py-4"
                >
                  <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2">
                    <Package className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span className="text-xs lg:text-sm font-medium">Produtos</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="assinaturas" 
                  className="flex-1 data-[state=active]:bg-slate-700/50 data-[state=active]:text-white text-slate-400 border-b-2 border-transparent data-[state=active]:border-senvia-500 rounded-none px-3 py-3 lg:px-6 lg:py-4"
                >
                  <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2">
                    <Users className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span className="text-xs lg:text-sm font-medium">Assinaturas</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="performance" 
                  className="flex-1 data-[state=active]:bg-slate-700/50 data-[state=active]:text-white text-slate-400 border-b-2 border-transparent data-[state=active]:border-senvia-500 rounded-none px-3 py-3 lg:px-6 lg:py-4"
                >
                  <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2">
                    <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span className="text-xs lg:text-sm font-medium">Performance</span>
                  </div>
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

          <div className="p-0">
            <TabsContent value="produtos" className="mt-0 p-4 lg:p-6">
              <ProductCatalog 
                products={[]} 
                productsLoading={false} 
                syncWithStripe={() => {}} 
                isLoading={false} 
              />
            </TabsContent>

            <TabsContent value="assinaturas" className="mt-0 p-4 lg:p-6">
              <ActiveSubscriptionsList activeSubscriptions={mockActiveSubscriptions} />
            </TabsContent>

            <TabsContent value="performance" className="mt-0 p-4 lg:p-6">
              <PerformanceSummary stats={mockPerformanceStats} />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminProdutosAssinaturas;
