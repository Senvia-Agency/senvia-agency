
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
  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    let subscription: any;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (isMounted) {
          console.log('Initial session:', initialSession?.user?.id);
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            setAdminLoading(true);
            await checkAdminStatus(initialSession.user.id);
          } else {
            setIsAdmin(false);
            setAdminLoading(false);
          }
          
          setLoading(false);
          initializedRef.current = true;
        }

        // Set up auth state listener
        subscription = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          console.log('Auth state change:', event, currentSession?.user?.id);
          
          if (!isMounted) return;
          
          // Only update state if it's not just a token refresh
          if (event !== 'TOKEN_REFRESHED') {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            
            if (currentSession?.user) {
              setAdminLoading(true);
              // Use setTimeout to prevent blocking the auth state change
              setTimeout(async () => {
                if (isMounted) {
                  await checkAdminStatus(currentSession.user.id);
                }
              }, 100);
            } else if (!currentSession?.user) {
              setIsAdmin(false);
              setAdminLoading(false);
            }
          }
          
          if (event === 'SIGNED_OUT') {
            setUser(null);
            setSession(null);
            setIsAdmin(false);
            setAdminLoading(false);
            initializedRef.current = false;
            // Clear all localStorage data on sign out
            localStorage.removeItem('admin-active-section');
            localStorage.removeItem('admin-leads-filters');
          }
        });
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error);
        if (isMounted) {
          setLoading(false);
          setAdminLoading(false);
          initializedRef.current = true;
        }
      }
    };

    // Only initialize if not already initialized
    if (!initializedRef.current) {
      initializeAuth();
    }

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.data?.subscription?.unsubscribe();
      }
    };
  }, [checkAdminStatus, initializedRef, setSession, setUser, setIsAdmin, setAdminLoading, setLoading]);

  // REMOVIDO: Não precisamos mais dos listeners de visibilitychange e focus
  // que estavam causando recarregamentos desnecessários
};
