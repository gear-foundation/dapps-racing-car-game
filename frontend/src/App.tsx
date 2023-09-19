import { useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { useAccount, useApi } from '@gear-js/react-hooks';
import { Header, Footer } from '@/components';
import { withProviders } from '@/hocs';
import { ScrollToTop, cx } from '@/utils';
import styles from './App.module.scss';
import 'babel-polyfill';
import { ApiLoader } from './components/ApiLoader';
import { StayTuned } from '@/pages/stay-tuned';

function AppComponent() {
  const { isApiReady } = useApi();
  const { isAccountReady, account, logout } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (account) {
      navigate('/');
      logout();
    }
  }, [account, logout, navigate]);

  const isAppReady = isApiReady && isAccountReady;

  return (
    <div className={cx(styles['app-container'])}>
      <ScrollToTop />
      {isAppReady ? (
        <>
          <Header />
          <div className={cx(styles['main-content'])}>
            <StayTuned />
          </div>
          <Footer />
        </>
      ) : (
        <ApiLoader />
      )}
    </div>
  );
}

export const App = withProviders(AppComponent);
