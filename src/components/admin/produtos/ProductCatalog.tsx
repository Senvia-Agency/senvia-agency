
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Eye, RefreshCw, Users, CreditCard, TrendingUp, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ProductDetailModal from "./ProductDetailModal";
import ProductActionsButtons from "./ProductActionsButtons";
import CreateProductModal from "./CreateProductModal";

interface ProductCatalogProps {
  products: any[];
  productsLoading: boolean;
  syncWithStripe: () => void;
  isLoading: boolean;
}

const ProductCatalog = ({ products, productsLoading, syncWithStripe, isLoading }: ProductCatalogProps) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const getProductIcon = (category: string) => {
    const iconMap: { [key: string]: any } = {
      'assistant': Users,
      'landing_pages': Package,
      'websites': CreditCard,
      'ecommerce': TrendingUp
    };
    const Icon = iconMap[category] || Package;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <>
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Package className="h-5 w-5 text-senvia-500" />
              Catálogo de Produtos (Sincronizados do Stripe)
            </CardTitle>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-senvia-500 hover:bg-senvia-400 text-slate-900"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Produto
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {productsLoading ? (
            <div className="text-center py-8 text-slate-400">
              Carregando produtos...
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="bg-slate-700/70 border-slate-600/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-senvia-500/20 rounded-lg">
                          {getProductIcon(product.category)}
                        </div>
                        <div>
                          <CardTitle className="text-lg text-slate-100">{product.name}</CardTitle>
                          <p className="text-sm text-slate-400 capitalize">{product.category.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <Badge variant={product.active ? "default" : "secondary"} className={product.active ? "bg-green-500/20 text-green-400 border-green-500/50" : ""}>
                        {product.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-300 text-sm line-clamp-2">
                      {product.description || 'Sem descrição disponível'}
                    </p>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-slate-300">Planos Disponíveis:</h4>
                      <div className="space-y-1">
                        {product.product_plans?.slice(0, 3).map((plan: any) => (
                          <div key={plan.id} className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">{plan.name}</span>
                            <span className="text-senvia-400 font-medium">
                              €{plan.price_monthly || plan.price_yearly || 0}
                              {plan.price_monthly ? '/mês' : plan.price_yearly ? '/ano' : ''}
                            </span>
                          </div>
                        ))}
                        {product.product_plans?.length > 3 && (
                          <div className="text-xs text-slate-500">
                            +{product.product_plans.length - 3} mais planos
                          </div>
                        )}
                      </div>
                    </div>

                    {product.stripe_product_id && (
                      <div className="pt-2 border-t border-slate-600/50">
                        <div className="text-xs text-slate-500">
                          Stripe ID: {product.stripe_product_id}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                            onClick={() => setSelectedItem(product)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </DialogTrigger>
                        <ProductDetailModal selectedItem={selectedItem} />
                      </Dialog>
                      
                      <ProductActionsButtons 
                        product={product} 
                        onUpdate={syncWithStripe}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-200 mb-2">Nenhum produto encontrado</h3>
              <p className="text-slate-400 mb-4">Crie seu primeiro produto ou sincronize com o Stripe.</p>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-senvia-500 hover:bg-senvia-400 text-slate-900"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Produto
                </Button>
                <Button 
                  onClick={syncWithStripe}
                  disabled={isLoading}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-600/50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sincronizar Stripe
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={syncWithStripe}
      />
    </>
  );
};

export default ProductCatalog;
