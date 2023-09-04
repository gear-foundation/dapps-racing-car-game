import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Link } from '@ui';
import { useAccount } from '@gear-js/react-hooks';
import { cx } from '@/utils';
import styles from './Header.module.scss';
import logo from '@/assets/icons/logo-vara-black.svg';
import { HeaderProps } from './Header.interfaces';
import { useMediaQuery } from '@/hooks';
import menuIcon from '@/assets/icons/burger-menu-icon.svg';
import { BurgerMenu } from '../BurgerMenu/BurgerMenu';
import { WalletInfo } from '@/features/Wallet/components/WalletInfo';
import { useAccountAvailableBalance } from '@/features/Wallet/hooks';
import coin from '@/assets/icons/green_coin.svg';

function Header({ menu }: HeaderProps) {
  const location = useLocation();
  const { account } = useAccount();
  const isMobile = useMediaQuery(768);
  const { availableBalance: balance, isAvailableBalanceReady } = useAccountAvailableBalance();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const burgerMenuHandler = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isMobileMenuOpen && !isMobile) {
      burgerMenuHandler();
    }
  }, [isMobile, isMobileMenuOpen]);

  return (
    <>
      <header className={cx(styles.header)}>
        <div className={cx(styles.container)}>
          <Link to="/" className={cx(styles['logo-link'], !account ? styles['logo-link-centered'] : '')}>
            <img src={logo} alt="" />
          </Link>
          {account && (
            <>
              {!isMobile && (
                <>
                  <nav className={cx(styles.menu)}>
                    {menu &&
                      Object.keys(menu).map((item) => {
                        const { url } = menu[item];

                        return (
                          <Link to={url} key={item}>
                            <p
                              className={cx(
                                styles['menu-item'],
                                location.pathname === `/${url}` ? styles['menu-item--active'] : '',
                              )}>
                              {item}
                            </p>
                          </Link>
                        );
                      })}
                  </nav>
                  <WalletInfo account={account} />
                </>
              )}
            </>
          )}
          {account && isMobile && isAvailableBalanceReady && (
            <div className={cx(styles['menu-wrapper'])}>
              <div className={cx(styles.balance)}>
                <img src={coin} alt="wara coin" className={cx(styles['balance-coin-image'])} />
                <div className={cx(styles['balance-value'])}>{balance?.value || '0'}</div>
                <div className={cx(styles['balance-currency-name'])}>{account.balance.unit}</div>
              </div>
              <div className={cx(styles['burger-menu-button'])}>
                <Button label="" variant="icon" onClick={() => setIsMobileMenuOpen(true)} icon={menuIcon} />
              </div>
            </div>
          )}
        </div>
      </header>
      {isMobileMenuOpen && (
        <>
          <div className={cx(styles['blur-background'])} />
          <BurgerMenu burgerMenuHandler={burgerMenuHandler} />
        </>
      )}
    </>
  );
}

export { Header };
