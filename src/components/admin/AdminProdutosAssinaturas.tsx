
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
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="space-y-2 lg:space-y-1">
        <h1 className="text-xl lg:text-2xl font-bold text-slate-100 truncate">
          Produtos & Assinaturas
        </h1>
        <p className="text-sm lg:text-base text-slate-400 truncate">
          Gerencie produtos, planos e assinaturas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="w-full overflow-x-hidden">
        <ProductStatsCards stats={mockStats} />
      </div>

      {/* Tabs */}
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-slate-600/50 overflow-x-auto">
            <TabsList className="w-full min-w-fit h-auto bg-transparent p-0 rounded-none">
              <div className="flex w-full min-w-fit">
                <TabsTrigger 
                  value="produtos" 
                  className="flex-1 min-w-0 data-[state=active]:bg-slate-700/50 data-[state=active]:text-white text-slate-400 border-b-2 border-transparent data-[state=active]:border-senvia-500 rounded-none px-3 py-3 lg:px-6 lg:py-4"
                >
                  <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2 min-w-0">
                    <Package className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                    <span className="text-xs lg:text-sm font-medium truncate">Produtos</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="assinaturas" 
                  className="flex-1 min-w-0 data-[state=active]:bg-slate-700/50 data-[state=active]:text-white text-slate-400 border-b-2 border-transparent data-[state=active]:border-senvia-500 rounded-none px-3 py-3 lg:px-6 lg:py-4"
                >
                  <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2 min-w-0">
                    <Users className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                    <span className="text-xs lg:text-sm font-medium truncate">Assinaturas</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="performance" 
                  className="flex-1 min-w-0 data-[state=active]:bg-slate-700/50 data-[state=active]:text-white text-slate-400 border-b-2 border-transparent data-[state=active]:border-senvia-500 rounded-none px-3 py-3 lg:px-6 lg:py-4"
                >
                  <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2 min-w-0">
                    <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                    <span className="text-xs lg:text-sm font-medium truncate">Performance</span>
                  </div>
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

          <div className="p-0 w-full overflow-x-hidden">
            <TabsContent value="produtos" className="mt-0 p-4 lg:p-6">
              <div className="w-full overflow-x-hidden">
                <ProductCatalog 
                  products={[]} 
                  productsLoading={false} 
                  syncWithStripe={() => {}} 
                  isLoading={false} 
                />
              </div>
            </TabsContent>

            <TabsContent value="assinaturas" className="mt-0 p-4 lg:p-6">
              <div className="w-full overflow-x-hidden">
                <ActiveSubscriptionsList activeSubscriptions={mockActiveSubscriptions} />
              </div>
            </TabsContent>

            <TabsContent value="performance" className="mt-0 p-4 lg:p-6">
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
