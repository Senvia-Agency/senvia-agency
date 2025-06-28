
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
    // Evitar reinicialização quando a aba volta ao foco
    if (initializedRef.current) return;

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
          
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user && event !== 'TOKEN_REFRESHED') {
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
          
          if (event === 'SIGNED_OUT') {
            setUser(null);
            setSession(null);
            setIsAdmin(false);
            setAdminLoading(false);
            initializedRef.current = false;
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

    initializeAuth();

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.data?.subscription?.unsubscribe();
      }
    };
  }, [checkAdminStatus, initializedRef, setSession, setUser, setIsAdmin, setAdminLoading, setLoading]);

  // Listener para detectar mudanças de visibilidade da aba
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && initializedRef.current) {
        // Quando a aba volta ao foco, não reinicializar tudo, apenas verificar se ainda há sessão válida
        console.log('Tab became visible, checking session validity...');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [initializedRef]);
};
