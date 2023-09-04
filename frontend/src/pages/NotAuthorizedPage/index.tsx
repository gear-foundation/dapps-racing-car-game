import { useAccount } from '@gear-js/react-hooks';
import { Navigate } from 'react-router-dom';
import { LOGIN, PLAY } from '@/App.routes';

function NotAuthorizedPage() {
  const { account } = useAccount();

  if (!account) {
    return <Navigate to={LOGIN} replace />;
  }
  if (account) {
    return <Navigate to={PLAY} replace />;
  }

  return <Navigate to={PLAY} replace />;
}

export { NotAuthorizedPage };
