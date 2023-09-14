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
import { ReactComponent as GearLogoIcon } from '@/assets/icons/gear-logo-icon.svg';
import { CURRENT_GAME } from '@/atoms';
import { usePlayerMoveMessage, useStartGameMessage } from '../../hooks';
import { Footer, Loader } from '@/components';
import { WinStatus } from './Layout.interface';
import { PLAY } from '@/App.routes';

function LayoutComponent() {
  const [currentGame] = useAtom(CURRENT_GAME);
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
            navigate(PLAY, { replace: true });
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
      {currentGame && account && !isLoading ? (
        <div className={cx(styles.container, currentGame.state !== 'Finished' ? styles['container-flexed'] : '')}>
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
              <Button
                variant="primary"
                label="Play again"
                size="large"
                className={cx(styles.btn)}
                onClick={() => handleStartNewGame(true)}
              />
            </div>
          )}
          {currentGame.state !== 'Finished' && (
            <>
              <div className={cx(styles.footer)}>
                <Footer />
              </div>
            </>
          )}
          {currentGame.state === 'Finished' && (
            <div className={cx(styles['footer-wrapper'])}>
              <div className={styles.banner}>
                <div className={styles.banner__right}>
                  <h2 className={styles.banner__title}>
                    Thank you for your interest <span>in the Vara Network.</span>
                  </h2>
                  <div className={styles.banner__text}>
                    <p>You&apos;ve experienced a fully on-chain game.</p>
                    <p>
                      We look forward to having you join the ranks of developers shaping the new generation of
                      decentralized applications.
                    </p>
                  </div>
                </div>
                <ul className={styles.banner__left}>
                  <li className={styles.banner__item}>
                    <div className={styles.banner__icon}>
                      <GearLogoIcon width={24} height={24} />
                    </div>
                    <p className={styles['visit-block']}>
                      Visit the{' '}
                      <a href="https://wiki.gear-tech.io/" target="_blank" rel="noreferrer">
                        Gear Wiki
                      </a>{' '}
                      to discover how easy it is to create programs using the Gear Protocol.
                    </p>
                  </li>
                  <li className={styles.banner__item}>
                    <div className={styles.banner__icon}>
                      <GearLogoIcon width={24} height={24} />
                    </div>
                    <p className={styles['visit-block']}>
                      Consider enrolling in a free course at{' '}
                      <a href="https://academy.gear.foundation/" target="_blank" rel="noreferrer">
                        Gear&nbsp;Academy
                      </a>{' '}
                      to become a top-notch Web3 developer.
                    </p>
                  </li>
                </ul>
              </div>
              <Footer />
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
