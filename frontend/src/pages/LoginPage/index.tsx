import { Navigate } from 'react-router-dom';
import { useAccount } from '@gear-js/react-hooks';
import { PLAY } from '@/App.routes';
import { WalletInfo } from '@/features/Wallet/components/WalletInfo';
import { useAuth } from '@/features/Auth/hooks';

function LoginPage() {
  const { authToken } = useAuth();
  const { account } = useAccount();

  return <>{authToken ? <Navigate to={PLAY} replace /> : <WalletInfo account={account} />}</>;
}

export { LoginPage };
