import { useMemo } from 'react';
import type { ZoneDefinition } from '../../data/competitions';
import { useCompetitionData } from '../../hooks/useCompetitionData';
import { useGroupedMatches } from '../../hooks/useGroupedMatches';
import { useTeamGroupedMatches } from '../../hooks/useTeamGroupedMatches';
import { selectStandingsViewModel, selectTeamsById } from '../../state/selectors';
import { useCompetitionSessionSlice } from '../../state/useCompetitionSessionSlice';
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
  variantRules?: boolean;
}

const EMPTY_FILTER_TEAMS: number[] = [];

export const FixturePanel = ({
  slug,
  isVisible = true,
  showFinished = true,
  filterTeams = EMPTY_FILTER_TEAMS,
  groupBy,
  showDate = false,
  zones,
  variantRules = false,
}: FixturePanelProps) => {
  const { teams, matches } = useCompetitionData(slug);
  const { session, setPrediction, removePrediction, setNavigateToMatchId } =
    useCompetitionSessionSlice(slug);

  const predictions = session?.predictions ?? { predictions: {}, lastModified: '' };
  const deductions = session?.deductions ?? [];
  const navigateToMatchId = session?.navigateToMatchId ?? null;
  const teamsById = selectTeamsById(teams);

  const { standings } = selectStandingsViewModel(teams, matches, predictions, deductions, zones, variantRules);

  const standingPositionsByTeamId = useMemo(
    () =>
      new Map(
        standings.map((entry, index) => {
          return [entry.team.id, index + 1] as const;
        }),
      ),
    [standings],
  );

  const groupOptions = useMemo(
    () => ({ showFinished, filterTeams }),
    [showFinished, filterTeams],
  );

  const dateGroups = useGroupedMatches(matches, predictions, groupOptions);
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
};
