import { Spinner } from '@/components';
import { HeadingProps } from './Heading.interface';
import styles from './Heading.module.scss';
import { cx } from '@/utils';

function Heading({ currentTurn, isPlayerAction, winStatus }: HeadingProps) {
  return (
    <div className={cx(styles.heading)}>
      <h1 className={cx(styles['heading-title'], styles[`heading-title-with-gradient-${winStatus}`])}>
        {!winStatus && 'Racing Car Game'}
        {winStatus === 'win' && 'You Win'}
        {winStatus === 'draw' && `It's A Draw`}
        {winStatus === 'lose' && 'You Lose'}
      </h1>
      <h3 className={cx(styles['heading-description'])}>
        {!winStatus && 'Either accelerate or shoot at the nearest car to win.'}
        {winStatus === 'win' &&
          'Congratulations, the game is over, you won! Play and win to make it to the Leaderboard.'}
        {winStatus === 'draw' && `The game is over, it's a draw! Try again to win.`}
        {winStatus === 'lose' && 'Try playing again to win and earn PPV. Play and win to make it to the Leaderboard.'}
      </h3>
      <div className={cx(styles.turn)}>
        <span className={cx(styles['turn-value'])}>Turn {currentTurn}</span>
        {!isPlayerAction && <Spinner />}
      </div>
    </div>
  );
}

export { Heading };
