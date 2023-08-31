import { useAccount } from '@gear-js/react-hooks';
import { Navigate } from 'react-router-dom';
import { LOGIN, PLAY } from '@/App.routes';
import { NotAuthorized } from '@/features/Auth/components';
import { useAuth } from '@/features/Auth/hooks';

function NotAuthorizedPage() {
  const { account } = useAccount();
  const { authToken } = useAuth();

  if (!account) return <Navigate to={LOGIN} replace />;
  if (account && authToken) return <Navigate to={PLAY} replace />;

  return <NotAuthorized />;
}

export { NotAuthorizedPage };
