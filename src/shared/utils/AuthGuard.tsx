import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '@/shared/hooks';

type AuthGuardProps = {
  children: ReactElement;
};

function AuthGuard({ children }: AuthGuardProps) {
  const { isAuth } = useAuth();

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return children;
}

export { AuthGuard };
