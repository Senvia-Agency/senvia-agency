
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileData {
  full_name: string;
  email: string;
  date_of_birth: string;
}

interface ProfileFormProps {
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
}

const ProfileForm = ({ profile, setProfile }: ProfileFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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

  return (
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
  );
};

export default ProfileForm;
