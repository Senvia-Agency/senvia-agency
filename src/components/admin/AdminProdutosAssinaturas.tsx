
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  Users, 
  TrendingUp, 
  DollarSign,
  Plus,
  Settings,
  Eye
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCustomServices } from "@/hooks/useCustomServices";
import ProductCatalog from "./produtos/ProductCatalog";
import CreateCustomServiceModal from "./produtos/CreateCustomServiceModal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminProdutosAssinaturas = () => {
  const { toast } = useToast();
  const [isCreateServiceModalOpen, setIsCreateServiceModalOpen] = useState(false);

  // Buscar produtos do Stripe
  const { data: products, refetch: refetchProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['stripe-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_plans (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Buscar serviços personalizados
  const { data: customServices, isLoading: servicesLoading } = useCustomServices();

  // Sincronizar com Stripe
  const syncWithStripe = useCallback(async () => {
    try {
      const response = await fetch('/api/stripe/sync-products', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Erro ao sincronizar com Stripe');
      }
      
      await refetchProducts();
      
      toast({
        title: "Sincronização concluída",
        description: "Produtos sincronizados com o Stripe com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar com o Stripe.",
        variant: "destructive",
      });
    }
  }, [refetchProducts, toast]);

  // Calcular estatísticas
  const totalProducts = (products?.length || 0) + (customServices?.length || 0);
  const activeProducts = (products?.filter(p => p.active).length || 0) + 
                       (customServices?.filter(s => s.status === 'active').length || 0);
  const totalStripeProducts = products?.length || 0;
  const totalCustomServices = customServices?.length || 0;

  if (productsLoading || servicesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold whitespace-nowrap">Produtos & Assinaturas</h1>
        </div>
        <div className="text-center py-8 text-gray-400">
          Carregando produtos e serviços...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 whitespace-nowrap">Produtos & Assinaturas</h1>
          <p className="text-gray-400 text-sm sm:text-base">Gerencie produtos do Stripe e serviços personalizados</p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalProducts}</div>
            <p className="text-xs text-gray-400">
              {activeProducts} ativos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Produtos Stripe</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{totalStripeProducts}</div>
            <p className="text-xs text-gray-400">
              sincronizados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Serviços Personalizados</CardTitle>
            <Settings className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-senvia-500">{totalCustomServices}</div>
            <p className="text-xs text-gray-400">
              criados manualmente
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Receita Produtos</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">€0</div>
            <p className="text-xs text-gray-400">
              último mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Produtos do Stripe */}
      <ProductCatalog
        products={products || []}
        productsLoading={productsLoading}
        syncWithStripe={syncWithStripe}
        isLoading={false}
      />

      {/* Serviços Personalizados */}
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <CardTitle className="flex items-center gap-2 text-slate-100 text-base sm:text-lg">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-senvia-500 flex-shrink-0" />
              <span className="line-clamp-2 sm:line-clamp-1">Serviços Personalizados</span>
            </CardTitle>
            <Button
              onClick={() => setIsCreateServiceModalOpen(true)}
              className="w-full sm:w-auto bg-senvia-500 hover:bg-senvia-400 text-slate-900 text-sm sm:text-base"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Novo Serviço
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {customServices && customServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {customServices.map((service) => (
                <Card key={service.id} className="bg-slate-700/70 border-slate-600/50">
                  <CardHeader className="pb-3 px-4 sm:px-6">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-2 bg-senvia-500/20 rounded-lg flex-shrink-0">
                          <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-sm sm:text-lg text-slate-100 line-clamp-2">{service.name}</CardTitle>
                          <p className="text-xs sm:text-sm text-slate-400 capitalize truncate">{service.category.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <Badge variant={service.status === 'active' ? "default" : "secondary"} className={`${service.status === 'active' ? "bg-green-500/20 text-green-400 border-green-500/50" : ""} text-xs whitespace-nowrap`}>
                        {service.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 px-4 sm:px-6">
                    <p className="text-slate-300 text-xs sm:text-sm line-clamp-3">
                      {service.description || 'Sem descrição disponível'}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-slate-400">Preço Base:</span>
                        <span className="text-senvia-400 font-medium">€{service.base_price}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-slate-400">Tipo:</span>
                        <span className="text-slate-300 capitalize">{service.service_type.replace('_', ' ')}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-slate-400">Modelo:</span>
                        <span className="text-slate-300 capitalize">{service.pricing_model.replace('_', ' ')}</span>
                      </div>
                    </div>

                    {service.includes_features.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-medium text-slate-300">Inclui:</h4>
                        <div className="flex flex-wrap gap-1">
                          {service.includes_features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="border-slate-600 text-slate-400 text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {service.includes_features.length > 3 && (
                            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                              +{service.includes_features.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-600/50">
                      <div className="text-xs text-slate-500">
                        Criado em {format(new Date(service.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full sm:flex-1 border-slate-600 text-slate-300 hover:bg-slate-600/50 text-xs sm:text-sm"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Settings className="h-8 w-8 sm:h-12 sm:w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-slate-200 mb-2">Nenhum serviço personalizado</h3>
              <p className="text-slate-400 mb-4 text-sm sm:text-base">Crie seus próprios serviços que não dependem do Stripe.</p>
              <Button
                onClick={() => setIsCreateServiceModalOpen(true)}
                className="w-full sm:w-auto bg-senvia-500 hover:bg-senvia-400 text-slate-900 text-sm sm:text-base"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Criar Primeiro Serviço
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para criar serviço personalizado */}
      <CreateCustomServiceModal
        isOpen={isCreateServiceModalOpen}
        onClose={() => setIsCreateServiceModalOpen(false)}
      />
    </div>
  );
};

export default AdminProdutosAssinaturas;
