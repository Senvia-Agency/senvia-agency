
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

interface ProductCardProps {
  product: any;
  hasSubscription?: boolean;
}

const ProductCard = ({ product, hasSubscription }: ProductCardProps) => {
  const features = product.features || {};
  const plans = product.product_plans || [];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'assistant':
        return '🤖';
      case 'landing_pages':
        return '📄';
      case 'websites':
        return '🌐';
      case 'ecommerce':
        return '🛒';
      default:
        return '📦';
    }
  };

  const handleSubscribe = (plan: any) => {
    if (plan.stripe_price_id_monthly) {
      window.open(plan.stripe_price_id_monthly, '_blank');
    }
  };

  return (
    <Card className="relative bg-card/50 border-senvia-500/20">
      {hasSubscription && (
        <div className="absolute top-4 right-4">
          <Badge variant="default" className="bg-green-500">
            <Check className="w-3 h-3 mr-1" />
            Ativo
          </Badge>
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getCategoryIcon(product.category)}</span>
          <div>
            <CardTitle className="text-lg text-white">{product.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Features */}
          <div>
            <h4 className="font-medium mb-2 text-white">Funcionalidades:</h4>
            <div className="space-y-1">
              {Object.entries(features).slice(0, 3).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 text-sm">
                  <Check className="w-3 h-3 text-green-500" />
                  <span className="capitalize text-gray-300">{key.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plans */}
          <div>
            <h4 className="font-medium mb-2 text-white">Planos disponíveis:</h4>
            <div className="space-y-2">
              {plans.slice(0, 2).map((plan: any) => (
                <div key={plan.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">{plan.name}</span>
                  <span className="font-medium text-white">
                    €{plan.price_monthly?.toFixed(2)}/mês
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            {hasSubscription ? (
              <Button variant="outline" className="w-full">
                Gerenciar Assinatura
              </Button>
            ) : (
              <Button 
                className="w-full bg-senvia-500 hover:bg-senvia-600"
                onClick={() => handleSubscribe(plans[0])}
              >
                Assinar Agora
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
