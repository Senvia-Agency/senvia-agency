
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Repeat, Settings, BarChart3 } from "lucide-react";
import ProductCatalog from "./produtos/ProductCatalog";
import ActiveSubscriptionsList from "./produtos/ActiveSubscriptionsList";
import PerformanceSummary from "./produtos/PerformanceSummary";
import ProductStatsCards from "./produtos/ProductStatsCards";

const AdminProdutosAssinaturas = () => {
  const [activeTab, setActiveTab] = useState("catalog");

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Produtos & Assinaturas</h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Gerencie o catálogo de produtos e acompanhe as assinaturas ativas
        </p>
      </div>

      {/* Stats Cards */}
      <ProductStatsCards />

      {/* Tabs para diferentes seções */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
          <TabsTrigger 
            value="catalog" 
            className="flex items-center gap-2 data-[state=active]:bg-gray-700"
          >
            <Package className="h-4 w-4" />
            Catálogo
          </TabsTrigger>
          <TabsTrigger 
            value="subscriptions" 
            className="flex items-center gap-2 data-[state=active]:bg-gray-700"
          >
            <Repeat className="h-4 w-4" />
            Assinaturas
          </TabsTrigger>
          <TabsTrigger 
            value="performance" 
            className="flex items-center gap-2 data-[state=active]:bg-gray-700"
          >
            <BarChart3 className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="flex items-center gap-2 data-[state=active]:bg-gray-700"
          >
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-6">
          <ProductCatalog />
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <ActiveSubscriptionsList />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceSummary />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="text-center py-12 text-gray-400">
            <Settings className="h-12 w-12 mx-auto mb-4" />
            <p>Configurações de produtos em desenvolvimento</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProdutosAssinaturas;
