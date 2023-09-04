import { useState } from 'react';
import Identicon from '@polkadot/react-identicon';
import { useAtom } from 'jotai';
import { cx } from '@/utils';
import { ADDRESS } from '@/consts';
import { CONTRACT_ADDRESS_ATOM } from '@/atoms';
import coin from '@/assets/icons/green_coin.svg';
import { WalletInfoProps } from './WalletInfo.interfaces';
import { Button } from '@/ui';
import { WalletModal } from '../WalletModal';
import styles from './WalletInfo.module.scss';
import { useAccountAvailableBalance } from '../../hooks';

function WalletInfo({ account, withoutBalance }: WalletInfoProps) {
  const address = useAtom(CONTRACT_ADDRESS_ATOM);
  const { availableBalance: balance, isAvailableBalanceReady } = useAccountAvailableBalance();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);

  const handleCloseWalletModal = () => {
    setIsWalletModalOpen(false);
  };

  const handleOpenWalletModal = () => {
    setIsWalletModalOpen(true);
  };

  return (
    <>
      {account && isAvailableBalanceReady ? (
        <div className={cx(styles['wallet-info'])}>
          {!withoutBalance && (
            <div className={cx(styles.balance)}>
              <img src={coin} alt="wara coin" className={cx(styles['balance-coin-image'])} />
              <div className={cx(styles['balance-value'])}>{balance?.value || '0'}</div>
              <div className={cx(styles['balance-currency-name'])}>{account.balance.unit}</div>
            </div>
          )}
          <button className={cx(styles.description)} onClick={handleOpenWalletModal}>
            {address && (
              <Identicon
                value={ADDRESS.CONTRACT}
                size={21}
                theme="polkadot"
                className={cx(styles['description-icon'])}
              />
            )}
            <div className={cx(styles['description-name'])}>{account?.meta.name}</div>
          </button>
        </div>
      ) : (
        <Button label="connect" variant="outline" onClick={handleOpenWalletModal} />
      )}
      {isWalletModalOpen && <WalletModal onClose={handleCloseWalletModal} />}
    </>
  );
}

export { WalletInfo };
