import footballPredictorLogo from '../../assets/football-predictor-logo.svg';
import * as styles from './AppHeading.css';

interface AppHeadingProps {
  /** Forces the heading to render in its largest viewport form. */
  shouldFullRender?: boolean;
}

export const AppHeading = ({ shouldFullRender = false }: AppHeadingProps) => {
  return (
    <>
      <img src={footballPredictorLogo} alt="Football Predictor" className={styles.logo} />
      <h1 className={shouldFullRender ? styles.titleFullRender : styles.title}>
        <span className={shouldFullRender ? undefined : styles.titlePrefix}>Football </span>Predictor
      </h1>
    </>
  );
};
