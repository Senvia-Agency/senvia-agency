
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
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
      return { error };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('admin-active-section');
      setIsAdmin(false);
      setAdminLoading(false);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro no signOut:', error);
    }
  };

  // Initialize auth state ONCE
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          // Check admin status ONLY if user exists
          if (session?.user) {
            setAdminLoading(true);
            
            // Simple admin check with timeout protection
            const adminCheck = setTimeout(() => {
              console.log('Admin check timeout, setting to false');
              setIsAdmin(false);
              setAdminLoading(false);
            }, 5000); // 5 second timeout
            
            try {
              const { data, error: adminError } = await supabase
                .from('profiles')
                .select('role')
                .eq('user_id', session.user.id)
                .single();

              clearTimeout(adminCheck);
              
              if (mounted) {
                if (adminError) {
                  console.error('Admin check error:', adminError);
                  setIsAdmin(false);
                } else {
                  setIsAdmin(data?.role === 'admin');
                }
                setAdminLoading(false);
              }
            } catch (error) {
              clearTimeout(adminCheck);
              if (mounted) {
                console.error('Admin check exception:', error);
                setIsAdmin(false);
                setAdminLoading(false);
              }
            }
          } else {
            setIsAdmin(false);
            setAdminLoading(false);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setAdminLoading(false);
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        // Handle different auth events
        if (event === 'SIGNED_OUT') {
          setIsAdmin(false);
          setAdminLoading(false);
          return;
        }

        // Only check admin on sign in, not on every event
        if (event === 'SIGNED_IN' && session?.user) {
          setAdminLoading(true);
          
          // Simple admin check with timeout
          const adminCheck = setTimeout(() => {
            console.log('Auth event admin check timeout');
            setIsAdmin(false);
            setAdminLoading(false);
          }, 3000);
          
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();

            clearTimeout(adminCheck);
            
            if (mounted) {
              if (error) {
                console.error('Auth event admin error:', error);
                setIsAdmin(false);
              } else {
                setIsAdmin(data?.role === 'admin');
              }
              setAdminLoading(false);
            }
          } catch (error) {
            clearTimeout(adminCheck);
            if (mounted) {
              console.error('Auth event admin exception:', error);
              setIsAdmin(false);
              setAdminLoading(false);
            }
          }
        } else if (!session?.user) {
          setIsAdmin(false);
          setAdminLoading(false);
        }
      }
    );

    // Initialize
    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array - run only once

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
