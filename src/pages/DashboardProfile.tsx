
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DashboardProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    date_of_birth: ''
  });
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    document.title = "Perfil | SENVIA";
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email, date_of_birth')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || user.email || '',
          date_of_birth: data.date_of_birth || ''
        });
      } else {
        // Se não existir perfil, usar dados do usuário
        setProfile({
          full_name: user.user_metadata?.full_name || '',
          email: user.email || '',
          date_of_birth: user.user_metadata?.date_of_birth || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o perfil.",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: profile.full_name,
          email: user.email, // Sempre usar o email do auth.users
          date_of_birth: profile.date_of_birth || null
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.newPassword
      });

      if (error) throw error;

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso."
      });

      setPasswords({
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar a senha.",
        variant: "destructive"
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Perfil</h1>
              <p className="text-muted-foreground">
                Gerencie suas informações pessoais
              </p>
            </div>

            {/* Informações Pessoais */}
            <Card className="bg-card/50 border-senvia-500/20">
              <CardHeader>
                <CardTitle className="text-white">Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-white">Nome Completo</Label>
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                    className="bg-background border-senvia-500/20 text-white"
                    placeholder="Digite seu nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_birth" className="text-white">Data de Nascimento</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={profile.date_of_birth}
                    onChange={(e) => setProfile(prev => ({ ...prev, date_of_birth: e.target.value }))}
                    className="bg-background border-senvia-500/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    className="bg-background border-senvia-500/20 text-white"
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">
                    Para alterar seu email, entre em contato conosco
                  </p>
                </div>

                <Button 
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-senvia-500 hover:bg-senvia-600 text-white"
                >
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </CardContent>
            </Card>

            {/* Alterar Senha */}
            <Card className="bg-card/50 border-senvia-500/20">
              <CardHeader>
                <CardTitle className="text-white">Alterar Senha</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new_password" className="text-white">Nova Senha</Label>
                  <Input
                    id="new_password"
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="bg-background border-senvia-500/20 text-white"
                    placeholder="Digite sua nova senha"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password" className="text-white">Confirmar Nova Senha</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="bg-background border-senvia-500/20 text-white"
                    placeholder="Confirme sua nova senha"
                  />
                </div>

                <Button 
                  onClick={handlePasswordChange}
                  disabled={passwordLoading || !passwords.newPassword || !passwords.confirmPassword}
                  className="bg-senvia-500 hover:bg-senvia-600 text-white"
                >
                  {passwordLoading ? "Alterando..." : "Alterar Senha"}
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

export default DashboardProfile;
