
import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
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
  
  // Use refs to track current state and prevent unnecessary updates
  const currentUserRef = useRef<User | null>(null);
  const currentSessionRef = useRef<Session | null>(null);
  const isInitializedRef = useRef(false);

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
      currentUserRef.current = null;
      currentSessionRef.current = null;
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro no signOut:', error);
    }
  };

  const checkAdminStatus = async (userId: string) => {
    // Cache admin status in localStorage to avoid repeated queries
    const cachedStatus = localStorage.getItem(`admin_status_${userId}`);
    const cacheExpiry = localStorage.getItem(`admin_status_expiry_${userId}`);
    
    if (cachedStatus && cacheExpiry && Date.now() < parseInt(cacheExpiry)) {
      setIsAdmin(cachedStatus === 'true');
      setAdminLoading(false);
      return;
    }
    
    setAdminLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      const isAdminUser = data?.role === 'admin';
      setIsAdmin(isAdminUser);
      
      // Cache for 1 hour
      localStorage.setItem(`admin_status_${userId}`, isAdminUser.toString());
      localStorage.setItem(`admin_status_expiry_${userId}`, (Date.now() + 3600000).toString());
      
    } catch (error) {
      console.error('Admin check exception:', error);
      setIsAdmin(false);
    } finally {
      setAdminLoading(false);
    }
  };

  // Helper function to check if session/user actually changed
  const hasSessionChanged = (newSession: Session | null): boolean => {
    const oldSession = currentSessionRef.current;
    const newUser = newSession?.user;
    const oldUser = currentUserRef.current;
    
    // If both are null, no change
    if (!newSession && !oldSession) return false;
    
    // If one is null and other isn't, it's a change
    if ((!newSession && oldSession) || (newSession && !oldSession)) return true;
    
    // If user IDs are different, it's a change
    if (newUser?.id !== oldUser?.id) return true;
    
    // If access tokens are different, it's a significant change
    if (newSession?.access_token !== oldSession?.access_token) {
      // But ignore token refresh events (same user, new token)
      if (newUser?.id === oldUser?.id) {
        console.log('Token refreshed for same user, ignoring');
        return false;
      }
      return true;
    }
    
    return false;
  };

  useEffect(() => {
    console.log('AuthProvider: Initializing...');

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('Initial session:', !!session, error);
      
      if (hasSessionChanged(session)) {
        currentSessionRef.current = session;
        currentUserRef.current = session?.user ?? null;
        setSession(session);
        setUser(session?.user ?? null);
      }
      
      setLoading(false);
      isInitializedRef.current = true;
      
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
        
        // Ignore token refresh events completely
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed, ignoring to prevent re-renders');
          return;
        }

        // Only process significant auth state changes after initialization
        if (!isInitializedRef.current && event !== 'INITIAL_SESSION') {
          console.log('Not yet initialized, ignoring event:', event);
          return;
        }

        // Check if this is actually a meaningful session change
        if (!hasSessionChanged(session)) {
          console.log('No meaningful session change detected, ignoring');
          return;
        }

        console.log('Processing auth state change:', event);
        
        // Update refs first
        currentSessionRef.current = session;
        currentUserRef.current = session?.user ?? null;
        
        // Update state
        setSession(session);
        setUser(session?.user ?? null);

        if (event === 'SIGNED_OUT' || !session?.user) {
          setIsAdmin(false);
          setAdminLoading(false);
        } else if (session?.user) {
          checkAdminStatus(session.user.id);
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
