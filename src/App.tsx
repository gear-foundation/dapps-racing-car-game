import { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { useAccount, useApi } from '@gear-js/react-hooks';
import { useAuth, useAuthSync } from '@/features/Auth/hooks';
import { GamePage, MainPage } from '@/pages';
import { Header, Footer } from '@/components';
import { withProviders } from '@/hocs';
import { ScrollToTop, cx } from '@/utils';
import { LOGIN, NOT_AUTHORIZED, PLAY, START } from '@/App.routes';
import { Loader } from './components/Loader';
import styles from './App.module.scss';
import 'babel-polyfill';
import { useProgramState } from './hooks';
import { IntrodutionPic } from './pages/MainPage/components/IntrodutionPic';
import { CONFIG, CURRENT_GAME, MSG_TO_GAME_ID, STRATEGY_IDS } from './atoms';
import { ProtectedRoute } from './features/Auth/components';
import { useWalletSync } from './features/Wallet/hooks';
import { useFTBalance, useFTBalanceSync } from '@/features/ScoreBalance/hooks';
import { LoginPage } from './pages/LoginPage';
import { NotAuthorizedPage } from './pages/NotAuthorizedPage';

function AppComponent() {
  const { isApiReady } = useApi();
  const { isAuthReady } = useAuth();
  const { isAccountReady, account } = useAccount();
  const { state, isStateRead } = useProgramState();

  useFTBalanceSync();
  const setStrategyIds = useSetAtom(STRATEGY_IDS);
  const setCurrentGame = useSetAtom(CURRENT_GAME);
  const setMsgToGameId = useSetAtom(MSG_TO_GAME_ID);
  const setConfig = useSetAtom(CONFIG);

  useEffect(() => {
    if (state && isStateRead && isAccountReady && account) {
      setStrategyIds(state.strategyIds);
      setCurrentGame(state.games[account?.decodedAddress] || null);
      setMsgToGameId(state.msgIdToGameId);
      setConfig(state.config);
    }
  }, [state, isStateRead, setStrategyIds, setCurrentGame, setMsgToGameId, setConfig, account, isAccountReady]);

  const isAppReady = isApiReady && isAccountReady && isStateRead && isAuthReady;

  useWalletSync();
  useAuthSync();

  return (
    <div className={cx(styles['app-container'])}>
      <ScrollToTop />
      {isAppReady ? (
        <>
          <Header />
          <div className={cx(styles['main-content'])}>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainPage />
                  </ProtectedRoute>
                }>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Navigate to={`/${PLAY}`} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={`/${PLAY}`}
                  element={
                    <ProtectedRoute>
                      <IntrodutionPic />
                    </ProtectedRoute>
                  }
                />
              </Route>
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
        <Loader />
      )}
    </div>
  );
}

export const App = withProviders(AppComponent);
