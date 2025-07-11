
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, Database, Webhook, HardDrive, BarChart3, Users, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WebhookSetup from "./WebhookSetup";
import { useDatabaseStats } from "@/hooks/useDatabaseStats";

const AdminSettings = () => {
  const { toast } = useToast();
  const { data: dbStats, isLoading: dbStatsLoading } = useDatabaseStats();
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
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Configurações do Sistema</h1>
        <p className="text-gray-400 text-sm sm:text-base">Gerencie as configurações gerais da plataforma</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Estatísticas Gerais */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-blue-500" />
                  Estatísticas do Banco de Dados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dbStatsLoading ? (
                  <div className="text-gray-400">Carregando estatísticas...</div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 p-3 rounded">
                      <div className="text-xs text-gray-400">Tamanho Total</div>
                      <div className="text-lg font-bold text-blue-400">
                        {dbStats?.general?.database_size || 'N/A'}
                      </div>
                    </div>
                    <div className="bg-gray-700 p-3 rounded">
                      <div className="text-xs text-gray-400">Total de Tabelas</div>
                      <div className="text-lg font-bold text-green-400">
                        {dbStats?.general?.total_tables || 'N/A'}
                      </div>
                    </div>
                    <div className="bg-gray-700 p-3 rounded">
                      <div className="text-xs text-gray-400">Total de Registros</div>
                      <div className="text-lg font-bold text-purple-400">
                        {dbStats?.general?.total_records || 'N/A'}
                      </div>
                    </div>
                    <div className="bg-gray-700 p-3 rounded">
                      <div className="text-xs text-gray-400">Inserções</div>
                      <div className="text-lg font-bold text-orange-400">
                        {dbStats?.general?.total_inserts || 'N/A'}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Maiores Tabelas */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  Principais Tabelas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dbStatsLoading ? (
                  <div className="text-gray-400">Carregando tabelas...</div>
                ) : (
                  <div className="space-y-3">
                    {dbStats?.topTables?.slice(0, 6).map((table, index) => (
                      <div key={table.tablename} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-white">{table.tablename}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-300">{table.records} registros</div>
                          <div className="text-xs text-gray-500">{table.size}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manutenção */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-yellow-500" />
                  Manutenção do Banco
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4 text-sm">
                  Ferramentas para manutenção e otimização do banco de dados.
                </p>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full border-gray-600 text-sm">
                    <Database className="h-4 w-4 mr-2" />
                    Verificar Integridade dos Dados
                  </Button>
                  <Button variant="outline" className="w-full border-gray-600 text-sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analisar Performance
                  </Button>
                  <Button variant="outline" className="w-full border-gray-600 text-sm">
                    <HardDrive className="h-4 w-4 mr-2" />
                    Otimizar Armazenamento
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Atividade do Sistema */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Atividade do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dbStatsLoading ? (
                  <div className="text-gray-400">Carregando atividade...</div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Atualizações</span>
                      <span className="text-sm font-medium text-white">
                        {dbStats?.general?.total_updates || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Exclusões</span>
                      <span className="text-sm font-medium text-white">
                        {dbStats?.general?.total_deletes || 'N/A'}
                      </span>
                    </div>
                    <div className="bg-gray-700 p-3 rounded mt-3">
                      <div className="text-xs text-gray-400 mb-1">Status do Sistema</div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-400">Sistema Operacional</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
