
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ExternalLink } from "lucide-react";

interface ActiveSubscriptionsProps {
  subscriptions: any[];
}

const ActiveSubscriptions = ({ subscriptions }: ActiveSubscriptionsProps) => {
  return (
    <Card className="bg-card/50 border-senvia-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Package className="w-5 h-5" />
          Assinaturas Ativas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {subscriptions.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              Você não possui assinaturas ativas no momento.
            </p>
            <Button 
              onClick={() => window.location.href = '/dashboard/products'}
              className="bg-white text-black hover:bg-gray-200"
            >
              Ver Produtos Disponíveis
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="border border-senvia-500/20 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white">
                    {subscription.products?.name || 'Produto'}
                  </h4>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">
                    Ativo
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {subscription.product_plans?.name || 'Plano'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Próxima cobrança: {subscription.next_billing_date 
                      ? new Date(subscription.next_billing_date).toLocaleDateString('pt-PT')
                      : 'N/A'
                    }
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-white text-black border-white hover:bg-gray-200"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Gerenciar
                  </Button>
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
