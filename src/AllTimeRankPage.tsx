import { useMemo } from 'react';
import { useTheme } from './hooks/useTheme';
import { AppHeading } from './components/AppHeading';
import { ColorModeToggle } from './components/ColorModeToggle';
import { AllTimeRankTable } from './components/AllTimeRankTable';
import { allTimeClubs } from './data/all-time-rank';
import { calculateAllTimeScores, DEFAULT_WEIGHTS } from './utils/allTimeRank';
import * as styles from './AllTimeRankPage.css';

export const AllTimeRankPage = () => {
  const { theme, toggleTheme } = useTheme();
  const weights = DEFAULT_WEIGHTS;

  const rankedClubs = useMemo(
    () => calculateAllTimeScores(allTimeClubs, weights),
    [weights],
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <AppHeading hideTitle />
          <h2 className={styles.title}>All Time Rank</h2>
        </div>
        <ColorModeToggle colorMode={theme} onColorModeToggle={toggleTheme} />
      </header>
      <div className={styles.descriptionBlock}>
        <p className={styles.description}>
          Each club's score combines four components, with a time decay applied so that recent
          achievements count for more than older ones.
        </p>
        <ul className={styles.componentList}>
          <li>
            <strong>League:</strong> a total score for wins and draws, weighted by football pyramid level
            <span className={styles.formula}>{'Σ (3W + D) × tierWeight × decay(year), tiers: 4/3/2/1'}</span>
          </li>
          <li>
            <strong>Domestic Honours:</strong> a score for championships and domestic cups
            <span className={styles.formula}>{'titles: 25 × tier, runners-up: 12.5 × tier, playoffs: 5 × tier, FA Cup: 80/40, League Cup: 50/25'}</span>
          </li>
          <li>
            <strong>European Honours:</strong> a score for European competition cups
            <span className={styles.formula}>{'UCL: 200/100, UEL: 100/50, UECL: 50/25 — each × decay(year)'}</span>
          </li>
          <li>
            <strong>Attendance:</strong> a score based on average historical attendance
            <span className={styles.formula}>{'avgAttendance × 0.01'}</span>
          </li>
        </ul>
      </div>
      <div className={styles.tableWrapper}>
        <AllTimeRankTable rankedClubs={rankedClubs} weights={weights} />
      </div>
    </div>
  );
};
