import { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAtom } from 'jotai';
import isEqual from 'lodash.isequal';
import { useAccount } from '@gear-js/react-hooks';
import styles from './Layout.module.scss';
import { cx } from '@/utils';
import { Heading } from '../Heading';
import { Road } from '../Road';
import { Button } from '@/ui';
import accelerateSVG from '@/assets/icons/accelerate-icon.svg';
import shootSVG from '@/assets/icons/shoot-icon.svg';
import { CONFIG, CURRENT_GAME } from '@/atoms';
import { usePlayerMoveMessage, useStartGameMessage } from '../../hooks';
import { YourRewards } from '../YourRewards';
import { Loader } from '@/components';
import { WinStatus } from './Layout.interface';

function LayoutComponent() {
  const [currentGame] = useAtom(CURRENT_GAME);
  const [gameConfig] = useAtom(CONFIG);
  const [isPlayerAction, setIsPlayerAction] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { account } = useAccount();
  const navigate = useNavigate();
  const sendPlayerMoveMessage = usePlayerMoveMessage();
  const { meta, message } = useStartGameMessage();

  const defineStrategyAction = (type: 'accelerate' | 'shoot') => {
    if (type === 'accelerate') {
      return 'BuyAcceleration';
    }

    if (type === 'shoot') {
      return 'BuyShell';
    }
  };

  useEffect(() => {
    setIsPlayerAction(true);
  }, [currentGame]);

  const handleActionChoose = (type: 'accelerate' | 'shoot') => {
    setIsPlayerAction(false);
    const payload = {
      PlayerMove: {
        strategy_action: defineStrategyAction(type),
      },
    };

    sendPlayerMoveMessage(payload, {
      onError: () => {
        console.log('error');
        setIsPlayerAction(true);
      },
    });
  };

  const defineWinStatus = (): WinStatus => {
    if (currentGame?.state === 'Finished') {
      return currentGame.result;
    }

    return null;
  };

  const defineRewards = (): string | null => {
    if (currentGame?.state === 'Finished') {
      if (defineWinStatus() === 'Win') {
        return gameConfig!.tokensOnWin;
      }
      if (defineWinStatus() === 'Draw') {
        return gameConfig!.tokensOnDraw;
      }
      if (defineWinStatus() === 'Lose') {
        return gameConfig!.tokensOnLose;
      }
    }

    return null;
  };

  const handleStartNewGame = useCallback(
    (startManually?: boolean) => {
      if (meta && (!currentGame || startManually)) {
        setIsPlayerAction(false);
        setIsLoading(true);
        const payload = {
          StartGame: null,
        };

        message(payload, {
          onSuccess: () => {
            setIsLoading(false);
            setIsPlayerAction(true);
          },
          onError: () => {
            console.log('error');
            navigate('/');
          },
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [meta, currentGame],
  );

  useEffect(() => {
    handleStartNewGame();
  }, [handleStartNewGame]);

  return (
    <>
      {currentGame && account && gameConfig && !isLoading ? (
        <div className={cx(styles.container)}>
          <Heading
            currentTurn={currentGame.currentRound}
            isPlayerAction={isPlayerAction}
            winStatus={defineWinStatus()}
          />
          <Road newCars={currentGame.cars} carIds={currentGame.carIds} />
          {currentGame.state !== 'Finished' && (
            <div className={cx(styles.controls)}>
              <Button
                label="Accelerate"
                variant="primary"
                size="large"
                icon={accelerateSVG}
                disabled={!isPlayerAction}
                className={cx(styles['control-button'])}
                onClick={() => handleActionChoose('accelerate')}
              />
              <Button
                label="Shoot"
                variant="primary"
                size="large"
                icon={shootSVG}
                disabled={!isPlayerAction}
                className={cx(styles['control-button'], styles['control-button-red'])}
                onClick={() => handleActionChoose('shoot')}
              />
            </div>
          )}
          {currentGame.state === 'Finished' && (
            <div className={cx(styles['rewards-wrapper'])}>
              <YourRewards rewards={defineRewards()} />
              <Button
                variant="primary"
                label="Play again"
                className={cx(styles.btn)}
                onClick={() => handleStartNewGame(true)}
              />
            </div>
          )}
        </div>
      ) : (
        <div>
          <Loader />
        </div>
      )}
    </>
  );
}

const Layout = memo(LayoutComponent, isEqual);

export { Layout };
