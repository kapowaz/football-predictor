import footballPredictorLogo from '../../assets/football-predictor-logo.svg';
import * as styles from './AppHeading.css';

interface AppHeadingProps {
  /** Forces the heading to render in its largest viewport form. */
  shouldFullRender?: boolean;
  /** Extra content to render inside the heading. */
  extraContent?: React.ReactNode;
}

export const AppHeading = ({ shouldFullRender = false, extraContent }: AppHeadingProps) => {
  return (
    <div className={styles.container}>
      <img src={footballPredictorLogo} alt="Football Predictor" className={styles.logo} />
      <h1 className={shouldFullRender ? styles.titleFullRender : styles.title}>
        <span className={shouldFullRender ? undefined : styles.titlePrefix}>Football </span>
        Predictor
      </h1>
      {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
    </div>
  );
};
