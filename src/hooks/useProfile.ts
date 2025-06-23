
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  full_name: string;
  email: string;
  date_of_birth: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    email: '',
    date_of_birth: ''
  });

  useEffect(() => {
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

  return { profile, setProfile };
};
