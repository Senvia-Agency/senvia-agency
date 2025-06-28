
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuthActions = () => {
  // Memoize auth functions to prevent unnecessary re-renders
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
      } else {
        console.log('Sign in successful');
      }
      
      return { error };
    } catch (error) {
      console.error('Erro no signIn:', error);
      return { error };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, metadata?: { full_name: string; date_of_birth: string }) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata ? {
            full_name: metadata.full_name,
            date_of_birth: metadata.date_of_birth
          } : undefined
        }
      });
      return { error };
    } catch (error) {
      console.error('Erro no signUp:', error);
      return { error };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log('Signing out...');
      localStorage.removeItem('admin-active-section'); // Limpar seção ativa ao sair
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro no signOut:', error);
    }
  }, []);

  return {
    signIn,
    signUp,
    signOut
  };
};
