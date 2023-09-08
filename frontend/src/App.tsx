import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { useAccount, useApi } from '@gear-js/react-hooks';
import { GamePage, MainPage } from '@/pages';
import { Header, Footer } from '@/components';
import { withProviders } from '@/hocs';
import { ScrollToTop, cx } from '@/utils';
import { LOGIN, PLAY, START } from '@/App.routes';
import styles from './App.module.scss';
import 'babel-polyfill';
import { useLoginByParams } from './hooks';
import { CONFIG, CURRENT_GAME, STRATEGY_IDS } from './atoms';
import { ProtectedRoute } from './features/Auth/components';
import { useAccountAvailableBalance, useAccountAvailableBalanceSync, useWalletSync } from './features/Wallet/hooks';
import { LoginPage } from './pages/LoginPage';
import { ApiLoader } from './components/ApiLoader';
import { useConfigState, useGameState, useStrategyIdsState } from './features/Game/hooks';
import { useAuth, useAuthSync } from './features/Auth/hooks';

function AppComponent() {
  const { isApiReady } = useApi();
  const { isAccountReady, account } = useAccount();
  const { state: strategyIds } = useStrategyIdsState();
  const { state: config } = useConfigState();
  const { state: game } = useGameState(account?.decodedAddress);
  const { isAvailableBalanceReady } = useAccountAvailableBalance();
  const { isAuthReady } = useAuth();
  const isStateRead = !!strategyIds && !!config && !!game;
  const setStrategyIds = useSetAtom(STRATEGY_IDS);
  const setCurrentGame = useSetAtom(CURRENT_GAME);
  const setConfig = useSetAtom(CONFIG);

  useEffect(() => {
    if (strategyIds && game && config && isAccountReady && account && isStateRead) {
      setStrategyIds(strategyIds.StrategyIds);

      setCurrentGame(game.Game);

      setConfig(config?.Config);
    }
  }, [setStrategyIds, setCurrentGame, setConfig, account, isAccountReady, strategyIds, game, config, isStateRead]);

  const isAppReady = isApiReady && isAccountReady && isAvailableBalanceReady && isAuthReady;

  useAuthSync();
  useLoginByParams();
  useWalletSync();
  useAccountAvailableBalanceSync();

  return (
    <div className={cx(styles['app-container'])}>
      <ScrollToTop />
      {isAppReady ? (
        <>
          <Header />

          <Routes>
            <Route
              path="*"
              element={
                <>
                  <div className={cx(styles['main-content'])}>
                    <Routes>
                      <Route
                        index
                        path={`/${PLAY}`}
                        element={
                          <ProtectedRoute>
                            <MainPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route path={`/${LOGIN}`} element={<LoginPage />} />
                    </Routes>
                  </div>
                  <Footer />
                </>
              }
            />

            <Route
              path={`/${START}`}
              element={
                <div className={cx(styles['main-content'])}>
                  <ProtectedRoute>
                    <GamePage />
                  </ProtectedRoute>
                </div>
              }
            />
          </Routes>
        </>
      ) : (
        <ApiLoader />
      )}
    </div>
  );
}

export const App = withProviders(AppComponent);
