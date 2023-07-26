import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import Identicon from '@polkadot/react-identicon';
import { useLocation } from 'react-router-dom';
import { Button, Link } from '@ui';
import { useAccount } from '@gear-js/react-hooks';
import { cx } from '@/utils';
import styles from './Header.module.scss';
import logo from '@/assets/icons/logo-vara-black.png';
import coin from '@/assets/icons/vara-coin-silver.png';
import { HeaderProps } from './Header.interfaces';
import { ADDRESS } from '@/consts';
import { CONTRACT_ADDRESS_ATOM } from '@/atoms';
import { useMediaQuery } from '@/hooks';
import menuIcon from '@/assets/icons/burger-menu-icon.svg';
import { BurgerMenu } from '../BurgerMenu/BurgerMenu';
import { ScorePPV } from '../ScorePPV';

function Header({ menu }: HeaderProps) {
  const location = useLocation();
  const { account } = useAccount();
  const address = useAtom(CONTRACT_ADDRESS_ATOM);
  const isMobile = useMediaQuery(600);
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
          <Link to="/">
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
                  <div className={cx(styles['wallet-info'])}>
                    <div className={cx(styles.score)}>
                      <ScorePPV />
                    </div>
                    <div className={cx(styles.balance)}>
                      <img src={coin} alt="wara coin" className={cx(styles['balance-coin-image'])} />
                      <div className={cx(styles['balance-value'])}>{account.balance.value}</div>
                      <div className={cx(styles['balance-currency-name'])}>{account.balance.unit}</div>
                    </div>
                    <button className={cx(styles.description)}>
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
                </>
              )}
            </>
          )}
          {account && isMobile && (
            <div className={cx(styles['burger-menu-button'])}>
              <Button label="" variant="icon" onClick={() => setIsMobileMenuOpen(true)} icon={menuIcon} />
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
