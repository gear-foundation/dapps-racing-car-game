import { useAtom } from 'jotai';
import { useAccount, Account } from '@gear-js/react-hooks';
import { useWallet } from '../Wallet/hooks';
import { IS_AUTH_READY_ATOM } from './atoms';

export function useAuth() {
  const [isAuthReady, setIsAuthReady] = useAtom(IS_AUTH_READY_ATOM);
  const { login, logout } = useAccount();
  const { resetWalletId } = useWallet();

  const signIn = async (account: Account) => {
    await login(account);
    setIsAuthReady(true);
  };

  const signOut = () => {
    logout();
    resetWalletId();
  };

  return {
    isAuthReady,
    signIn,
    signOut,
    setIsAuthReady,
  };
}
