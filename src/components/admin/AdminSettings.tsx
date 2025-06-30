
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, Database, Webhook } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WebhookSetup from "./WebhookSetup";

const AdminSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "SENVIA",
    siteDescription: "Soluções digitais para o seu negócio",
    contactEmail: "admin@senvia.pt",
    supportEmail: "suporte@senvia.pt",
    companyAddress: "Lisboa, Portugal",
    systemSettings: {
      autoSync: true,
      emailNotifications: true,
      backupFrequency: "daily"
    }
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configurações salvas",
        description: "As configurações foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Configurações do Sistema</h1>
          <p className="text-gray-400">Gerencie as configurações gerais da plataforma</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="general" className="data-[state=active]:bg-senvia-500">
            <Settings className="h-4 w-4 mr-2" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="data-[state=active]:bg-senvia-500">
            <Webhook className="h-4 w-4 mr-2" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="database" className="data-[state=active]:bg-senvia-500">
            <Database className="h-4 w-4 mr-2" />
            Banco de Dados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Nome do Site</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="siteDescription">Descrição</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="contactEmail">Email de Contato</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="supportEmail">Email de Suporte</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="companyAddress">Endereço da Empresa</Label>
                  <Textarea
                    id="companyAddress"
                    value={settings.companyAddress}
                    onChange={(e) => setSettings({...settings, companyAddress: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Sincronização Automática</Label>
                    <input
                      type="checkbox"
                      checked={settings.systemSettings.autoSync}
                      onChange={(e) => setSettings({
                        ...settings,
                        systemSettings: {
                          ...settings.systemSettings,
                          autoSync: e.target.checked
                        }
                      })}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Notificações por Email</Label>
                    <input
                      type="checkbox"
                      checked={settings.systemSettings.emailNotifications}
                      onChange={(e) => setSettings({
                        ...settings,
                        systemSettings: {
                          ...settings.systemSettings,
                          emailNotifications: e.target.checked
                        }
                      })}
                      className="rounded"
                    />
                  </div>

                  <div>
                    <Label htmlFor="backupFreq">Frequência de Backup</Label>
                    <select
                      id="backupFreq"
                      value={settings.systemSettings.backupFrequency}
                      onChange={(e) => setSettings({
                        ...settings,
                        systemSettings: {
                          ...settings.systemSettings,
                          backupFrequency: e.target.value
                        }
                      })}
                      className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="hourly">A cada hora</option>
                      <option value="daily">Diariamente</option>
                      <option value="weekly">Semanalmente</option>
                      <option value="monthly">Mensalmente</option>
                    </select>
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full bg-senvia-500 hover:bg-senvia-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="webhooks">
          <WebhookSetup />
        </TabsContent>

        <TabsContent value="database">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Manutenção do Banco de Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                Ferramentas para manutenção e otimização do banco de dados.
              </p>
              <div className="space-y-3">
                <Button variant="outline" className="w-full border-gray-600">
                  <Database className="h-4 w-4 mr-2" />
                  Verificar Integridade dos Dados
                </Button>
                <Button variant="outline" className="w-full border-gray-600">
                  <Database className="h-4 w-4 mr-2" />
                  Otimizar Tabelas
                </Button>
                <Button variant="outline" className="w-full border-gray-600">
                  <Database className="h-4 w-4 mr-2" />
                  Limpar Logs Antigos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
