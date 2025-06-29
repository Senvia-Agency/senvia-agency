
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">Produtos & Assinaturas</h1>
        <p className="text-slate-400">Gerencie produtos, planos e assinaturas</p>
      </div>

      {/* Stats Cards */}
      <ProductStatsCards stats={mockStats} />

      {/* Tabs */}
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
            <TabsTrigger 
              value="produtos" 
              className="data-[state=active]:bg-senvia-500 data-[state=active]:text-slate-900"
            >
              <Package className="h-4 w-4 mr-2" />
              Produtos
            </TabsTrigger>
            <TabsTrigger 
              value="assinaturas"
              className="data-[state=active]:bg-senvia-500 data-[state=active]:text-slate-900"
            >
              <Users className="h-4 w-4 mr-2" />
              Assinaturas
            </TabsTrigger>
            <TabsTrigger 
              value="performance"
              className="data-[state=active]:bg-senvia-500 data-[state=active]:text-slate-900"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="produtos" className="mt-6">
            <ProductCatalog 
              products={[]} 
              productsLoading={false} 
              syncWithStripe={() => {}} 
              isLoading={false} 
            />
          </TabsContent>

          <TabsContent value="assinaturas" className="mt-6">
            <ActiveSubscriptionsList activeSubscriptions={mockActiveSubscriptions} />
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <PerformanceSummary stats={mockPerformanceStats} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminProdutosAssinaturas;
