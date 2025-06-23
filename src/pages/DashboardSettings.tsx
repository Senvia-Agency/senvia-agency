
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DashboardSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    email_notifications: true,
    billing_notifications: true,
    product_updates: true
  });

  useEffect(() => {
    document.title = "Configurações | SENVIA";
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('customer_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setSettings({
          email_notifications: data.email_notifications,
          billing_notifications: data.billing_notifications,
          product_updates: data.product_updates
        });
      }
    } catch (error) {
      console.log('Settings not found, using defaults');
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('customer_settings')
        .upsert({
          user_id: user.id,
          email_notifications: settings.email_notifications,
          billing_notifications: settings.billing_notifications,
          product_updates: settings.product_updates
        });

      if (error) throw error;

      toast({
        title: "Configurações salvas",
        description: "Suas preferências foram atualizadas com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Configurações</h1>
              <p className="text-muted-foreground">
                Personalize suas preferências da conta
              </p>
            </div>

            <Card className="bg-card/50 border-senvia-500/20">
              <CardHeader>
                <CardTitle className="text-white">Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white">Notificações por email</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba atualizações importantes por email
                    </p>
                  </div>
                  <Switch
                    checked={settings.email_notifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, email_notifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white">Notificações de cobrança</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba lembretes sobre pagamentos e faturas
                    </p>
                  </div>
                  <Switch
                    checked={settings.billing_notifications}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, billing_notifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white">Atualizações de produtos</Label>
                    <p className="text-sm text-muted-foreground">
                      Seja notificado sobre novos recursos e produtos
                    </p>
                  </div>
                  <Switch
                    checked={settings.product_updates}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, product_updates: checked }))
                    }
                  />
                </div>

                <Button 
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-senvia-500 hover:bg-senvia-600"
                >
                  {loading ? "Salvando..." : "Salvar Configurações"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardSettings;
