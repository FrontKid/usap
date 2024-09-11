import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '@/shared/hooks';

type GuestGuardProps = {
  children: ReactElement;
};

function GuestGuard({ children }: GuestGuardProps) {
  const { isAuth } = useAuth();

  if (!isAuth) {
    return <Navigate to="/auth" />;
  }

  return children;
}

export { GuestGuard };
