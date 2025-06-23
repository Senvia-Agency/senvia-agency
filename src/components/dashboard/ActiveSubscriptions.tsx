
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Package, ArrowRight } from "lucide-react";

interface ActiveSubscriptionsProps {
  subscriptions: any[];
}

const ActiveSubscriptions = ({ subscriptions }: ActiveSubscriptionsProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Assinaturas Ativas
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/dashboard/subscriptions')}
        >
          Ver todas <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        {subscriptions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma assinatura ativa</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/dashboard/products')}
            >
              Explorar Produtos
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.slice(0, 3).map((subscription) => (
              <div
                key={subscription.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{subscription.products?.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Plano {subscription.product_plans?.name}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1">
                    {subscription.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    €{subscription.product_plans?.price_monthly}/mês
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveSubscriptions;
