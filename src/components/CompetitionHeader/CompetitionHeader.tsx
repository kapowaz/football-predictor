import type { CompetitionConfig } from '../../data/competitions';
import { CompetitionSelect } from '../CompetitionSelect';
import { ThemeToggle } from '../ThemeToggle';
import footballPredictorLogo from '../../assets/football-predictor-logo.svg';
import * as styles from './CompetitionHeader.css';

interface CompetitionHeaderProps {
  /** All available competitions to show in the select dropdown */
  competitions: CompetitionConfig[];
  /** Currently active competition slug */
  activeSlug: string;
  /** Called when the user selects a different competition */
  onCompetitionChange: (slug: string) => void;
  /** The current active theme */
  theme: 'light' | 'dark';
  /** Called with the next theme when the user toggles color mode */
  onThemeToggle: (colorMode: 'light' | 'dark') => void;
}

export const CompetitionHeader = ({
  competitions,
  activeSlug,
  onCompetitionChange,
  theme,
  onThemeToggle,
}: CompetitionHeaderProps) => {
  return (
    <header className={styles.header}>
      <img src={footballPredictorLogo} alt="Football Predictor" className={styles.logo} />
      <h1 className={styles.title}>
        <span className={styles.titlePrefix}>Football </span>Predictor
      </h1>
      <div className={styles.controls}>
        {competitions.length > 1 && (
          <div className={styles.competitionSelectWrapper}>
            <CompetitionSelect
              competitions={competitions}
              value={activeSlug}
              onChange={onCompetitionChange}
            />
          </div>
        )}
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
      </div>
    </header>
  );
};
