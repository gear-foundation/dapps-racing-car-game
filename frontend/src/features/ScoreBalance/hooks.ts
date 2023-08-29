import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { CreateType } from '@gear-js/api';
import { formatBalance } from '@polkadot/util';
import { useAccount, useApi } from '@gear-js/react-hooks';
import { useReadState } from '@/hooks';
import { FT_BALANCE, FT_BALANCE_READY } from './atoms';
import { IFTMain, SystemAccount } from './types';
import { ADDRESS, AVAILABLE_BALANCE, IS_AVAILABLE_BALANCE_READY } from './consts';
import meta from './assets/fungible_token.meta.txt';

export function useFTBalance() {
  const setBalance = useSetAtom(FT_BALANCE);
  const setFTBalanceReady = useSetAtom(FT_BALANCE_READY);
  const balance = useAtomValue(FT_BALANCE);
  const isFTBalanceReady = useAtomValue(FT_BALANCE_READY);
  return {
    balance,
    setBalance,
    isFTBalanceReady,
    setFTBalanceReady,
  };
}

export function useFTBalanceSync() {
  const { account } = useAccount();
  const { setBalance, setFTBalanceReady, isFTBalanceReady } = useFTBalance();
  const { state, error, isStateRead } = useReadState<IFTMain>({
    programId: ADDRESS.SFT,
    meta,
  });

  useEffect(() => {
    if (isStateRead && !isFTBalanceReady) setFTBalanceReady(isStateRead);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFTBalanceReady, isStateRead]);

  useEffect(() => {
    if (state?.balances && account?.decodedAddress) {
      const userBalance = state.balances.find(([address]) => address === account.decodedAddress);
      setBalance(userBalance ? userBalance[1] : '0');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.decodedAddress, state?.balances]);

  return {
    errorFT: error,
  };
}

export function useAccountAvailableBalance() {
  const isAvailableBalanceReady = useAtomValue(IS_AVAILABLE_BALANCE_READY);
  const availableBalance = useAtomValue(AVAILABLE_BALANCE);
  const setAvailableBalance = useSetAtom(AVAILABLE_BALANCE);
  return { isAvailableBalanceReady, availableBalance, setAvailableBalance };
}

export function useAccountAvailableBalanceSync() {
  const { isAccountReady, account } = useAccount();
  const { api, isApiReady } = useApi();

  const isReady = useAtomValue(IS_AVAILABLE_BALANCE_READY);
  const setIsReady = useSetAtom(IS_AVAILABLE_BALANCE_READY);
  const setAvailableBalance = useSetAtom(AVAILABLE_BALANCE);

  useEffect(() => {
    if (!api || !isApiReady || !isAccountReady) return;

    if (account?.decodedAddress) {
      api.query.system.account(account.decodedAddress).then((res) => {
        const systemAccount = res.toJSON() as SystemAccount;
        const total = CreateType.create('u128', systemAccount.data.free).toString();
        const fee = CreateType.create('u128', systemAccount.data.feeFrozen).toString();

        const getBalance = (b: string) => () => {
          const [unit] = api.registry.chainTokens;
          const [decimals] = api.registry.chainDecimals;

          const value = formatBalance(b.toString(), {
            decimals,
            forceUnit: unit,
            withSiFull: false,
            withSi: false,
            withUnit: unit,
          });

          return { value, unit };
        };

        setAvailableBalance(getBalance(`${+total - +fee}`));
        if (!isReady) setIsReady(true);
      });
    } else setIsReady(true);
  }, [account, api, isAccountReady, isApiReady, isReady, setAvailableBalance, setIsReady]);
}
