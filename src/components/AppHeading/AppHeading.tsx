import { AbstractText } from '@kapowaz/components';

import footballPredictorLogo from '../../assets/football-predictor-logo.svg';

import * as styles from './AppHeading.css';

interface AppHeadingProps {
  /** Forces the heading to render in its largest viewport form. */
  isFullRender?: boolean;

  /** Hides the h1 text, rendering only the logo. */
  isTitleHidden?: boolean;

  /** Extra content to render inside the heading. */
  extraContent?: React.ReactNode;
}

export const AppHeading = ({
  isFullRender = false,
  isTitleHidden = false,
  extraContent,
}: AppHeadingProps) => {
  return (
    <div className={styles.container}>
      <img
        src={footballPredictorLogo}
        alt="Football Predictor"
        className={styles.logo}
      />
      {!isTitleHidden && (
        <AbstractText
          tagName="h1"
          className={styles.title}
          fontSize={isFullRender ? 'huge' : 'xl'}
          fontWeight="bold"
        >
          Predictor
        </AbstractText>
      )}
      {extraContent && (
        <div className={styles.extraContent}>{extraContent}</div>
      )}
    </div>
  );
};
