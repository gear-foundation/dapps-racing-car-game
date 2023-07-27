import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useAtom } from 'jotai';
import { useAlert, useAccount } from '@gear-js/react-hooks';
import { useEffect } from 'react';
import { web3FromAddress } from '@polkadot/extension-dapp';
import {
  AUTH_API_ADDRESS,
  AUTH_MESSAGE,
  AUTH_TOKEN_ATOM,
  AUTH_TOKEN_LOCAL_STORAGE_KEY,
  DISCORD_USERNAME_ATOM,
  IS_AUTH_READY_ATOM,
} from './consts';
import { fetchAuth, post } from './utils';
import { AuthResponse, SignInResponse } from './types';

function useAuth() {
  const [authToken, setAuthToken] = useAtom(AUTH_TOKEN_ATOM);
  const [discordUsername, setDiscordUsername] = useAtom(DISCORD_USERNAME_ATOM);
  const [isAuthReady, setIsAuthReady] = useAtom(IS_AUTH_READY_ATOM);
  const { account, login, logout } = useAccount();
  const isAwaitingVerification = account && !authToken;

  const alert = useAlert();

  const signIn = (_account: InjectedAccountWithMeta) => {
    const { address } = _account;

    return web3FromAddress(address)
      .then(({ signer }) => {
        if (!signer.signRaw) throw new Error('signRaw not exists');

        return signer.signRaw({ address, data: AUTH_MESSAGE, type: 'payload' });
      })
      .then(({ signature }) => signature)
      .then((signature) =>
        fetch(`${AUTH_API_ADDRESS}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ signature, publicKey: address, message: AUTH_MESSAGE }),
        }).then((response) => {
          if (!response.ok && response.status !== 409) throw new Error(response.statusText);

          return response.json();
        }),
      )
      .then((result) => {
        if (result.errors && result.errors.message === 'Please confirm email') {
          login(_account);

          setAuthToken('');
          setDiscordUsername('');
          console.log('aaaa');
        } else {
          login(_account);
          console.log('vvbvv');
          setAuthToken(result.accessToken);
          setDiscordUsername(result.discord || '');
        }
      })
      .catch(({ message }: Error) => alert.error(message));
  };

  const signOut = () => {
    logout();
    setAuthToken('');
  };

  const verify = (token: string) => {
    post<SignInResponse>('email_confirmation/confirm', { token })
      .then(({ accessToken, discord }) => {
        setAuthToken(accessToken);
        setDiscordUsername(discord || '');

        alert.success('Email confirmed');
      })
      .catch(({ message }) => alert.error(message));
  };

  const auth = () => {
    const localStorageToken = localStorage[AUTH_TOKEN_LOCAL_STORAGE_KEY] as string | null;

    if (!localStorageToken) {
      setIsAuthReady(true);

      console.log('yyyyyyyyyy');

      if (!isAwaitingVerification) {
        console.log('wwwwwwwwwww');
        logout();
      }

      return;
    }

    fetchAuth<AuthResponse>('auth/me', 'PUT', localStorageToken)
      .then(({ discord }) => {
        setAuthToken(localStorageToken);
        setDiscordUsername(discord || '');
      })
      .catch(({ message }: Error) => {
        signOut();
        localStorage.removeItem(AUTH_TOKEN_LOCAL_STORAGE_KEY);
        alert.error(message);
      })
      .finally(() => setIsAuthReady(true));
  };

  return {
    authToken,
    discordUsername,
    isAuthReady,
    isAwaitingVerification,
    signIn,
    signOut,
    auth,
    setDiscordUsername,
    verify,
  };
}

function useAuthSync() {
  const { isAccountReady } = useAccount();
  const { authToken, isAuthReady, auth } = useAuth();

  useEffect(() => {
    if (!isAccountReady) {
      return;
    }

    auth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAccountReady]);

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    if (!authToken) {
      return localStorage.removeItem(AUTH_TOKEN_LOCAL_STORAGE_KEY);
    }

    localStorage.setItem(AUTH_TOKEN_LOCAL_STORAGE_KEY, authToken);
  }, [isAuthReady, authToken]);
}

export { useAuth, useAuthSync };
