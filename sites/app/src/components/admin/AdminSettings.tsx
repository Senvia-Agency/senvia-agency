
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, Database, Webhook, HardDrive, BarChart3, Users, FileText, AlertTriangle, CheckCircle, Mail, Send } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WebhookSetup from "./WebhookSetup";
import { useDatabaseStats } from "@/hooks/useDatabaseStats";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { useNotifications } from "@/hooks/useNotifications";
import { supabase } from "@/integrations/supabase/client";

const AdminSettings = () => {
  const { toast } = useToast();
  const { data: dbStats, isLoading: dbStatsLoading } = useDatabaseStats();
  const { 
    getSetting, 
    getSettingsByType, 
    updateSetting, 
    updateMultipleSettings, 
    isUpdating, 
    isLoading: settingsLoading 
  } = useSystemSettings();
  
  const {
    notificationLogs,
    isLoading: notificationsLoading,
    sendTestNotification,
    isSendingTest,
    getStatusColor,
    getTypeIcon,
    getTypeName
  } = useNotifications();
  
  const [maintenanceLoading, setMaintenanceLoading] = useState<string | null>(null);
  const [localSettings, setLocalSettings] = useState({
    siteName: "",
    siteDescription: "",
    contactEmail: "",
    supportEmail: "",
    companyAddress: "",
    autoSync: false,
    emailNotifications: false,
    backupFrequency: "daily",
    maxUploadSize: 50,
    sessionTimeout: 30,
    apiRateLimit: 100,
    maintenanceMode: false,
    enableDebugLogs: false,
    themeMode: "auto",
    defaultLanguage: "pt",
    currency: "EUR"
  });

  // Sincronizar com dados do banco quando carregados
  useEffect(() => {
    if (!settingsLoading) {
      setLocalSettings({
        siteName: getSetting('site_name', 'SENVIA'),
        siteDescription: getSetting('site_description', 'Soluções digitais para o seu negócio'),
        contactEmail: getSetting('contact_email', 'admin@senvia.pt'),
        supportEmail: getSetting('support_email', 'suporte@senvia.pt'),
        companyAddress: getSetting('company_address', 'Lisboa, Portugal'),
        autoSync: getSetting('auto_sync', true),
        emailNotifications: getSetting('email_notifications', true),
        backupFrequency: getSetting('backup_frequency', 'daily'),
        maxUploadSize: getSetting('max_upload_size', 50),
        sessionTimeout: getSetting('session_timeout', 30),
        apiRateLimit: getSetting('api_rate_limit', 100),
        maintenanceMode: getSetting('maintenance_mode', false),
        enableDebugLogs: getSetting('enable_debug_logs', false),
        themeMode: getSetting('theme_mode', 'auto'),
        defaultLanguage: getSetting('default_language', 'pt'),
        currency: getSetting('currency', 'EUR')
      });
    }
  }, [settingsLoading, getSetting]);

  const handleSave = async () => {
    const updates = [
      { key: 'site_name', value: localSettings.siteName },
      { key: 'site_description', value: localSettings.siteDescription },
      { key: 'contact_email', value: localSettings.contactEmail },
      { key: 'support_email', value: localSettings.supportEmail },
      { key: 'company_address', value: localSettings.companyAddress },
      { key: 'auto_sync', value: localSettings.autoSync },
      { key: 'email_notifications', value: localSettings.emailNotifications },
      { key: 'backup_frequency', value: localSettings.backupFrequency },
      { key: 'max_upload_size', value: localSettings.maxUploadSize },
      { key: 'session_timeout', value: localSettings.sessionTimeout },
      { key: 'api_rate_limit', value: localSettings.apiRateLimit },
      { key: 'maintenance_mode', value: localSettings.maintenanceMode },
      { key: 'enable_debug_logs', value: localSettings.enableDebugLogs },
      { key: 'theme_mode', value: localSettings.themeMode },
      { key: 'default_language', value: localSettings.defaultLanguage },
      { key: 'currency', value: localSettings.currency }
    ];

    updateMultipleSettings(updates);
  };

  const handleMaintenanceAction = async (action: string, actionName: string) => {
    setMaintenanceLoading(action);
    try {
      const { data, error } = await supabase.functions.invoke('database-maintenance', {
        body: { action }
      });

      if (error) throw error;

      toast({
        title: `${actionName} Concluída`,
        description: data.message,
        variant: data.success ? "default" : "destructive"
      });

      // Show details if available
      if (data.details) {
        console.log(`${actionName} details:`, data.details);
      }

    } catch (error) {
      console.error(`Error in ${actionName}:`, error);
      toast({
        title: `Erro em ${actionName}`,
        description: "Não foi possível executar a operação de manutenção.",
        variant: "destructive"
      });
    } finally {
      setMaintenanceLoading(null);
    }
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Configurações do Sistema</h1>
        <p className="text-gray-400 text-sm sm:text-base">Gerencie as configurações gerais da plataforma</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="general" className="data-[state=active]:bg-senvia-500">
            <Settings className="h-4 w-4 mr-2" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-senvia-500">
            <Mail className="h-4 w-4 mr-2" />
            Notificações
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
          {settingsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-400">Carregando configurações...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informações da Empresa */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-500" />
                    Informações da Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="siteName">Nome do Site</Label>
                    <Input
                      id="siteName"
                      value={localSettings.siteName}
                      onChange={(e) => setLocalSettings({...localSettings, siteName: e.target.value})}
                      className="bg-gray-700 border-gray-600"
                      placeholder="Nome do site"
                    />
                  </div>

                  <div>
                    <Label htmlFor="siteDescription">Descrição</Label>
                    <Textarea
                      id="siteDescription"
                      value={localSettings.siteDescription}
                      onChange={(e) => setLocalSettings({...localSettings, siteDescription: e.target.value})}
                      className="bg-gray-700 border-gray-600"
                      rows={3}
                      placeholder="Descrição do site"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactEmail">Email de Contato</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={localSettings.contactEmail}
                      onChange={(e) => setLocalSettings({...localSettings, contactEmail: e.target.value})}
                      className="bg-gray-700 border-gray-600"
                      placeholder="contato@empresa.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="supportEmail">Email de Suporte</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={localSettings.supportEmail}
                      onChange={(e) => setLocalSettings({...localSettings, supportEmail: e.target.value})}
                      className="bg-gray-700 border-gray-600"
                      placeholder="suporte@empresa.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="companyAddress">Endereço da Empresa</Label>
                    <Textarea
                      id="companyAddress"
                      value={localSettings.companyAddress}
                      onChange={(e) => setLocalSettings({...localSettings, companyAddress: e.target.value})}
                      className="bg-gray-700 border-gray-600"
                      rows={2}
                      placeholder="Endereço completo da empresa"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Configurações do Sistema */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-green-500" />
                    Configurações do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sincronização Automática</Label>
                      <p className="text-xs text-gray-400">Sincronizar dados automaticamente</p>
                    </div>
                    <Switch
                      checked={localSettings.autoSync}
                      onCheckedChange={(checked) => setLocalSettings({...localSettings, autoSync: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificações por Email</Label>
                      <p className="text-xs text-gray-400">Receber notificações do sistema</p>
                    </div>
                    <Switch
                      checked={localSettings.emailNotifications}
                      onCheckedChange={(checked) => setLocalSettings({...localSettings, emailNotifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Modo de Manutenção</Label>
                      <p className="text-xs text-gray-400">Ativar modo de manutenção</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {localSettings.maintenanceMode && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                      <Switch
                        checked={localSettings.maintenanceMode}
                        onCheckedChange={(checked) => setLocalSettings({...localSettings, maintenanceMode: checked})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="backupFreq">Frequência de Backup</Label>
                    <Select 
                      value={localSettings.backupFrequency} 
                      onValueChange={(value) => setLocalSettings({...localSettings, backupFrequency: value})}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Selecione a frequência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">A cada hora</SelectItem>
                        <SelectItem value="daily">Diariamente</SelectItem>
                        <SelectItem value="weekly">Semanalmente</SelectItem>
                        <SelectItem value="monthly">Mensalmente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxUpload">Upload Máximo (MB)</Label>
                      <Input
                        id="maxUpload"
                        type="number"
                        value={localSettings.maxUploadSize}
                        onChange={(e) => setLocalSettings({...localSettings, maxUploadSize: parseInt(e.target.value)})}
                        className="bg-gray-700 border-gray-600"
                        min="1"
                        max="500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sessionTimeout">Timeout Sessão (min)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={localSettings.sessionTimeout}
                        onChange={(e) => setLocalSettings({...localSettings, sessionTimeout: parseInt(e.target.value)})}
                        className="bg-gray-700 border-gray-600"
                        min="5"
                        max="480"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="w-full bg-senvia-500 hover:bg-senvia-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isUpdating ? 'Salvando...' : 'Salvar Configurações'}
                  </Button>
                </CardContent>
              </Card>

              {/* Configurações de Interface */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-500" />
                    Interface e Localização
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="themeMode">Tema do Sistema</Label>
                    <Select 
                      value={localSettings.themeMode} 
                      onValueChange={(value) => setLocalSettings({...localSettings, themeMode: value})}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Selecione o tema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                        <SelectItem value="auto">Automático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="defaultLanguage">Idioma Padrão</Label>
                    <Select 
                      value={localSettings.defaultLanguage} 
                      onValueChange={(value) => setLocalSettings({...localSettings, defaultLanguage: value})}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Selecione o idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt">Português</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="currency">Moeda Padrão</Label>
                    <Select 
                      value={localSettings.currency} 
                      onValueChange={(value) => setLocalSettings({...localSettings, currency: value})}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Selecione a moeda" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="USD">Dólar ($)</SelectItem>
                        <SelectItem value="BRL">Real (R$)</SelectItem>
                        <SelectItem value="GBP">Libra (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Logs de Debug</Label>
                      <p className="text-xs text-gray-400">Ativar logs detalhados</p>
                    </div>
                    <Switch
                      checked={localSettings.enableDebugLogs}
                      onCheckedChange={(checked) => setLocalSettings({...localSettings, enableDebugLogs: checked})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Configurações Avançadas */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Configurações Avançadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="apiRateLimit">Limite de API (req/min)</Label>
                    <Input
                      id="apiRateLimit"
                      type="number"
                      value={localSettings.apiRateLimit}
                      onChange={(e) => setLocalSettings({...localSettings, apiRateLimit: parseInt(e.target.value)})}
                      className="bg-gray-700 border-gray-600"
                      min="10"
                      max="1000"
                    />
                    <p className="text-xs text-gray-400 mt-1">Limite de requests por minuto por usuário</p>
                  </div>

                  <div className="bg-yellow-900/20 border border-yellow-700 rounded p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-400">Status do Sistema</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">
                        {localSettings.maintenanceMode ? 'Modo de Manutenção Ativo' : 'Sistema Operacional'}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${localSettings.maintenanceMode ? 'bg-yellow-500' : 'bg-green-500'}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="notifications">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configurações de Email */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  Configurações de Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contact_email" className="text-sm font-medium text-gray-300">
                      Email de Contato (Notificações Gerais)
                    </Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={localSettings.contactEmail}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="admin@senvia.pt"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Este email receberá notificações sobre novos leads, vendas e pagamentos.
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="support_email" className="text-sm font-medium text-gray-300">
                      Email de Suporte (Erros do Sistema)
                    </Label>
                    <Input
                      id="support_email"
                      type="email"
                      value={localSettings.supportEmail}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                      placeholder="suporte@senvia.pt"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Este email receberá notificações sobre erros críticos do sistema.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="email_notifications"
                      checked={localSettings.emailNotifications}
                      onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                    <Label htmlFor="email_notifications" className="text-sm text-gray-300">
                      Ativar notificações por email
                    </Label>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-700 rounded p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-400">Status Atual</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    {localSettings.emailNotifications ? 
                      "✅ Notificações por email estão ativadas" : 
                      "❌ Notificações por email estão desativadas"
                    }
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Email principal: {localSettings.contactEmail || 'Não configurado'}
                  </div>
                  <div className="text-xs text-gray-400">
                    Email de suporte: {localSettings.supportEmail || 'Não configurado'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teste de Notificações */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-green-500" />
                  Teste de Notificações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-400">
                  Teste o sistema de notificações enviando emails de exemplo.
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendTestNotification('new_lead')}
                    disabled={isSendingTest || !localSettings.emailNotifications}
                    className="flex items-center gap-2"
                  >
                    🎯 Novo Lead
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendTestNotification('sale_completed')}
                    disabled={isSendingTest || !localSettings.emailNotifications}
                    className="flex items-center gap-2"
                  >
                    💰 Venda
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendTestNotification('payment_received')}
                    disabled={isSendingTest || !localSettings.emailNotifications}
                    className="flex items-center gap-2"
                  >
                    ✅ Pagamento
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendTestNotification('system_error')}
                    disabled={isSendingTest || !localSettings.emailNotifications}
                    className="flex items-center gap-2"
                  >
                    ⚠️ Erro
                  </Button>
                </div>

                {!localSettings.emailNotifications && (
                  <div className="bg-yellow-900/20 border border-yellow-700 rounded p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-yellow-400">
                        Ative as notificações por email nas configurações gerais
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Logs de Notificações */}
            <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" />
                  Histórico de Notificações
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notificationsLoading ? (
                  <div className="text-gray-400 text-center py-4">Carregando histórico...</div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notificationLogs && notificationLogs.length > 0 ? (
                      notificationLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{getTypeIcon(log.notification_type)}</span>
                            <div>
                              <div className="text-sm font-medium text-white">{getTypeName(log.notification_type)}</div>
                              <div className="text-xs text-gray-400">{log.subject}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-xs font-medium ${getStatusColor(log.status)}`}>
                              {log.status.toUpperCase()}
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(log.sent_at).toLocaleString('pt-PT')}
                            </div>
                            {log.error_message && (
                              <div className="text-xs text-red-400 mt-1 max-w-48 truncate">
                                {log.error_message}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Nenhuma notificação enviada ainda</p>
                        <p className="text-sm">Use os botões de teste acima para enviar sua primeira notificação</p>
                      </div>
                    )}
                  </div>
                )}
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
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 text-sm"
                    onClick={() => handleMaintenanceAction('integrity_check', 'Verificação de Integridade')}
                    disabled={maintenanceLoading === 'integrity_check'}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    {maintenanceLoading === 'integrity_check' ? 'Verificando...' : 'Verificar Integridade dos Dados'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 text-sm"
                    onClick={() => handleMaintenanceAction('performance_analysis', 'Análise de Performance')}
                    disabled={maintenanceLoading === 'performance_analysis'}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {maintenanceLoading === 'performance_analysis' ? 'Analisando...' : 'Analisar Performance'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 text-sm"
                    onClick={() => handleMaintenanceAction('storage_optimization', 'Otimização de Armazenamento')}
                    disabled={maintenanceLoading === 'storage_optimization'}
                  >
                    <HardDrive className="h-4 w-4 mr-2" />
                    {maintenanceLoading === 'storage_optimization' ? 'Otimizando...' : 'Otimizar Armazenamento'}
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
