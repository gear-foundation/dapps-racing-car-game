import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { useAccount, useApi } from '@gear-js/react-hooks';
import { useAuthSync } from '@/features/Auth/hooks';
import { GamePage, MainPage } from '@/pages';
import { Header, Footer } from '@/components';
import { withProviders } from '@/hocs';
import { ScrollToTop, cx } from '@/utils';
import { LOGIN, NOT_AUTHORIZED, START } from '@/App.routes';
import styles from './App.module.scss';
import 'babel-polyfill';
import { useLoginByParams, useProgramState } from './hooks';
import { CONFIG, CURRENT_GAME, MSG_TO_GAME_ID, STRATEGY_IDS } from './atoms';
import { ProtectedRoute } from './features/Auth/components';
import { useAccountAvailableBalance, useAccountAvailableBalanceSync, useWalletSync } from './features/Wallet/hooks';
import { useFTBalanceSync } from '@/features/ScoreBalance/hooks';
import { LoginPage } from './pages/LoginPage';
import { NotAuthorizedPage } from './pages/NotAuthorizedPage';
import { ApiLoader } from './components/ApiLoader';

function AppComponent() {
  const { isApiReady } = useApi();
  const { isAccountReady, account } = useAccount();
  const { state, isStateRead } = useProgramState();
  const { isAvailableBalanceReady } = useAccountAvailableBalance();

  const setStrategyIds = useSetAtom(STRATEGY_IDS);
  const setCurrentGame = useSetAtom(CURRENT_GAME);
  const setMsgToGameId = useSetAtom(MSG_TO_GAME_ID);
  const setConfig = useSetAtom(CONFIG);

  useEffect(() => {
    if (state && isStateRead && isAccountReady && account) {
      setStrategyIds(state.strategyIds);
      setCurrentGame(state.games?.find((game) => game[0] === account?.decodedAddress)?.[1] || null);
      setMsgToGameId(state.msgIdToGameId);
      setConfig(state.config);
    }
  }, [state, isStateRead, setStrategyIds, setCurrentGame, setMsgToGameId, setConfig, account, isAccountReady]);

  const isAppReady = isApiReady && isAccountReady && isStateRead && isAvailableBalanceReady;

  useLoginByParams();
  useWalletSync();
  useAuthSync();
  useFTBalanceSync();
  useAccountAvailableBalanceSync();

  return (
    <div className={cx(styles['app-container'])}>
      <ScrollToTop />
      {isAppReady ? (
        <>
          <Header />
          <div className={cx(styles['main-content'])}>
            <Routes>
              <Route
                path='/'
                element={
                  <ProtectedRoute>
                    <MainPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path={`/${START}`}
                element={
                  <ProtectedRoute>
                    <GamePage />
                  </ProtectedRoute>
                }
              />
              <Route path={`/${NOT_AUTHORIZED}`} element={<NotAuthorizedPage />} />
              <Route path={`/${LOGIN}`} element={<LoginPage />} />
            </Routes>
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
