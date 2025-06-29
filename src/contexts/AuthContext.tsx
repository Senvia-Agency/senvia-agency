
import { createContext, useContext, useMemo, ReactNode } from 'react';
import { AuthContextType } from './auth/types';
import { useAuthState } from './auth/useAuthState';
import { useAuthActions } from './auth/useAuthActions';
import { useAuthInitialization } from './auth/useAuthInitialization';

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
  const {
    user,
    setUser,
    session,
    setSession,
    loading,
    setLoading,
    isAdmin,
    setIsAdmin,
    adminLoading,
    setAdminLoading,
    initializedRef,
    checkAdminStatus
  } = useAuthState();

  const { signIn, signUp, signOut } = useAuthActions();

  // Initialize auth - this will only run once due to empty dependencies
  useAuthInitialization({
    initializedRef,
    setSession,
    setUser,
    setIsAdmin,
    setAdminLoading,
    setLoading,
    checkAdminStatus
  });

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    session,
    isAdmin,
    adminLoading,
    signIn,
    signUp,
    signOut,
    loading,
  }), [user, session, isAdmin, adminLoading, signIn, signUp, signOut, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
