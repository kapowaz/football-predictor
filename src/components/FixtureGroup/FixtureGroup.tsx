import clsx from 'clsx';
import type { Match, PredictionsStore, Team } from '../../types';
import { getCrest } from '../../assets/crests';
import { ChevronRightIcon } from '../icons';
import * as styles from './FixtureGroup.css';

interface FixtureGroupProps {
  /** Label text for the group header (e.g. "Monday 9 March" or "Arsenal"). */
  label: string;
  /** Team this group represents; when provided, the header shows crest + name. */
  team?: Team;
  /** Whether the group's fixture list is currently expanded. */
  isExpanded: boolean;
  /** Whether all fixtures in this group have predictions. */
  allPredicted: boolean;
  /** Fixtures in this group, used for fixture indicators. */
  matches: Match[];
  /** Predictions store for determining indicator colours. */
  predictions: PredictionsStore;
  /** Called when the header is clicked to toggle expansion. */
  onClick: () => void;
}

const getIndicatorClass = (
  match: Match,
  result: { homeGoals: number; awayGoals: number },
  team?: Team,
): string => {
  if (team) {
    const isHome = match.homeTeamId === team.id;
    const teamGoals = isHome ? result.homeGoals : result.awayGoals;
    const opponentGoals = isHome ? result.awayGoals : result.homeGoals;

    if (teamGoals > opponentGoals) return styles.fixtureCircleWin;
    if (teamGoals < opponentGoals) return styles.fixtureCircleLoss;
    return styles.fixtureCircleDraw;
  }

  if (result.homeGoals > result.awayGoals) return styles.fixtureCircleWin;
  if (result.homeGoals < result.awayGoals) return styles.fixtureCircleLoss;
  return styles.fixtureCircleDraw;
};

export const FixtureGroup = ({
  label,
  team,
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
    {team ? (
      <span className={styles.teamLabel}>
        <img src={getCrest(team.crest)} alt="" className={styles.teamCrest} />
        {team.name}
      </span>
    ) : (
      label
    )}
    <span className={styles.fixtureIndicators}>
      {matches.map((match) => {
        const indicatorResult =
          match.status === 'FINISHED'
            ? { homeGoals: match.homeGoals, awayGoals: match.awayGoals }
            : predictions.predictions[String(match.id)];

        return (
          <span
            key={match.id}
            className={clsx(
              styles.fixtureCircle,
              indicatorResult != null && getIndicatorClass(match, indicatorResult, team),
            )}
          />
        );
      })}
    </span>
  </button>
);
