
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

  // Memoize the admin check function with stable dependencies to prevent unnecessary calls
  const checkAdminStatus = useCallback(async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Erro ao verificar status de admin:', error);
        setIsAdmin(false);
      } else {
        console.log('User role:', data?.role);
        setIsAdmin(data?.role === 'admin');
      }
    } catch (error) {
      console.error('Erro ao verificar status de admin:', error);
      setIsAdmin(false);
    } finally {
      setAdminLoading(false);
    }
  }, []); // Empty dependencies to ensure stable reference

  // Memoize setters to prevent useEffect re-execution
  const stableSetUser = useCallback((user: User | null) => {
    setUser(user);
  }, []);

  const stableSetSession = useCallback((session: Session | null) => {
    setSession(session);
  }, []);

  const stableSetIsAdmin = useCallback((isAdmin: boolean) => {
    setIsAdmin(isAdmin);
  }, []);

  const stableSetAdminLoading = useCallback((loading: boolean) => {
    setAdminLoading(loading);
  }, []);

  const stableSetLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  return {
    user,
    setUser: stableSetUser,
    session,
    setSession: stableSetSession,
    loading,
    setLoading: stableSetLoading,
    isAdmin,
    setIsAdmin: stableSetIsAdmin,
    adminLoading,
    setAdminLoading: stableSetAdminLoading,
    initializedRef,
    checkAdminStatus
  };
};
