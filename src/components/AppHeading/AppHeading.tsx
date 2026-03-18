import footballPredictorLogo from '../../assets/football-predictor-logo.svg';
import * as styles from './AppHeading.css';

interface AppHeadingProps {
  /** Forces the heading to render in its largest viewport form. */
  shouldFullRender?: boolean;

  /** Hides the h1 text, rendering only the logo. */
  hideTitle?: boolean;

  /** Extra content to render inside the heading. */
  extraContent?: React.ReactNode;
}

export const AppHeading = ({ shouldFullRender = false, hideTitle = false, extraContent }: AppHeadingProps) => {
  return (
    <div className={styles.container}>
      <img src={footballPredictorLogo} alt="Football Predictor" className={styles.logo} />
      {!hideTitle && (
        <h1 className={shouldFullRender ? styles.titleFullRender : styles.title}>
          Football Predictor
        </h1>
      )}
      {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
    </div>
  );
};
