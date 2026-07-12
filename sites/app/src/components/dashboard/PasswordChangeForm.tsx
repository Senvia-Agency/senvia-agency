
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PasswordChangeForm = () => {
  const { toast } = useToast();
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });

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
  );
};

export default PasswordChangeForm;
