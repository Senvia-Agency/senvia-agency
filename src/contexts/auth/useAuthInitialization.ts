
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
    if (initializedRef.current) {
      console.log('Auth já inicializado, ignorando...');
      return;
    }

    console.log('=== INICIANDO AUTH INITIALIZATION ===');
    let mounted = true;
    
    const initialize = async () => {
      try {
        setLoading(true);
        
        // Buscar sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (session?.user) {
          console.log('Sessão encontrada:', session.user.id);
          setSession(session);
          setUser(session.user);
          setAdminLoading(true);
          await checkAdminStatus(session.user.id);
          setAdminLoading(false);
        } else {
          console.log('Sem sessão');
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setAdminLoading(false);
        }
        
        initializedRef.current = true;
        
      } catch (error) {
        console.error('Erro na inicialização:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setAdminLoading(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Configurar listener UMA VEZ
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (!mounted) return;
        
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setAdminLoading(false);
          initializedRef.current = false;
          return;
        }
        
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          setSession(session);
          setUser(session.user);
          setAdminLoading(true);
          try {
            await checkAdminStatus(session.user.id);
          } catch (error) {
            console.error('Erro verificando admin:', error);
            setIsAdmin(false);
          }
          setAdminLoading(false);
        }
      }
    );

    // Executar inicialização
    initialize();

    return () => {
      console.log('Cleanup auth initialization');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // VAZIO - executa apenas uma vez
};
