
import { useState, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminLoading, setAdminLoading] = useState<boolean>(true);
  const initializedRef = useRef(false);

  // Função completamente estável para verificar admin
  const checkAdminStatus = useCallback(async (userId: string) => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erro verificando admin:', error);
        setIsAdmin(false);
      } else {
        const adminStatus = data?.role === 'admin';
        console.log('Status admin:', adminStatus);
        setIsAdmin(adminStatus);
      }
    } catch (error) {
      console.error('Exceção verificando admin:', error);
      setIsAdmin(false);
    }
  }, []); // SEM DEPENDÊNCIAS - completamente estável

  return {
    user,
    setUser,
    session,
    setSession,
    loading,
    setLoading,
    isAdmin,
    setIsAdmin,
    adminLoading,
    setAdminLoading,
    initializedRef,
    checkAdminStatus
  };
};
