
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
    return <Icon className="h-4 w-4 lg:h-5 lg:w-5" />;
  };

  return (
    <>
      <Card className="bg-slate-800/80 border-slate-600/50 backdrop-blur-sm w-full overflow-hidden">
        <CardHeader className="p-4 lg:p-5">
          <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="flex items-center gap-2 text-slate-100 text-base lg:text-lg">
              <Package className="h-5 w-5 text-senvia-500 flex-shrink-0" />
              <span className="truncate">Catálogo de Produtos</span>
            </CardTitle>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-senvia-500 hover:bg-senvia-400 text-slate-900 text-sm h-9 px-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Criar Produto</span>
              <span className="sm:hidden">Criar</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 lg:p-5 pt-0">
          {productsLoading ? (
            <div className="text-center py-8 text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-senvia-500 mx-auto mb-4"></div>
              <p className="text-sm">Carregando produtos...</p>
            </div>
          ) : products && products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id} className="bg-slate-700/70 border-slate-600/50 overflow-hidden">
                  <CardHeader className="p-4 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-2 bg-senvia-500/20 rounded-lg flex-shrink-0">
                          {getProductIcon(product.category)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-base lg:text-lg text-slate-100 truncate">
                            {product.name}
                          </CardTitle>
                          <p className="text-sm text-slate-400 capitalize truncate">
                            {product.category.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={product.active ? "default" : "secondary"} 
                        className={`${product.active ? "bg-green-500/20 text-green-400 border-green-500/50" : ""} text-xs flex-shrink-0`}
                      >
                        {product.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <p className="text-slate-300 text-sm line-clamp-2">
                      {product.description || 'Sem descrição disponível'}
                    </p>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-slate-300">Planos:</h4>
                      <div className="space-y-1">
                        {product.product_plans?.slice(0, 2).map((plan: any) => (
                          <div key={plan.id} className="flex justify-between items-center text-sm">
                            <span className="text-slate-400 truncate flex-1 mr-2">{plan.name}</span>
                            <span className="text-senvia-400 font-medium flex-shrink-0">
                              €{plan.price_monthly || plan.price_yearly || 0}
                              {plan.price_monthly ? '/mês' : plan.price_yearly ? '/ano' : ''}
                            </span>
                          </div>
                        ))}
                        {product.product_plans?.length > 2 && (
                          <div className="text-xs text-slate-500">
                            +{product.product_plans.length - 2} mais
                          </div>
                        )}
                      </div>
                    </div>

                    {product.stripe_product_id && (
                      <div className="pt-2 border-t border-slate-600/50">
                        <div className="text-xs text-slate-500 truncate">
                          Stripe: {product.stripe_product_id}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-600/50 text-sm h-9"
                            onClick={() => setSelectedItem(product)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Ver Detalhes</span>
                            <span className="sm:hidden">Ver</span>
                          </Button>
                        </DialogTrigger>
                        <ProductDetailModal selectedItem={selectedItem} />
                      </Dialog>
                      
                      <div className="flex-shrink-0">
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
              <Package className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-200 mb-2">Nenhum produto encontrado</h3>
              <p className="text-sm text-slate-400 mb-4">Crie seu primeiro produto ou sincronize com o Stripe.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-senvia-500 hover:bg-senvia-400 text-slate-900 text-sm h-9"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Produto
                </Button>
                <Button 
                  onClick={syncWithStripe}
                  disabled={isLoading}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-600/50 text-sm h-9"
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
