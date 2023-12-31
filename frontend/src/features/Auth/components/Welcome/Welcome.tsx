import { WelcomeProps } from './Welcome.interface';
import styles from './Welcome.module.scss';
import { cx } from '@/utils';

function Welcome({ children }: WelcomeProps) {
  return (
    <div className={cx(styles.content)}>
      <h1 className={cx(styles['main-title'], styles['main-title-with-gradient'])}>Racing Car Game</h1>
      <div className={cx(styles['main-description'])}>
       <p>
         A racing car game in which you compete not against a human, but against a smart contract. You will be given the
         choice to either accelerate or shoot at the nearest car.
       </p>
        <p>
          To play the game you need to have at least 250 TVARA on your balance.
        </p>
      </div>

      {children}
    </div>
  );
}

export { Welcome };
