import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, ExternalLink, Info, Webhook, Zap, Plus, Trash2, TestTube } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  created_at: string;
}

const AVAILABLE_EVENTS = {
  "Leads": [
    { key: "lead.created", label: "Lead Criado", description: "Quando um novo lead se cadastra" },
    { key: "lead.updated", label: "Lead Atualizado", description: "Quando dados do lead são modificados" },
    { key: "lead.converted", label: "Lead Convertido", description: "Quando lead vira cliente" },
    { key: "lead.payment_received", label: "Pagamento de Lead", description: "Quando lead efetua pagamento" },
  ],
  "Clientes": [
    { key: "customer.created", label: "Cliente Criado", description: "Novo cliente adicionado" },
    { key: "customer.updated", label: "Cliente Atualizado", description: "Dados do cliente modificados" },
    { key: "customer.deleted", label: "Cliente Removido", description: "Cliente removido do sistema" },
  ],
  "Vendas": [
    { key: "sale.created", label: "Venda Criada", description: "Nova venda registrada" },
    { key: "sale.updated", label: "Venda Atualizada", description: "Status ou dados da venda alterados" },
    { key: "sale.completed", label: "Venda Concluída", description: "Venda finalizada com sucesso" },
    { key: "sale.cancelled", label: "Venda Cancelada", description: "Venda cancelada" },
    { key: "sale.payment_received", label: "Pagamento Recebido", description: "Pagamento da venda confirmado" },
  ],
  "Transações": [
    { key: "transaction.created", label: "Transação Criada", description: "Nova transação registrada" },
    { key: "transaction.completed", label: "Transação Concluída", description: "Transação processada com sucesso" },
    { key: "transaction.failed", label: "Transação Falhou", description: "Erro no processamento da transação" },
  ],
  "Produtos": [
    { key: "product.created", label: "Produto Criado", description: "Novo produto adicionado" },
    { key: "product.updated", label: "Produto Atualizado", description: "Produto modificado" },
    { key: "product.deleted", label: "Produto Removido", description: "Produto removido do catálogo" },
  ],
  "Assinaturas": [
    { key: "subscription.created", label: "Assinatura Criada", description: "Nova assinatura ativada" },
    { key: "subscription.updated", label: "Assinatura Atualizada", description: "Assinatura modificada" },
    { key: "subscription.cancelled", label: "Assinatura Cancelada", description: "Assinatura cancelada" },
    { key: "subscription.renewed", label: "Assinatura Renovada", description: "Assinatura renovada automaticamente" },
  ],
  "Financeiro": [
    { key: "financial_movement.created", label: "Movimento Financeiro", description: "Novo lançamento financeiro" },
    { key: "financial_movement.updated", label: "Movimento Atualizado", description: "Lançamento financeiro modificado" },
  ],
  "Marketing": [
    { key: "marketing_report.created", label: "Relatório Criado", description: "Novo relatório de marketing" },
    { key: "marketing_report.updated", label: "Relatório Atualizado", description: "Relatório de marketing modificado" },
  ]
};

const WebhookSetup = () => {
  const { toast } = useToast();
  const [webhookUrl] = useState("https://rvrulhbgkdvnrkhzibif.supabase.co/functions/v1/stripe-webhook");
  const [customWebhooks, setCustomWebhooks] = useState<WebhookConfig[]>([]);
  const [zapierUrl, setZapierUrl] = useState("");
  const [newWebhookName, setNewWebhookName] = useState("");
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    try {
      const { data } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('settings_key', 'custom_webhooks')
        .single();

      if (data?.settings_value) {
        setCustomWebhooks(data.settings_value as WebhookConfig[]);
      }
    } catch (error) {
      console.log('No webhooks found yet');
    }
  };

  const saveWebhooks = async (webhooks: WebhookConfig[]) => {
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          admin_user_id: (await supabase.auth.getUser()).data.user?.id,
          settings_key: 'custom_webhooks',
          settings_value: webhooks
        });

      if (error) throw error;
      setCustomWebhooks(webhooks);
    } catch (error) {
      console.error('Error saving webhooks:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar os webhooks.",
        variant: "destructive"
      });
    }
  };

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

  const addCustomWebhook = async () => {
    if (!newWebhookName || !newWebhookUrl) {
      toast({
        title: "Erro",
        description: "Nome e URL são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (selectedEvents.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um evento.",
        variant: "destructive"
      });
      return;
    }

    const newWebhook: WebhookConfig = {
      id: crypto.randomUUID(),
      name: newWebhookName,
      url: newWebhookUrl,
      events: selectedEvents,
      active: true,
      created_at: new Date().toISOString()
    };

    const updatedWebhooks = [...customWebhooks, newWebhook];
    await saveWebhooks(updatedWebhooks);

    setNewWebhookName("");
    setNewWebhookUrl("");
    setSelectedEvents([]);

    toast({
      title: "Webhook adicionado",
      description: "Webhook personalizado criado com sucesso.",
    });
  };

  const removeWebhook = async (id: string) => {
    const updatedWebhooks = customWebhooks.filter(w => w.id !== id);
    await saveWebhooks(updatedWebhooks);

    toast({
      title: "Webhook removido",
      description: "Webhook removido com sucesso.",
    });
  };

  const toggleWebhook = async (id: string, active: boolean) => {
    const updatedWebhooks = customWebhooks.map(w => 
      w.id === id ? { ...w, active } : w
    );
    await saveWebhooks(updatedWebhooks);
  };

  const toggleEvent = (eventKey: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventKey) 
        ? prev.filter(e => e !== eventKey)
        : [...prev, eventKey]
    );
  };

  const selectAllEventsInCategory = (category: string) => {
    const categoryEvents = AVAILABLE_EVENTS[category as keyof typeof AVAILABLE_EVENTS].map(e => e.key);
    setSelectedEvents(prev => {
      const otherEvents = prev.filter(e => !categoryEvents.includes(e));
      return [...otherEvents, ...categoryEvents];
    });
  };

  const deselectAllEventsInCategory = (category: string) => {
    const categoryEvents = AVAILABLE_EVENTS[category as keyof typeof AVAILABLE_EVENTS].map(e => e.key);
    setSelectedEvents(prev => prev.filter(e => !categoryEvents.includes(e)));
  };

  const testWebhook = async (url: string, name: string) => {
    setLoading(true);
    try {
      const testData = {
        test: true,
        timestamp: new Date().toISOString(),
        webhook_name: name,
        triggered_from: "admin_panel"
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(testData),
      });

      toast({
        title: "Teste enviado",
        description: `Dados de teste enviados para ${name}. Verifique se foi recebido corretamente.`,
      });
    } catch (error) {
      console.error("Error testing webhook:", error);
      toast({
        title: "Erro no teste",
        description: "Falha ao testar o webhook.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerZapier = async () => {
    if (!zapierUrl) {
      toast({
        title: "Erro",
        description: "Digite a URL do webhook do Zapier.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const zapData = {
        timestamp: new Date().toISOString(),
        triggered_from: window.location.origin,
        action: "manual_trigger",
        user_id: (await supabase.auth.getUser()).data.user?.id
      };

      await fetch(zapierUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(zapData),
      });

      toast({
        title: "Zapier acionado",
        description: "Requisição enviada para o Zapier. Verifique o histórico do seu Zap.",
      });
    } catch (error) {
      console.error("Error triggering Zapier:", error);
      toast({
        title: "Erro",
        description: "Falha ao acionar o Zapier.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="stripe" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="stripe" className="data-[state=active]:bg-senvia-500">
            <Webhook className="h-4 w-4 mr-2" />
            Stripe
          </TabsTrigger>
          <TabsTrigger value="custom" className="data-[state=active]:bg-senvia-500">
            <Plus className="h-4 w-4 mr-2" />
            Personalizados
          </TabsTrigger>
          <TabsTrigger value="zapier" className="data-[state=active]:bg-senvia-500">
            <Zap className="h-4 w-4 mr-2" />
            Zapier
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stripe">
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
        </TabsContent>

        <TabsContent value="custom">
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-500" />
                  Adicionar Webhook Personalizado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="webhook-name">Nome do Webhook</Label>
                    <Input
                      id="webhook-name"
                      value={newWebhookName}
                      onChange={(e) => setNewWebhookName(e.target.value)}
                      placeholder="Ex: Notificação Slack"
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="webhook-url">URL do Webhook</Label>
                    <Input
                      id="webhook-url"
                      value={newWebhookUrl}
                      onChange={(e) => setNewWebhookUrl(e.target.value)}
                      placeholder="https://hooks.slack.com/..."
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Eventos Disponíveis</Label>
                  <div className="mt-3 space-y-4 max-h-96 overflow-y-auto border border-gray-600 rounded p-4 bg-gray-700">
                    {Object.entries(AVAILABLE_EVENTS).map(([category, events]) => {
                      const categoryEvents = events.map(e => e.key);
                      const selectedInCategory = selectedEvents.filter(e => categoryEvents.includes(e)).length;
                      const allSelected = selectedInCategory === categoryEvents.length;
                      const someSelected = selectedInCategory > 0 && selectedInCategory < categoryEvents.length;

                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-white flex items-center gap-2">
                              {category}
                              <Badge variant="secondary" className="text-xs">
                                {selectedInCategory}/{categoryEvents.length}
                              </Badge>
                            </h4>
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => selectAllEventsInCategory(category)}
                                className="text-xs h-6 px-2"
                              >
                                Todos
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => deselectAllEventsInCategory(category)}
                                className="text-xs h-6 px-2"
                              >
                                Nenhum
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-2 pl-4">
                            {events.map((event) => (
                              <div key={event.key} className="flex items-start space-x-2">
                                <Checkbox
                                  id={event.key}
                                  checked={selectedEvents.includes(event.key)}
                                  onCheckedChange={() => toggleEvent(event.key)}
                                  className="mt-1"
                                />
                                <div className="space-y-1">
                                  <Label 
                                    htmlFor={event.key} 
                                    className="text-sm font-medium text-white cursor-pointer"
                                  >
                                    {event.label}
                                  </Label>
                                  <p className="text-xs text-gray-400">{event.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {selectedEvents.length > 0 && (
                    <div className="mt-3">
                      <Label className="text-sm text-gray-400">Eventos Selecionados ({selectedEvents.length}):</Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedEvents.map((eventKey) => {
                          const event = Object.values(AVAILABLE_EVENTS)
                            .flat()
                            .find(e => e.key === eventKey);
                          return (
                            <Badge key={eventKey} variant="secondary" className="text-xs">
                              {event?.label || eventKey}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <Button onClick={addCustomWebhook} className="w-full bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Webhook
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Webhooks Configurados</CardTitle>
              </CardHeader>
              <CardContent>
                {customWebhooks.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Webhook className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum webhook personalizado configurado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customWebhooks.map((webhook) => (
                      <div key={webhook.id} className="bg-gray-700 p-4 rounded border border-gray-600">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-white">{webhook.name}</h4>
                            <p className="text-sm text-gray-400 break-all">{webhook.url}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={webhook.active}
                              onCheckedChange={(checked) => toggleWebhook(webhook.id, checked)}
                            />
                            <Button
                              onClick={() => testWebhook(webhook.url, webhook.name)}
                              variant="outline"
                              size="sm"
                              disabled={loading}
                              className="border-gray-600"
                            >
                              <TestTube className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => removeWebhook(webhook.id)}
                              variant="outline"
                              size="sm"
                              className="border-red-600 text-red-400 hover:bg-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {webhook.events.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {webhook.events.map((eventKey) => {
                              const event = Object.values(AVAILABLE_EVENTS)
                                .flat()
                                .find(e => e.key === eventKey);
                              return (
                                <Badge key={eventKey} variant="secondary" className="text-xs">
                                  {event?.label || eventKey}
                                </Badge>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="zapier">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                Integração com Zapier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-orange-500/10 border-orange-500/20">
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  Conecte com o Zapier para automatizar ações baseadas nos eventos da plataforma.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="zapier-url">URL do Webhook do Zapier</Label>
                <Input
                  id="zapier-url"
                  value={zapierUrl}
                  onChange={(e) => setZapierUrl(e.target.value)}
                  placeholder="Cole aqui a URL do webhook do seu Zap"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <Button
                onClick={triggerZapier}
                disabled={loading || !zapierUrl}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                {loading ? 'Acionando...' : 'Testar Zapier'}
              </Button>

              <div className="space-y-3">
                <h4 className="font-medium text-white">Como configurar:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                  <li>Acesse <a href="https://zapier.com" target="_blank" className="text-orange-400 underline">zapier.com</a> e crie uma conta</li>
                  <li>Crie um novo Zap</li>
                  <li>Escolha "Webhooks by Zapier" como trigger</li>
                  <li>Selecione "Catch Hook"</li>
                  <li>Copie a URL fornecida pelo Zapier</li>
                  <li>Cole a URL no campo acima</li>
                  <li>Configure as ações que deseja automatizar</li>
                  <li>Teste usando o botão "Testar Zapier"</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebhookSetup;