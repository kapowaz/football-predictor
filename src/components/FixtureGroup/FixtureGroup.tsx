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
  /** Enable variant rules mode: distinguishes bonus wins (2+ goal margin) in indicators. */
  variantRules?: boolean;
}

const getIndicatorClass = (
  match: Match,
  result: { homeGoals: number; awayGoals: number },
  team?: Team,
  variantRules = false,
): string => {
  if (team) {
    const isHome = match.homeTeamId === team.id;
    const teamGoals = isHome ? result.homeGoals : result.awayGoals;
    const opponentGoals = isHome ? result.awayGoals : result.homeGoals;

    if (teamGoals > opponentGoals) {
      if (variantRules && teamGoals - opponentGoals >= 2) return styles.fixtureCircleBonus;
      return styles.fixtureCircleWin;
    }
    if (teamGoals < opponentGoals) {
      if (variantRules && opponentGoals - teamGoals >= 2) return styles.fixtureCircleBonusAway;
      return styles.fixtureCircleLoss;
    }
    return styles.fixtureCircleDraw;
  }

  const margin = Math.abs(result.homeGoals - result.awayGoals);
  if (result.homeGoals > result.awayGoals) {
    if (variantRules && margin >= 2) return styles.fixtureCircleBonus;
    return styles.fixtureCircleWin;
  }
  if (result.homeGoals < result.awayGoals) {
    if (variantRules && margin >= 2) return styles.fixtureCircleBonusAway;
    return styles.fixtureCircleLoss;
  }
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
  variantRules = false,
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
              indicatorResult != null && getIndicatorClass(match, indicatorResult, team, variantRules),
            )}
          />
        );
      })}
    </span>
  </button>
);
