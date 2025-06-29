
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
  // Initialize auth state - só executa uma vez
  useEffect(() => {
    // Se já foi inicializado, não fazer nada
    if (initializedRef.current) {
      return;
    }

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
          initializedRef.current = true; // Marcar como inicializado
        }

        // Set up auth state listener
        subscription = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          console.log('Auth state change:', event, currentSession?.user?.id);
          
          if (!isMounted) return;
          
          // Só processar eventos importantes, não TOKEN_REFRESHED
          if (event === 'TOKEN_REFRESHED') {
            return;
          }
          
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            setAdminLoading(true);
            await checkAdminStatus(currentSession.user.id);
          } else if (event === 'SIGNED_OUT') {
            setIsAdmin(false);
            setAdminLoading(false);
            initializedRef.current = false;
            // Clear localStorage on sign out
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

    initializeAuth();

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.data?.subscription?.unsubscribe();
      }
    };
  }, []); // Dependências vazias - só executa uma vez
};
