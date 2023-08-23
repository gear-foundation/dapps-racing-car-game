import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ui';
import styles from './Layout.module.scss';
import { cx } from '@/utils';
import carsImg from '@/assets/icons/introdution-cars-img.webp';
import carsImgPng from '@/assets/icons/introdution-cars-img.png';

import { CURRENT_GAME } from '@/atoms';

function Layout() {
  const navigate = useNavigate();
  const currentGame = useAtomValue(CURRENT_GAME);

  const handleGoToPlay = () => {
    navigate('/start');
  };

  return (
    <div className={cx(styles.content)}>
      <div className={cx(styles.left)}>
        <h1 className={cx(styles['main-title'], styles['main-title-with-gradient'])}>Racing Car Game</h1>
        <p className={cx(styles['main-description'])}>
          A racing car game in which you compete not against a human, but against a smart contract. You will be given
          the choice to either accelerate or shoot at the nearest car.
        </p>
        <Button
          label={currentGame ? 'Continue Game' : 'Start the game'}
          variant="primary"
          size="large"
          onClick={handleGoToPlay}
        />
      </div>
      <div className={cx(styles.right)}>
        <picture>
          <source type="image/webp" srcSet={carsImg} />
          <source type="image/jpeg" srcSet={carsImgPng} />
          <img src={carsImg} alt="test" className={cx(styles['cars-pic'])} />
        </picture>
      </div>
    </div>
  );
}

export { Layout };
