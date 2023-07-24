import { useCallback, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
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
  const currentGame = useAtomValue(CURRENT_GAME);
  const gameConfig = useAtomValue(CONFIG);
  const [isPlayerAction, setIsPlayerAction] = useState<boolean>(true);
  const { account } = useAccount();
  const sendPlayerMoveMessage = usePlayerMoveMessage();
  const sendStartGameMessage = useStartGameMessage();

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
      },
    });
  };

  const defineWinStatus = (): WinStatus => {
    if (currentGame?.state === 'Finished') {
      if (currentGame!.winner === account!.address) {
        return 'win';
      }

      return 'lose';
    }

    return null;
  };

  const defineRewards = (): string | null => {
    if (defineWinStatus() === 'win') {
      return gameConfig!.tokensOnFirstPlace;
    }

    if (defineWinStatus() === 'lose') {
      return null;
    }

    return null;
  };

  const handleStartNewGame = useCallback(() => {
    const payload = {
      StartGame: null,
    };

    sendStartGameMessage(payload, {
      onSuccess: () => {
        window.location.reload();
      },
      onError: () => {
        console.log('error');
      },
    });
  }, [sendStartGameMessage]);

  useEffect(() => {
    if (!currentGame) {
      handleStartNewGame();
    }
  }, [currentGame, handleStartNewGame]);

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
              <Button variant="primary" label="Play again" className={cx(styles.btn)} onClick={handleStartNewGame} />
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
