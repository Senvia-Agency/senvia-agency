import { ReactNode } from 'react';
import { AuthProvider as AuthProviderContext } from '@/contexts/AuthContext';

interface Props {
  children: ReactNode;
}

const AuthProviderWrapper = ({ children }: Props) => {
  return <AuthProviderContext>{children}</AuthProviderContext>;
};

export default AuthProviderWrapper;
