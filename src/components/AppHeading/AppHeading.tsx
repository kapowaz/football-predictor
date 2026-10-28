import futmegMark from '../../assets/futmeg-mark.svg';
import futmegTextLogoDark from '../../assets/futmeg-textlogo-dark.svg';
import futmegTextLogoLight from '../../assets/futmeg-textlogo-light.svg';

import * as styles from './AppHeading.css';

interface AppHeadingProps {
  /** Forces the heading to render in its largest viewport form. */
  isFullRender?: boolean;

  /** Hides the logo text, rendering only the square mark. */
  isTitleHidden?: boolean;

  /** Extra content to render inside the heading. */
  extraContent?: React.ReactNode;
}

export const AppHeading = ({
  isFullRender = false,
  isTitleHidden = false,
  extraContent,
}: AppHeadingProps) => {
  const size = isFullRender ? 'full' : 'default';

  return (
    <div className={styles.container}>
      {isTitleHidden ? (
        <img src={futmegMark} alt="Futmeg" className={styles.mark} />
      ) : (
        <h1 className={styles.title}>
          <img
            src={futmegTextLogoLight}
            alt="Futmeg"
            className={styles.logoLight[size]}
          />
          <img
            src={futmegTextLogoDark}
            alt="Futmeg"
            className={styles.logoDark[size]}
          />
        </h1>
      )}
      {extraContent && (
        <div className={styles.extraContent}>{extraContent}</div>
      )}
    </div>
  );
};
