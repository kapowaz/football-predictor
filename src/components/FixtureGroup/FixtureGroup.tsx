import clsx from 'clsx';
import type { Match, PredictionsStore } from '../../types';
import { ChevronRightIcon } from '../icons';
import * as styles from './FixtureGroup.css';

interface FixtureGroupProps {
  /** Label text for the date group (e.g. "Monday 9 March") */
  dateLabel: string;
  /** Whether the group's fixture list is currently expanded */
  isExpanded: boolean;
  /** Whether all fixtures in this group have predictions */
  allPredicted: boolean;
  /** Fixtures in this date group, used for fixture indicators */
  matches: Match[];
  /** Predictions store for determining indicator colours */
  predictions: PredictionsStore;
  /** Called when the header is clicked to toggle expansion */
  onClick: () => void;
}

export const FixtureGroup = ({
  dateLabel,
  isExpanded,
  allPredicted,
  matches,
  predictions,
  onClick,
}: FixtureGroupProps) => (
  <button
    className={clsx(styles.dateHeader, isExpanded && styles.dateHeaderExpanded, allPredicted && styles.dateHeaderComplete)}
    onClick={onClick}
    aria-expanded={isExpanded}
  >
    <ChevronRightIcon className={clsx(styles.chevron, isExpanded && styles.chevronExpanded)} />
    {dateLabel}
    <span className={styles.fixtureIndicators}>
      {matches.map((match) => {
        const prediction = predictions.predictions[String(match.id)];
        return (
          <span
            key={match.id}
            className={clsx(styles.fixtureCircle, prediction != null && {
              [styles.fixtureCircleHomeWin]: prediction.homeGoals > prediction.awayGoals,
              [styles.fixtureCircleAwayWin]: prediction.homeGoals < prediction.awayGoals,
              [styles.fixtureCircleDraw]: prediction.homeGoals === prediction.awayGoals,
            })}
          />
        );
      })}
    </span>
  </button>
);
