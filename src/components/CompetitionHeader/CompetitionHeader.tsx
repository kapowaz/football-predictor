import type { CompetitionConfig } from '../../competitions';
import { CompetitionSelect } from '../CompetitionSelect';
import { ThemeToggle } from '../ThemeToggle';
import footballPredictorLogo from '../../assets/football-predictor.svg';
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
  /** Called when the user toggles the theme */
  onThemeToggle: () => void;
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
      <h1 className={styles.title}>Football Predictor</h1>
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
    </header>
  );
};
