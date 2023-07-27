import { Navigate, useLocation } from 'react-router';
import { useAccount } from '@gear-js/react-hooks';
import { ProtectedRouteProps } from './ProtectedRoute.interface';
import { useAuth } from '../../hooks';
import { LOGIN, NOT_AUTHORIZED } from '@/App.routes';

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { authToken } = useAuth();
  const { account } = useAccount();
  const location = useLocation();

  if (!authToken && account) {
    return <Navigate to={`/${NOT_AUTHORIZED}`} replace />;
  }

  if (!authToken && !account) {
    return <Navigate to={`/${LOGIN}`} state={{ from: location }} replace />;
  }

  return children;
}

export { ProtectedRoute };
