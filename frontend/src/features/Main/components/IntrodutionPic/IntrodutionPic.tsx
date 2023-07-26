import carsImg from '@/assets/icons/introdution-cars-img.png';
import styles from './IntrodutionInfo.module.scss';
import { cx } from '@/utils';

function IntrodutionPic() {
  return <img src={carsImg} alt="cars" />;
}

export { IntrodutionPic };
