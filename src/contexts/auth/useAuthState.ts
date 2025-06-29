
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

  // Create a completely stable admin check function
  const checkAdminStatus = useCallback(async (userId: string) => {
    if (!userId) {
      console.log('No userId provided for admin check');
      setIsAdmin(false);
      return;
    }

    try {
      console.log('Checking admin status for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        const isUserAdmin = data?.role === 'admin';
        console.log('Admin check result:', isUserAdmin);
        setIsAdmin(isUserAdmin);
      }
    } catch (error) {
      console.error('Exception in admin check:', error);
      setIsAdmin(false);
    }
  }, []); // Completely stable - no dependencies

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
