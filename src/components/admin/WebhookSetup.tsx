
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, ExternalLink, Info } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const WebhookSetup = () => {
  const { toast } = useToast();
  const [webhookUrl] = useState("https://rvrulhbgkdvnrkhzibif.supabase.co/functions/v1/stripe-webhook");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "URL copiada para a área de transferência",
    });
  };

  const openStripeWebhooks = () => {
    window.open("https://dashboard.stripe.com/webhooks", "_blank");
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          Configuração do Webhook Stripe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-blue-500/10 border-blue-500/20">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Para sincronização automática dos pagamentos, configure este webhook no seu painel do Stripe.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="webhook-url">URL do Webhook:</Label>
          <div className="flex gap-2">
            <Input
              id="webhook-url"
              value={webhookUrl}
              readOnly
              className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
            />
            <Button
              onClick={() => copyToClipboard(webhookUrl)}
              variant="outline"
              size="sm"
              className="border-gray-600"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Eventos para escutar:</Label>
          <div className="bg-gray-700 p-3 rounded border border-gray-600">
            <code className="text-sm text-green-400">checkout.session.completed</code>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-white">Passos para configurar:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
            <li>Abra o painel do Stripe</li>
            <li>Vá para "Developers" → "Webhooks"</li>
            <li>Clique em "Add endpoint"</li>
            <li>Cole a URL do webhook acima</li>
            <li>Selecione o evento: <code className="bg-gray-700 px-1 rounded">checkout.session.completed</code></li>
            <li>Clique em "Add endpoint"</li>
            <li>Copie o "Signing secret" e adicione como STRIPE_WEBHOOK_SECRET nas configurações do Supabase</li>
          </ol>
        </div>

        <Button
          onClick={openStripeWebhooks}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Abrir Painel do Stripe - Webhooks
        </Button>

        <Alert className="bg-yellow-500/10 border-yellow-500/20">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Importante:</strong> Após configurar o webhook no Stripe, você precisa adicionar o 
            STRIPE_WEBHOOK_SECRET nas configurações de secrets do Supabase Edge Functions.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default WebhookSetup;
