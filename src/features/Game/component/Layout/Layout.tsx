import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAtom } from 'jotai';
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

function Layout() {
  const [currentGame] = useAtom(CURRENT_GAME);
  const [gameConfig] = useAtom(CONFIG);
  const [isPlayerAction, setIsPlayerAction] = useState<boolean>(true);
  const { account } = useAccount();
  const navigate = useNavigate();
  const sendPlayerMoveMessage = usePlayerMoveMessage();
  const { meta, message } = useStartGameMessage();

  const handleActionChoose = (type: 'accelerate' | 'shoot' | 'none') => {
    setIsPlayerAction(false);
    const payload = {
      PlayerMove: {
        strategy_action: {
          BuyAcceleration: type === 'accelerate' ? true : null,
          BuyShell: type === 'shoot' ? true : null,
          Skip: type === 'none' ? true : null,
        },
      },
    };

    sendPlayerMoveMessage(payload, {
      onSuccess: () => {
        setIsPlayerAction(true);
      },
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
  console.log(currentGame?.cars);
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
        const payload = {
          StartGame: null,
        };

        message(payload, {
          onSuccess: () => {
            if (startManually) {
              window.location.reload();
            }
            setIsPlayerAction(true);
          },
          onError: () => {
            console.log('error');
            navigate('/play');
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
      {currentGame && account && gameConfig ? (
        <div>
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

export { Layout };
