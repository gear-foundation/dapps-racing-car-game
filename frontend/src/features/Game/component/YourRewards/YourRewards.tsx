import styles from './YourRewards.module.scss';
import { cx } from '@/utils';
import { ReactComponent as YourRewardsSVG } from '@/assets/icons/your-rewards-icon.svg';
import { YourRewardsProps } from './YourRewards.interface';
import { ScorePPV } from '@/features/ScoreBalance/components/ScorePPV';

function YourRewards({ rewards }: YourRewardsProps) {
  return (
    <>
      {rewards ? (
        <div className={cx(styles.rewards)}>
          <YourRewardsSVG />
          <ScorePPV>{rewards}</ScorePPV>
        </div>
      ) : null}
    </>
  );
}

export { YourRewards };
