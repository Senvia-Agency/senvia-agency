
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
      console.log('AuthProvider: Signing out user');
      localStorage.removeItem('admin-active-section');
      setIsAdmin(false);
      setAdminLoading(false);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro no signOut:', error);
    }
  };

  const checkAdminStatus = async (userId: string) => {
    console.log('AuthProvider: Checking admin status for user:', userId);
    setAdminLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Admin check error:', error);
        setIsAdmin(false);
      } else {
        console.log('Admin check result:', data?.role);
        setIsAdmin(data?.role === 'admin');
      }
    } catch (error) {
      console.error('Admin check exception:', error);
      setIsAdmin(false);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Initializing...');

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('Initial session:', !!session, error);
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Only check admin status if user exists
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
        setAdminLoading(false);
      }
    });

    // Listen for auth changes with improved filtering
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, !!session);
        
        // Filter out events that don't require component re-renders
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed, ignoring to prevent re-renders');
          return;
        }

        // Only process significant auth state changes
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') {
          // Check if this is actually a state change by comparing session IDs
          const currentSessionId = session?.access_token;
          const previousSessionId = user?.aud; // Use a stable identifier
          
          // If it's the same session, ignore duplicate SIGNED_IN events
          if (event === 'SIGNED_IN' && currentSessionId && previousSessionId && session?.user?.id === user?.id) {
            console.log('Duplicate SIGNED_IN event ignored to prevent re-renders');
            return;
          }
          
          setSession(session);
          setUser(session?.user ?? null);

          if (event === 'SIGNED_OUT' || !session?.user) {
            setIsAdmin(false);
            setAdminLoading(false);
          } else if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
            // Only check admin status if it's truly a new session
            if (!user || user.id !== session.user.id) {
              checkAdminStatus(session.user.id);
            }
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array to prevent re-initialization

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
