
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
    // Prevent multiple initializations with a more robust check
    if (initializedRef.current) {
      console.log('Auth already initialized, skipping...');
      return;
    }

    console.log('Starting auth initialization...');
    let isMounted = true;
    let subscription: any;

    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          throw error;
        }
        
        console.log('Session check complete. Has user:', !!initialSession?.user);

        if (!isMounted) return;

        // Handle initial session - simplified logic
        if (initialSession?.user) {
          console.log('Setting up authenticated user');
          setSession(initialSession);
          setUser(initialSession.user);
          
          // Check admin status
          setAdminLoading(true);
          try {
            await checkAdminStatus(initialSession.user.id);
          } catch (adminError) {
            console.error('Error checking admin status:', adminError);
            setIsAdmin(false);
          } finally {
            setAdminLoading(false);
          }
        } else {
          console.log('No session found, clearing state');
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setAdminLoading(false);
        }

        // Set up auth state listener - ONLY ONCE
        subscription = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          console.log('[Auth Event]', event, currentSession?.user?.id ? 'User logged in' : 'No user');
          
          if (!isMounted) return;
          
          switch (event) {
            case 'SIGNED_IN':
            case 'TOKEN_REFRESHED':
              if (currentSession?.user) {
                setSession(currentSession);
                setUser(currentSession.user);
                
                setAdminLoading(true);
                try {
                  await checkAdminStatus(currentSession.user.id);
                } catch (adminError) {
                  console.error('Error checking admin status:', adminError);
                  setIsAdmin(false);
                } finally {
                  setAdminLoading(false);
                }
              }
              break;
              
            case 'SIGNED_OUT':
              console.log('User signed out, clearing all state');
              setSession(null);
              setUser(null);
              setIsAdmin(false);
              setAdminLoading(false);
              // Reset initialization flag on sign out
              initializedRef.current = false;
              localStorage.removeItem('admin-active-section');
              localStorage.removeItem('admin-leads-filters');
              break;
          }
        });

        // Mark as initialized ONLY after successful setup
        initializedRef.current = true;
        console.log('Auth initialization completed successfully');
        
      } catch (error) {
        console.error('Auth initialization failed:', error);
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
      if (subscription?.data?.subscription?.unsubscribe) {
        subscription.data.subscription.unsubscribe();
      }
    };
  }, []); // EMPTY DEPENDENCIES - run only once
};
