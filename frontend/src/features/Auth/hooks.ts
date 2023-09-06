import { useLocation } from 'react-router';
import { useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import { useAccount, Account } from '@gear-js/react-hooks';
import { useWallet } from '../Wallet/hooks';
import { IS_AUTH_READY_ATOM, USER_ADDRESS_ATOM } from './atoms';
import { fetchAuth } from './utils';
import { AuthResponse } from './types';

export function useAuth() {
  const { search } = useLocation();
  const [isAuthReady, setIsAuthReady] = useAtom(IS_AUTH_READY_ATOM);
  const [userAddress, setIsUserAddress] = useAtom(USER_ADDRESS_ATOM);
  const query = useMemo(() => new URLSearchParams(search), [search]);

  const { login, logout, account } = useAccount();
  const { resetWalletId } = useWallet();

  const signIn = async (_account: Account) => {
    await login(_account);
  };

  const signOut = () => {
    logout();
    resetWalletId();
  };

  const auth = async () => {
    const uuid = query.get('uuid');
    console.log(uuid);
    console.log('aaaaaaa');
    if (query.size && uuid && account) {
      try {
        console.log('llllllllllllll');
        const res = await fetchAuth<AuthResponse>('/api/user/auth', 'POST', {
          coinbaseUID: uuid,
          substrate: account.decodedAddress,
        });

        if (res?.success) {
          setIsUserAddress(res.content.user.address);
        }
      } catch (err) {
        console.log(err);
      }
    }
    console.log('bbbbbbbb');
    setIsAuthReady(true);
  };

  return { signIn, signOut, auth, isAuthReady, userAddress };
}

function useAuthSync() {
  const { isAccountReady } = useAccount();
  const { auth } = useAuth();

  useEffect(() => {
    if (!isAccountReady) {
      return;
    }

    auth();
    console.log('fff');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAccountReady]);
}

export { useAuthSync };
