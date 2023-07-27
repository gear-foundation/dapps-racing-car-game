import { useAccount } from '@gear-js/react-hooks';
import { Navigate } from 'react-router-dom';
import { LOGIN } from '@/App.routes';
import { NotAuthorized } from '@/features/Auth/components';

function NotAuthorizedPage() {
  const { account } = useAccount();

  if (!account) return <Navigate to={`/${LOGIN}`} />;

  return <NotAuthorized />;
}

export { NotAuthorizedPage };
