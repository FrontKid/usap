import { FC, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '@/shared/hooks';

type AuthGuardProps = {
  children: ReactElement;
};

const AdminGuard: FC<AuthGuardProps> = ({ children }) => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export { AdminGuard };
