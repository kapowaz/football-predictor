import { memo, useMemo } from 'react';
import type { TeamStanding, VariantRulesMode } from '../../types';
import type { ZoneDefinition } from '../../data/competitions';
import { useCompetitionData } from '../../hooks/useCompetitionData';
import { useLiveScores } from '../../hooks/useLiveScores';
import { useGroupedMatches } from '../../hooks/useGroupedMatches';
import { useTeamGroupedMatches } from '../../hooks/useTeamGroupedMatches';
import { selectStandingsViewModel, selectTeamsById } from '../../state/selectors';
import { useCompetitionSessionSlice } from '../../state/useCompetitionSessionSlice';
import { getEffectivePredictions, getLiveScoreMatchIds } from '../../utils/liveScores';
import { FixtureList } from '../FixtureList/FixtureList';
import type { GroupBy } from '../FixtureList/types';

interface FixturePanelProps {
  /** Competition slug used to read fixture/session state. */
  slug: string;
  /** Whether the fixtures panel is currently visible to the user. */
  isVisible?: boolean;
  /** Whether completed fixtures should be included. */
  showFinished?: boolean;
  /** Optional list of team IDs to keep in the fixture list. */
  filterTeams?: number[];
  /** How to group the fixtures. */
  groupBy: GroupBy;
  /** Whether to display the fixture date inside each FixtureCard. */
  showDate?: boolean;
  /** Competition zones used for standing position badge colours. */
  zones: ZoneDefinition[];
  /** Enable variant rules mode for indicator dots. */
  variantRules?: VariantRulesMode;
  /** Pre-computed standings from the parent. When provided, avoids an independent selectStandingsViewModel call that can thrash the single-entry memoization cache. */
  standings?: TeamStanding[];
}

const EMPTY_FILTER_TEAMS: number[] = [];

export const FixturePanel = memo(({
  slug,
  isVisible = true,
  showFinished = true,
  filterTeams = EMPTY_FILTER_TEAMS,
  groupBy,
  showDate = false,
  zones,
  variantRules = false as VariantRulesMode,
  standings: standingsProp,
}: FixturePanelProps) => {
  const { teams, matches } = useCompetitionData(slug);
  const { session, setPrediction, removePrediction, setNavigateToMatchId } =
    useCompetitionSessionSlice(slug);

  const { liveScores } = useLiveScores(slug);
  const sessionPredictions = session?.predictions;
  const rawPredictions = useMemo(
    () => sessionPredictions ?? { predictions: {}, lastModified: '' },
    [sessionPredictions],
  );
  const predictions = useMemo(
    () => getEffectivePredictions(rawPredictions, liveScores),
    [rawPredictions, liveScores],
  );
  const liveScoreMatchIds = useMemo(
    () => getLiveScoreMatchIds(rawPredictions, liveScores),
    [rawPredictions, liveScores],
  );
  const deductions = session?.deductions ?? [];
  const navigateToMatchId = session?.navigateToMatchId ?? null;
  const teamsById = selectTeamsById(teams);

  const computedStandings = standingsProp
    ?? selectStandingsViewModel(teams, matches, predictions, deductions, zones, variantRules).standings;

  const standingPositionsByTeamId = useMemo(
    () =>
      new Map(
        computedStandings.map((entry, index) => {
          return [entry.team.id, index + 1] as const;
        }),
      ),
    [computedStandings],
  );

  const groupOptions = useMemo(
    () => ({ showFinished, filterTeams }),
    [showFinished, filterTeams],
  );

  const dateGroups = useGroupedMatches(matches, predictions, teamsById, groupOptions);
  const teamGroups = useTeamGroupedMatches(matches, predictions, teamsById, groupOptions);

  const sortedTeamGroups = useMemo(
    () =>
      [...teamGroups].sort((a, b) => {
        const posA = a.team ? (standingPositionsByTeamId.get(a.team.id) ?? Infinity) : Infinity;
        const posB = b.team ? (standingPositionsByTeamId.get(b.team.id) ?? Infinity) : Infinity;
        return posA - posB;
      }),
    [teamGroups, standingPositionsByTeamId],
  );

  const groups = groupBy === 'team' ? sortedTeamGroups : dateGroups;

  if (!session) {
    return null;
  }

  return (
    <FixtureList
      groups={groups}
      teamsById={teamsById}
      predictions={predictions}
      liveScoreMatchIds={liveScoreMatchIds}
      navigateToMatchId={navigateToMatchId}
      setPrediction={setPrediction}
      removePrediction={removePrediction}
      setNavigateToMatchId={setNavigateToMatchId}
      standingPositionsByTeamId={standingPositionsByTeamId}
      zones={zones}
      showDate={showDate}
      isVisible={isVisible}
      variantRules={variantRules}
    />
  );
});
