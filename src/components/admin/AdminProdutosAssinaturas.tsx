
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
    <div className="space-y-3 lg:space-y-6 p-3 lg:p-6 w-full max-w-full overflow-x-hidden">
      {/* Header - Mobile Optimized */}
      <div className="space-y-2 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg lg:text-3xl font-bold mb-1 lg:mb-2 truncate text-slate-100">
            Produtos & Assinaturas
          </h1>
          <p className="text-xs lg:text-base text-slate-400 truncate">
            Gerencie produtos, planos e assinaturas
          </p>
        </div>
      </div>

      {/* Stats Cards - Mobile Optimized */}
      <div className="w-full overflow-x-hidden">
        <ProductStatsCards stats={mockStats} />
      </div>

      {/* Tabs - Mobile Optimized */}
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-slate-600/50 overflow-x-auto">
            <TabsList className="w-full min-w-fit h-auto bg-transparent p-0 rounded-none">
              <div className="flex w-full min-w-fit">
                <TabsTrigger 
                  value="produtos" 
                  className="flex-1 min-w-0 data-[state=active]:bg-slate-700/50 data-[state=active]:text-white text-slate-400 border-b-2 border-transparent data-[state=active]:border-senvia-500 rounded-none px-2 py-2 lg:px-6 lg:py-4"
                >
                  <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2 min-w-0">
                    <Package className="h-3 w-3 lg:h-5 lg:w-5 flex-shrink-0" />
                    <span className="text-xs lg:text-sm font-medium truncate">Produtos</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="assinaturas" 
                  className="flex-1 min-w-0 data-[state=active]:bg-slate-700/50 data-[state=active]:text-white text-slate-400 border-b-2 border-transparent data-[state=active]:border-senvia-500 rounded-none px-2 py-2 lg:px-6 lg:py-4"
                >
                  <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2 min-w-0">
                    <Users className="h-3 w-3 lg:h-5 lg:w-5 flex-shrink-0" />
                    <span className="text-xs lg:text-sm font-medium truncate">Assinaturas</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="performance" 
                  className="flex-1 min-w-0 data-[state=active]:bg-slate-700/50 data-[state=active]:text-white text-slate-400 border-b-2 border-transparent data-[state=active]:border-senvia-500 rounded-none px-2 py-2 lg:px-6 lg:py-4"
                >
                  <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2 min-w-0">
                    <TrendingUp className="h-3 w-3 lg:h-5 lg:w-5 flex-shrink-0" />
                    <span className="text-xs lg:text-sm font-medium truncate">Performance</span>
                  </div>
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

          <div className="p-0 w-full overflow-x-hidden">
            <TabsContent value="produtos" className="mt-0 p-3 lg:p-6">
              <div className="w-full overflow-x-hidden">
                <ProductCatalog 
                  products={[]} 
                  productsLoading={false} 
                  syncWithStripe={() => {}} 
                  isLoading={false} 
                />
              </div>
            </TabsContent>

            <TabsContent value="assinaturas" className="mt-0 p-3 lg:p-6">
              <div className="w-full overflow-x-hidden">
                <ActiveSubscriptionsList activeSubscriptions={mockActiveSubscriptions} />
              </div>
            </TabsContent>

            <TabsContent value="performance" className="mt-0 p-3 lg:p-6">
              <div className="w-full overflow-x-hidden">
                <PerformanceSummary stats={mockPerformanceStats} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminProdutosAssinaturas;
