import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ui';
import { CURRENT_GAME } from '@/atoms';
import { START } from '@/App.routes';
import { Welcome } from '@/features/Main/components';
import styles from './Layout.module.scss';
import { cx } from '@/utils';

function Layout() {
  const navigate = useNavigate();
  const currentGame = useAtomValue(CURRENT_GAME);

  const handleGoToPlay = () => {
    navigate(START, { replace: true });
  };

  return (
    <Welcome>
      <Button
        label={currentGame ? 'Continue Game' : 'Start the game'}
        variant="primary"
        size="large"
        onClick={handleGoToPlay}
        className={cx(styles['game-button'])}
      />
    </Welcome>
  );
}

export { Layout };
