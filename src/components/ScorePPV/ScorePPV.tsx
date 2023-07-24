import { cx } from '@/utils';
import styles from './ScorePPV.module.scss';
import ScoreStarSVG from '@/assets/icons/ic-star-icon.svg';
import { ScorePPVProps } from './ScorePPV.interface';

function ScorePPV({ children }: ScorePPVProps) {
  return (
    <div className={cx(styles['score-content'])}>
      <img src={ScoreStarSVG} alt="score star" className={cx(styles['score-content-img'])} />
      <span className={cx(styles['score-content-value'])}> {children}</span>
      <span className={cx(styles['score-content-unit'])}>PPV</span>
    </div>
  );
}

export { ScorePPV };
