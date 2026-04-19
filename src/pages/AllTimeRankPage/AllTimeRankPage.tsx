import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { AppHeading } from '../../components/AppHeading';
import { LoadingIndicator, ToggleColorMode } from '@kapowaz/components';
import { getDesignTokens } from '@kapowaz/design-tokens';
import { ChevronRight } from '@kapowaz/icons';
import { AllTimeRankTable } from '../../components/AllTimeRankTable';
import type { AllTimeClubData } from '../../data/all-time-rank';
import { loadAllTimeClubs } from '../../data/all-time-rank';
import { calculateAllTimeScores, DEFAULT_WEIGHTS, HONOUR_BASE_VALUES } from '../../utils/allTimeRank';

const { colors } = getDesignTokens();
import * as styles from './AllTimeRankPage.css';

export const AllTimeRankPage = () => {
  const weights = DEFAULT_WEIGHTS;
  const [isExpanded, setIsExpanded] = useState(false);
  const [clubs, setClubs] = useState<AllTimeClubData[] | null>(null);

  useEffect(() => {
    loadAllTimeClubs().then((data) => {
      setTimeout(() => setClubs(data), 1000);
    });
  }, []);

  const rankedClubs = useMemo(
    () => (clubs ? calculateAllTimeScores(clubs, weights) : []),
    [clubs, weights],
  );

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <AppHeading isTitleHidden />
          <h2 className={styles.title}>All Time Rank</h2>
        </div>
        <ToggleColorMode />
      </header>
      <div className={styles.descriptionBlock}>
        <button
          className={styles.descriptionToggle}
          onClick={toggleExpanded}
          aria-expanded={isExpanded}
        >
          <ChevronRight
            className={clsx(styles.chevron, isExpanded && styles.chevronExpanded)}
          />
          How are teams ranked?
        </button>
        <div
          className={clsx(
            styles.descriptionContent,
            isExpanded && styles.descriptionContentExpanded,
          )}
        >
          <div className={styles.descriptionInner}>
            <p className={styles.description}>
              Each club's score combines four components, with a time decay applied so that recent
              achievements count for more than older ones.
            </p>
            <ul className={styles.componentList}>
              <li>
                <strong>League:</strong> a total score for wins and draws, with a multiplier for
                football pyramid level
                <span className={styles.formula}>
                  Σ (3W + D) × tierMultiplier × decay(year) × 0.5
                </span>
              </li>
              <li>
                <strong>Domestic Honours:</strong> a bonus for championships and domestic cups
                <span className={styles.formula}>
                  titles: {HONOUR_BASE_VALUES.league.champions} × tierMultiplier, runners-up:{' '}
                  {HONOUR_BASE_VALUES.league.runnersUp} × tierMultiplier, playoffs:{' '}
                  {HONOUR_BASE_VALUES.league.playoffWinners} × tierMultiplier, FA Cup:{' '}
                  {HONOUR_BASE_VALUES.faCup.winners}/{HONOUR_BASE_VALUES.faCup.runnersUp}, League
                  Cup: {HONOUR_BASE_VALUES.leagueCup.winners}/
                  {HONOUR_BASE_VALUES.leagueCup.runnersUp}
                </span>
              </li>
              <li>
                <strong>European Honours:</strong> a score for European competition cups
                <span className={styles.formula}>
                  UCL: {HONOUR_BASE_VALUES.championsLeague.winners}/
                  {HONOUR_BASE_VALUES.championsLeague.runnersUp}, UEL:{' '}
                  {HONOUR_BASE_VALUES.europaLeague.winners}/
                  {HONOUR_BASE_VALUES.europaLeague.runnersUp}, UECL:{' '}
                  {HONOUR_BASE_VALUES.conferenceLeague.winners}/
                  {HONOUR_BASE_VALUES.conferenceLeague.runnersUp} — each × decay(year)
                </span>
              </li>
              <li>
                <strong>Attendance:</strong> a score based on average historical attendance
                <span className={styles.formula}>avgAttendance × {weights.attendance}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        {clubs ? (
          <AllTimeRankTable rankedClubs={rankedClubs} weights={weights} />
        ) : (
          <div className={styles.loading}>
            <LoadingIndicator size="xl" customColor={{ light: colors.slate[300], dark: colors.ink[700] }} />
          </div>
        )}
      </div>
    </div>
  );
};
