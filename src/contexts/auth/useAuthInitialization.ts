
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseAuthInitializationProps {
  initializedRef: React.MutableRefObject<boolean>;
  setSession: (session: any) => void;
  setUser: (user: any) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setAdminLoading: (loading: boolean) => void;
  setLoading: (loading: boolean) => void;
  checkAdminStatus: (userId: string) => Promise<void>;
}

export const useAuthInitialization = ({
  initializedRef,
  setSession,
  setUser,
  setIsAdmin,
  setAdminLoading,
  setLoading,
  checkAdminStatus
}: UseAuthInitializationProps) => {
  useEffect(() => {
    // Prevent multiple initializations
    if (initializedRef.current) {
      console.log('Auth already initialized, skipping...');
      return;
    }

    let isMounted = true;
    let subscription: any;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        setLoading(true);
        
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          throw error;
        }
        
        console.log('Initial session found:', !!initialSession, 'User ID:', initialSession?.user?.id);

        if (!isMounted) return;

        // Handle initial session
        if (initialSession?.user) {
          console.log('Valid session found, setting up user state');
          setSession(initialSession);
          setUser(initialSession.user);
          setAdminLoading(true);
          await checkAdminStatus(initialSession.user.id);
        } else {
          console.log('No valid session found, clearing state');
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setAdminLoading(false);
        }

        // Set up auth state listener
        subscription = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          console.log('[Auth Event]', event, 'User:', currentSession?.user?.id);
          
          if (!isMounted) return;
          
          // Tratar SIGNED_IN e TOKEN_REFRESHED da mesma forma
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (currentSession?.user) {
              setSession(currentSession);
              setUser(currentSession.user);
              
              // Sempre verificar admin status e desativar loading depois
              setAdminLoading(true);
              try {
                await checkAdminStatus(currentSession.user.id);
              } finally {
                setAdminLoading(false);
              }
            }
          } else if (event === 'SIGNED_OUT') {
            console.log('User signed out, clearing state');
            setSession(null);
            setUser(null);
            setIsAdmin(false);
            setAdminLoading(false);
            initializedRef.current = false;
            // Clear localStorage on sign out
            localStorage.removeItem('admin-active-section');
            localStorage.removeItem('admin-leads-filters');
          }
        });

        // Mark as initialized only after successful setup
        initializedRef.current = true;
        
      } catch (error) {
        console.error('Error in auth initialization:', error);
        if (isMounted) {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setAdminLoading(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      console.log('Cleaning up auth initialization');
      isMounted = false;
      if (subscription) {
        subscription.data?.subscription?.unsubscribe();
      }
    };
  }, [setSession, setUser, setIsAdmin, setAdminLoading, setLoading, checkAdminStatus, initializedRef]);
};
