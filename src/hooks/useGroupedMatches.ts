import { useMemo } from 'react';
import type { Match, PredictionsStore, Team } from '../types';
import type { FixtureGroupData } from '../components/FixtureList/types';

export type { FixtureGroupData };

interface UseGroupedMatchesOptions {
  /** Whether completed fixtures are included in grouped results. */
  isShowingFinished?: boolean;
  /** Optional team filter; matches must involve one of these team IDs. */
  filterTeams?: number[];
}

const formatDateLabel = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
};

const getDateKey = (utcDate: string): string => {
  return new Date(utcDate).toISOString().split('T')[0];
};

export const useGroupedMatches = (
  matches: Match[],
  predictions: PredictionsStore,
  teamsById: ReadonlyMap<number, Team>,
  { isShowingFinished = true, filterTeams = [] }: UseGroupedMatchesOptions = {},
): FixtureGroupData[] => {
  const filterTeamSet = useMemo(() => new Set(filterTeams), [filterTeams]);
  const hasTeamFilter = filterTeams.length > 0;

  const visibleMatches = useMemo(() => {
    return matches
      .filter((match) => {
        if (match.status !== 'SCHEDULED' && !(isShowingFinished && match.status === 'FINISHED')) {
          return false;
        }

        if (!hasTeamFilter) {
          return true;
        }

        return filterTeamSet.has(match.homeTeamId) || filterTeamSet.has(match.awayTeamId);
      })
      .sort((a, b) => {
        const timeDiff = new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime();
        if (timeDiff !== 0) return timeDiff;
        const homeA = teamsById.get(a.homeTeamId)?.name ?? '';
        const homeB = teamsById.get(b.homeTeamId)?.name ?? '';
        return homeA.localeCompare(homeB);
      });
  }, [filterTeamSet, hasTeamFilter, matches, isShowingFinished, teamsById]);

  return useMemo(() => {
    const groups = new Map<string, Match[]>();

    for (const match of visibleMatches) {
      const dateKey = getDateKey(match.utcDate);
      const existing = groups.get(dateKey) || [];
      groups.set(dateKey, [...existing, match]);
    }

    const result: FixtureGroupData[] = [];
    for (const [date, dateMatches] of groups.entries()) {
      result.push({
        key: date,
        label: formatDateLabel(date),
        matches: dateMatches,
        isAllPredicted: dateMatches.every(
          (match) =>
            match.status === 'FINISHED' || predictions.predictions[String(match.id)] != null,
        ),
      });
    }

    return result.sort((a, b) => a.key.localeCompare(b.key));
  }, [visibleMatches, predictions]);
};
