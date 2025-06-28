
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  adminLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: { full_name: string; date_of_birth: string }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminLoading, setAdminLoading] = useState<boolean>(true);

  // Function to check admin status
  const checkAdminStatus = async (userId: string) => {
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
  };

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
        }

        // Set up auth state listener
        subscription = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          console.log('Auth state change:', event, currentSession?.user?.id);
          
          if (!isMounted) return;
          
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            setAdminLoading(true);
            // Check admin status with a slight delay to avoid blocking
            setTimeout(() => {
              if (isMounted) {
                checkAdminStatus(currentSession.user.id);
              }
            }, 100);
          } else {
            setIsAdmin(false);
            setAdminLoading(false);
          }
          
          if (event === 'SIGNED_OUT') {
            setUser(null);
            setSession(null);
            setIsAdmin(false);
            setAdminLoading(false);
          }
        });
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error);
        if (isMounted) {
          setLoading(false);
          setAdminLoading(false);
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
  }, []);

  const signIn = async (email: string, password: string) => {
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
  };

  const signUp = async (email: string, password: string, metadata?: { full_name: string; date_of_birth: string }) => {
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
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro no signOut:', error);
    }
  };

  const value = {
    user,
    session,
    isAdmin,
    adminLoading,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
