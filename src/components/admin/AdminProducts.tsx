
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getServiceTypeLabel } from "@/utils/saleStatusUtils";
import { 
  Plus, 
  Package, 
  Edit, 
  Eye, 
  Star,
  DollarSign,
  Users,
  Settings
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminProducts = () => {
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Buscar produtos
  const { data: products, refetch, isLoading } = useQuery({
    queryKey: ['admin-products'],
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

  // Buscar estatísticas de uso dos produtos
  const { data: productStats } = useQuery({
    queryKey: ['admin-product-stats'],
    queryFn: async () => {
      // Buscar dados de assinaturas
      const { data: subscriptions, error: subsError } = await supabase
        .from('customer_subscriptions')
        .select('product_id, status')
        .eq('status', 'active');

      // Buscar dados de pagamentos por produto (baseado no valor)
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('amount, status')
        .eq('status', 'paid');

      if (subsError || paymentsError) throw subsError || paymentsError;

      return {
        subscriptions: subscriptions || [],
        payments: payments || []
      };
    },
  });

  const getServiceIcon = (category: string) => {
    const iconMap: { [key: string]: any } = {
      'assistant': Users,
      'landing_pages': Package,
      'websites': Settings,
      'ecommerce': DollarSign
    };
    const Icon = iconMap[category] || Package;
    return <Icon className="h-5 w-5" />;
  };

  const getServiceStats = (category: string, plans: any[]) => {
    if (!productStats) return { activeSubscriptions: 0, totalRevenue: 0 };

    let activeSubscriptions = 0;
    let totalRevenue = 0;

    if (category === 'assistant') {
      // Contar assinaturas do Senvia Assistant baseadas no valor de €20
      totalRevenue = (productStats.payments.filter(p => p.amount === 2000).length * 20);
      activeSubscriptions = productStats.subscriptions.length;
    } else if (category === 'landing_pages') {
      // Contar vendas de landing pages baseadas no valor de €4.99
      totalRevenue = (productStats.payments.filter(p => p.amount === 499).length * 4.99);
      activeSubscriptions = productStats.payments.filter(p => p.amount === 499).length;
    }

    return { 
      activeSubscriptions: Math.round(activeSubscriptions),
      totalRevenue: Math.round(totalRevenue * 100) / 100
    };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestão de Produtos</h1>
        </div>
        <div className="text-center py-8 text-gray-400">
          Carregando produtos...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestão de Produtos</h1>
          <p className="text-gray-400">Gerencie todos os produtos e serviços da SENVIA</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-senvia-500 hover:bg-senvia-400 text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => {
          const stats = getServiceStats(product.category, product.product_plans);
          const isActive = product.status === 'active' && product.active;
          
          return (
            <Card key={product.id} className={`bg-gray-800 border-gray-700 ${!isActive ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-senvia-500/20 rounded-lg">
                      {getServiceIcon(product.category)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <p className="text-sm text-gray-400 capitalize">{product.category.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={isActive ? "default" : "secondary"}
                    className={isActive ? "bg-green-500 text-white" : ""}
                  >
                    {isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm line-clamp-2">
                  {product.description || 'Sem descrição disponível'}
                </p>

                {/* Product Plans */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Planos Disponíveis:</h4>
                  <div className="space-y-1">
                    {product.product_plans?.slice(0, 3).map((plan: any) => (
                      <div key={plan.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">{plan.name}</span>
                        <span className="text-senvia-500 font-medium">
                          €{plan.price_monthly}/mês
                        </span>
                      </div>
                    ))}
                    {product.product_plans?.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{product.product_plans.length - 3} mais planos
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-700">
                  <div>
                    <div className="text-lg font-bold text-blue-500">
                      {stats.activeSubscriptions}
                    </div>
                    <div className="text-xs text-gray-400">Clientes Ativos</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-500">
                      €{stats.totalRevenue}
                    </div>
                    <div className="text-xs text-gray-400">Receita Total</div>
                  </div>
                </div>

                {/* Service Type Badge */}
                {product.service_type && (
                  <Badge variant="outline" className="border-gray-600 text-gray-400">
                    {getServiceTypeLabel(product.service_type)}
                  </Badge>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">Detalhes do Produto</DialogTitle>
                      </DialogHeader>
                      
                      {selectedProduct && (
                        <div className="space-y-6">
                          {/* Basic Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-300">Nome</label>
                              <p className="text-sm text-gray-400">{selectedProduct.name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-300">Categoria</label>
                              <p className="text-sm text-gray-400 capitalize">
                                {selectedProduct.category.replace('_', ' ')}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-300">Status</label>
                              <p className="text-sm text-gray-400">
                                {selectedProduct.status === 'active' && selectedProduct.active ? 'Ativo' : 'Inativo'}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-300">Modelo de Preços</label>
                              <p className="text-sm text-gray-400 capitalize">
                                {selectedProduct.pricing_model}
                              </p>
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="text-sm font-medium text-gray-300">Descrição</label>
                            <p className="text-sm text-gray-400 mt-1">
                              {selectedProduct.description || 'Sem descrição disponível'}
                            </p>
                          </div>

                          {/* Features */}
                          {selectedProduct.features && (
                            <div>
                              <label className="text-sm font-medium text-gray-300">Funcionalidades</label>
                              <div className="mt-2 space-y-1">
                                {Object.entries(selectedProduct.features).map(([key, value]) => (
                                  <div key={key} className="flex justify-between text-sm">
                                    <span className="text-gray-400 capitalize">{key.replace('_', ' ')}</span>
                                    <span className="text-gray-300">
                                      {typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : String(value)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Plans */}
                          <div>
                            <label className="text-sm font-medium text-gray-300">Planos</label>
                            <div className="mt-2 space-y-2">
                              {selectedProduct.product_plans?.map((plan: any) => (
                                <Card key={plan.id} className="bg-gray-700 border-gray-600">
                                  <CardContent className="p-3">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="font-medium text-white">{plan.name}</h4>
                                        <p className="text-xs text-gray-400">{plan.description}</p>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-sm font-bold text-senvia-500">
                                          €{plan.price_monthly}/mês
                                        </div>
                                        {plan.price_yearly && (
                                          <div className="text-xs text-gray-400">
                                            €{plan.price_yearly}/ano
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>

                          {/* Metadata */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                            <div>
                              <label className="text-sm font-medium text-gray-300">Data de Criação</label>
                              <p className="text-sm text-gray-400">
                                {format(new Date(selectedProduct.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-300">Última Atualização</label>
                              <p className="text-sm text-gray-400">
                                {format(new Date(selectedProduct.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {(!products || products.length === 0) && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-400 mb-4">Comece criando seu primeiro produto ou serviço.</p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-senvia-500 hover:bg-senvia-400 text-black"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Produto
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-senvia-500" />
              Total de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-senvia-500">
              {products?.length || 0}
            </div>
            <div className="text-sm text-gray-400">
              {products?.filter(p => p.status === 'active' && p.active).length || 0} ativos
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-senvia-500" />
              Clientes Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {productStats ? (productStats.subscriptions.length + productStats.payments.filter(p => p.amount === 499).length) : 0}
            </div>
            <div className="text-sm text-gray-400">
              em todos os produtos
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-senvia-500" />
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              €{productStats ? Math.round(((productStats.payments.filter(p => p.amount === 499).length * 4.99) + (productStats.payments.filter(p => p.amount === 2000).length * 20)) * 100) / 100 : 0}
            </div>
            <div className="text-sm text-gray-400">
              receita acumulada
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProducts;
