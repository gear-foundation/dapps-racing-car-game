import { Navigate } from 'react-router-dom';
import { useAccount } from '@gear-js/react-hooks';
import { PLAY } from '@/App.routes';
import { WalletInfo } from '@/features/Wallet/components/WalletInfo';
import { useAuth } from '@/features/Auth/hooks';
import { Welcome } from '@/features/Auth/components';

function LoginPage() {
  const { authToken } = useAuth();
  const { account } = useAccount();

  return (
    <>
      {authToken ? (
        <Navigate to={PLAY} replace />
      ) : (
        <Welcome>
          <WalletInfo account={account} />
        </Welcome>
      )}
    </>
  );
}

export { LoginPage };
