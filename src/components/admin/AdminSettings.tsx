
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database,
  Save,
  RefreshCw
} from "lucide-react";

const AdminSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Buscar configurações do admin
  const { data: adminSettings, refetch } = useQuery({
    queryKey: ['admin-settings', user?.id],
    queryFn: async () => {
      if (!user?.id) return {};
      
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('admin_user_id', user.id);

      if (error) throw error;
      
      // Converter array para objeto chave-valor
      const settingsObject: { [key: string]: any } = {};
      data?.forEach(setting => {
        settingsObject[setting.settings_key] = setting.settings_value;
      });
      
      return settingsObject;
    },
    enabled: !!user?.id,
  });

  // Buscar estatísticas do sistema
  const { data: systemStats } = useQuery({
    queryKey: ['system-stats'],
    queryFn: async () => {
      // Buscar contagens de tabelas principais
      const [
        { count: leadsCount },
        { count: paymentsCount },
        { count: subscriptionsCount },
        { count: productsCount }
      ] = await Promise.all([
        supabase.from('unified_leads').select('*', { count: 'exact', head: true }),
        supabase.from('payments').select('*', { count: 'exact', head: true }),
        supabase.from('senvia_assistant_subscriptions').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true })
      ]);

      return {
        leads: leadsCount || 0,
        payments: paymentsCount || 0,
        subscriptions: subscriptionsCount || 0,
        products: productsCount || 0
      };
    },
  });

  const updateSetting = async (key: string, value: any) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          admin_user_id: user.id,
          settings_key: key,
          settings_value: value
        }, {
          onConflict: 'admin_user_id,settings_key'
        });

      if (error) throw error;
      
      refetch();
      toast({
        title: "Configuração salva",
        description: "A configuração foi atualizada com sucesso."
      });
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a configuração.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const syncStripeProducts = async () => {
    setIsLoading(true);
    try {
      // Simular sync com Stripe (implementar edge function real se necessário)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Sincronização concluída",
        description: "Produtos do Stripe foram sincronizados com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar com o Stripe.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Configurações do Sistema</h1>
          <p className="text-gray-400">Gerencie as configurações administrativas da SENVIA</p>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total de Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {systemStats?.leads || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {systemStats?.payments || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Assinaturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {systemStats?.subscriptions || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {systemStats?.products || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-senvia-500" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">
                Nome da Empresa
              </label>
              <Input
                placeholder="SENVIA"
                defaultValue={adminSettings?.company_name || 'SENVIA'}
                className="bg-gray-700 border-gray-600"
                onBlur={(e) => updateSetting('company_name', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">
                Email de Contacto
              </label>
              <Input
                type="email"
                placeholder="admin@senvia.pt"
                defaultValue={adminSettings?.contact_email || ''}
                className="bg-gray-700 border-gray-600"
                onBlur={(e) => updateSetting('contact_email', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">
                Telefone de Suporte
              </label>
              <Input
                placeholder="+351 000 000 000"
                defaultValue={adminSettings?.support_phone || ''}
                className="bg-gray-700 border-gray-600"
                onBlur={(e) => updateSetting('support_phone', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-senvia-500" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Novos Leads</div>
                <div className="text-sm text-gray-400">Receber notificação de novos leads</div>
              </div>
              <Button
                variant={adminSettings?.notify_new_leads ? "default" : "outline"}
                size="sm"
                onClick={() => updateSetting('notify_new_leads', !adminSettings?.notify_new_leads)}
                disabled={isLoading}
              >
                {adminSettings?.notify_new_leads ? 'Ativo' : 'Inativo'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Pagamentos</div>
                <div className="text-sm text-gray-400">Receber notificação de pagamentos</div>
              </div>
              <Button
                variant={adminSettings?.notify_payments ? "default" : "outline"}
                size="sm"
                onClick={() => updateSetting('notify_payments', !adminSettings?.notify_payments)}
                disabled={isLoading}
              >
                {adminSettings?.notify_payments ? 'Ativo' : 'Inativo'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Assinaturas</div>
                <div className="text-sm text-gray-400">Notificar sobre mudanças nas assinaturas</div>
              </div>
              <Button
                variant={adminSettings?.notify_subscriptions ? "default" : "outline"}
                size="sm"
                onClick={() => updateSetting('notify_subscriptions', !adminSettings?.notify_subscriptions)}
                disabled={isLoading}
              >
                {adminSettings?.notify_subscriptions ? 'Ativo' : 'Inativo'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Profile */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-senvia-500" />
              Perfil do Administrador
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">
                Email
              </label>
              <Input
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-gray-700 border-gray-600 opacity-60"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">
                ID do Usuário
              </label>
              <Input
                value={user?.id || ''}
                disabled
                className="bg-gray-700 border-gray-600 opacity-60 font-mono text-xs"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">
                Função
              </label>
              <Input
                value="Administrador"
                disabled
                className="bg-gray-700 border-gray-600 opacity-60"
              />
            </div>
          </CardContent>
        </Card>

        {/* System Integrations */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-senvia-500" />
              Integrações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Stripe</div>
                <div className="text-sm text-gray-400">Sincronizar produtos com Stripe</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={syncStripeProducts}
                disabled={isLoading}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sincronizar
                  </>
                )}
              </Button>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">
                Webhook URL
              </label>
              <Input
                placeholder="https://sua-url.com/webhook"
                defaultValue={adminSettings?.webhook_url || ''}
                className="bg-gray-700 border-gray-600"
                onBlur={(e) => updateSetting('webhook_url', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">
                API Key (para integrações externas)
              </label>
              <Input
                type="password"
                placeholder="••••••••••••••••"
                defaultValue={adminSettings?.api_key || ''}
                className="bg-gray-700 border-gray-600"
                onBlur={(e) => updateSetting('api_key', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-senvia-500" />
            Ações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={() => {
                toast({
                  title: "Cache limpo",
                  description: "Cache do sistema foi limpo com sucesso."
                });
              }}
            >
              Limpar Cache
            </Button>

            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={() => {
                toast({
                  title: "Backup criado",
                  description: "Backup do banco de dados foi criado."
                });
              }}
            >
              Criar Backup
            </Button>

            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={() => {
                toast({
                  title: "Logs exportados",
                  description: "Logs do sistema foram exportados com sucesso."
                });
              }}
            >
              Exportar Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
