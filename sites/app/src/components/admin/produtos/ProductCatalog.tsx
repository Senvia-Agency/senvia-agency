
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
    return <Icon className="h-4 w-4 sm:h-5 sm:w-5" />;
  };

  return (
    <>
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm">
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <CardTitle className="flex items-center gap-2 text-slate-100 text-base sm:text-lg">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 text-senvia-500 flex-shrink-0" />
              <span className="line-clamp-2 sm:line-clamp-1">Catálogo de Produtos (Sincronizados do Stripe)</span>
            </CardTitle>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto bg-senvia-500 hover:bg-senvia-400 text-slate-900 text-sm sm:text-base"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Criar Produto
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {productsLoading ? (
            <div className="text-center py-8 text-slate-400 text-sm sm:text-base">
              Carregando produtos...
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="bg-slate-700/70 border-slate-600/50">
                  <CardHeader className="pb-3 px-4 sm:px-6">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-2 bg-senvia-500/20 rounded-lg flex-shrink-0">
                          {getProductIcon(product.category)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-sm sm:text-lg text-slate-100 line-clamp-2">{product.name}</CardTitle>
                          <p className="text-xs sm:text-sm text-slate-400 capitalize truncate">{product.category.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <Badge variant={product.active ? "default" : "secondary"} className={`${product.active ? "bg-green-500/20 text-green-400 border-green-500/50" : ""} text-xs whitespace-nowrap`}>
                        {product.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 px-4 sm:px-6">
                    <p className="text-slate-300 text-xs sm:text-sm line-clamp-3">
                      {product.description || 'Sem descrição disponível'}
                    </p>

                    <div className="space-y-2">
                      <h4 className="text-xs sm:text-sm font-medium text-slate-300">Planos Disponíveis:</h4>
                      <div className="space-y-1">
                        {product.product_plans?.slice(0, 2).map((plan: any) => (
                          <div key={plan.id} className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-slate-400 truncate flex-1 mr-2">{plan.name}</span>
                            <span className="text-senvia-400 font-medium whitespace-nowrap">
                              €{plan.price_monthly || plan.price_yearly || 0}
                              {plan.price_monthly ? '/mês' : plan.price_yearly ? '/ano' : ''}
                            </span>
                          </div>
                        ))}
                        {product.product_plans?.length > 2 && (
                          <div className="text-xs text-slate-500">
                            +{product.product_plans.length - 2} mais planos
                          </div>
                        )}
                      </div>
                    </div>

                    {product.stripe_product_id && (
                      <div className="pt-2 border-t border-slate-600/50">
                        <div className="text-xs text-slate-500 truncate">
                          Stripe ID: {product.stripe_product_id}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full sm:flex-1 border-slate-600 text-slate-300 hover:bg-slate-600/50 text-xs sm:text-sm"
                            onClick={() => setSelectedItem(product)}
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </DialogTrigger>
                        <ProductDetailModal selectedItem={selectedItem} />
                      </Dialog>
                      
                      <div className="flex justify-center sm:justify-end">
                        <ProductActionsButtons 
                          product={product} 
                          onUpdate={syncWithStripe}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-8 w-8 sm:h-12 sm:w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-slate-200 mb-2">Nenhum produto encontrado</h3>
              <p className="text-slate-400 mb-4 text-sm sm:text-base">Crie seu primeiro produto ou sincronize com o Stripe.</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full sm:w-auto bg-senvia-500 hover:bg-senvia-400 text-slate-900 text-sm sm:text-base"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Criar Produto
                </Button>
                <Button 
                  onClick={syncWithStripe}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full sm:w-auto border-slate-600 text-slate-300 hover:bg-slate-600/50 text-sm sm:text-base"
                >
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
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
