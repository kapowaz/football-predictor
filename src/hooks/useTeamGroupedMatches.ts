import { useMemo } from 'react';
import type { Match, PredictionsStore, Team } from '../types';
import type { FixtureGroupData } from '../components/FixtureList/types';

interface UseTeamGroupedMatchesOptions {
  /** Include completed fixtures in grouped results. */
  showFinished?: boolean;
  /** Team IDs to create groups for; matches must involve one of these teams. */
  filterTeams?: number[];
}

export const useTeamGroupedMatches = (
  matches: Match[],
  predictions: PredictionsStore,
  teamsById: ReadonlyMap<number, Team>,
  { showFinished = true, filterTeams = [] }: UseTeamGroupedMatchesOptions = {},
): FixtureGroupData[] => {
  const filterTeamSet = useMemo(() => new Set(filterTeams), [filterTeams]);
  const hasTeamFilter = filterTeams.length > 0;

  const visibleMatches = useMemo(() => {
    return matches
      .filter((match) => {
        if (match.status !== 'SCHEDULED' && !(showFinished && match.status === 'FINISHED')) {
          return false;
        }

        if (!hasTeamFilter) {
          return true;
        }

        return filterTeamSet.has(match.homeTeamId) || filterTeamSet.has(match.awayTeamId);
      })
      .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());
  }, [filterTeamSet, hasTeamFilter, matches, showFinished]);

  return useMemo(() => {
    const teamMatchMap = new Map<number, Match[]>();

    for (const match of visibleMatches) {
      const relevantTeamIds = hasTeamFilter
        ? [match.homeTeamId, match.awayTeamId].filter((id) => filterTeamSet.has(id))
        : [match.homeTeamId, match.awayTeamId];

      for (const teamId of relevantTeamIds) {
        const existing = teamMatchMap.get(teamId) || [];
        teamMatchMap.set(teamId, [...existing, match]);
      }
    }

    const result: FixtureGroupData[] = [];
    for (const [teamId, teamMatches] of teamMatchMap.entries()) {
      const team = teamsById.get(teamId);
      if (!team) continue;

      result.push({
        key: String(teamId),
        label: team.name,
        matches: teamMatches,
        allPredicted: teamMatches.every(
          (match) =>
            match.status === 'FINISHED' || predictions.predictions[String(match.id)] != null,
        ),
        team,
      });
    }

    return result.sort((a, b) => a.label.localeCompare(b.label));
  }, [visibleMatches, predictions, teamsById, hasTeamFilter, filterTeamSet]);
};
