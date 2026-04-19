import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { Match, PredictionsStore, Team } from '../types';
import { useTeamGroupedMatches } from './useTeamGroupedMatches';

const team = (id: number, name: string): Team => ({
  id,
  fotmobId: id,
  name,
  shortName: name,
  tla: name.slice(0, 3).toUpperCase(),
  badge: name.toLowerCase(),
});

const scheduled = (
  id: number,
  homeTeamId: number,
  awayTeamId: number,
  utcDate: string,
): Match => ({
  id,
  homeTeamId,
  awayTeamId,
  utcDate,
  status: 'SCHEDULED',
  homeGoals: null,
  awayGoals: null,
});

const finished = (
  id: number,
  homeTeamId: number,
  awayTeamId: number,
  utcDate: string,
  homeGoals: number,
  awayGoals: number,
): Match => ({
  id,
  homeTeamId,
  awayTeamId,
  utcDate,
  status: 'FINISHED',
  homeGoals,
  awayGoals,
});

const emptyPredictions: PredictionsStore = { predictions: {}, lastModified: '' };

const teams = [team(1, 'Arsenal'), team(2, 'Chelsea'), team(3, 'Liverpool')];
const teamsById = new Map(teams.map((t) => [t.id, t]));

describe('useTeamGroupedMatches', () => {
  it('groups matches by team when all teams are included', () => {
    const matches = [
      scheduled(100, 1, 2, '2025-04-10T15:00:00Z'),
      scheduled(101, 3, 1, '2025-04-12T15:00:00Z'),
    ];

    const { result } = renderHook(() =>
      useTeamGroupedMatches(matches, emptyPredictions, teamsById),
    );

    expect(result.current).toHaveLength(3);
    const arsenalGroup = result.current.find((g) => g.team?.id === 1);
    const chelseaGroup = result.current.find((g) => g.team?.id === 2);
    const liverpoolGroup = result.current.find((g) => g.team?.id === 3);

    expect(arsenalGroup?.matches).toHaveLength(2);
    expect(chelseaGroup?.matches).toHaveLength(1);
    expect(liverpoolGroup?.matches).toHaveLength(1);
  });

  it('filters to specified teams', () => {
    const matches = [
      scheduled(100, 1, 2, '2025-04-10T15:00:00Z'),
      scheduled(101, 3, 1, '2025-04-12T15:00:00Z'),
    ];

    const { result } = renderHook(() =>
      useTeamGroupedMatches(matches, emptyPredictions, teamsById, {
        filterTeams: [1, 2],
      }),
    );

    expect(result.current).toHaveLength(2);
    const arsenalGroup = result.current.find((g) => g.team?.id === 1);
    const chelseaGroup = result.current.find((g) => g.team?.id === 2);
    const liverpoolGroup = result.current.find((g) => g.team?.id === 3);

    expect(arsenalGroup?.matches).toHaveLength(2);
    expect(chelseaGroup?.matches).toHaveLength(1);
    expect(liverpoolGroup).toBeUndefined();
  });

  it('includes match in both team groups when both teams are in filter', () => {
    const matches = [scheduled(100, 1, 2, '2025-04-10T15:00:00Z')];

    const { result } = renderHook(() =>
      useTeamGroupedMatches(matches, emptyPredictions, teamsById, {
        filterTeams: [1, 2],
      }),
    );

    const arsenalGroup = result.current.find((g) => g.team?.id === 1);
    const chelseaGroup = result.current.find((g) => g.team?.id === 2);

    expect(arsenalGroup?.matches[0].id).toBe(100);
    expect(chelseaGroup?.matches[0].id).toBe(100);
  });

  it('sorts matches by date within each team group', () => {
    const matches = [
      scheduled(102, 1, 3, '2025-04-15T15:00:00Z'),
      scheduled(100, 1, 2, '2025-04-10T15:00:00Z'),
      scheduled(101, 2, 1, '2025-04-12T15:00:00Z'),
    ];

    const { result } = renderHook(() =>
      useTeamGroupedMatches(matches, emptyPredictions, teamsById, {
        filterTeams: [1],
      }),
    );

    const arsenalGroup = result.current.find((g) => g.team?.id === 1)!;
    expect(arsenalGroup.matches.map((m) => m.id)).toEqual([100, 101, 102]);
  });

  it('excludes finished matches when isShowingFinished is false', () => {
    const matches = [
      finished(100, 1, 2, '2025-04-10T15:00:00Z', 2, 1),
      scheduled(101, 1, 3, '2025-04-12T15:00:00Z'),
    ];

    const { result } = renderHook(() =>
      useTeamGroupedMatches(matches, emptyPredictions, teamsById, {
        filterTeams: [1],
        isShowingFinished: false,
      }),
    );

    const arsenalGroup = result.current.find((g) => g.team?.id === 1)!;
    expect(arsenalGroup.matches).toHaveLength(1);
    expect(arsenalGroup.matches[0].id).toBe(101);
  });

  it('sets isAllPredicted when all scheduled matches have predictions', () => {
    const matches = [scheduled(100, 1, 2, '2025-04-10T15:00:00Z')];
    const predictions: PredictionsStore = {
      predictions: { '100': { homeGoals: 2, awayGoals: 1 } },
      lastModified: '',
    };

    const { result } = renderHook(() =>
      useTeamGroupedMatches(matches, predictions, teamsById, {
        filterTeams: [1],
      }),
    );

    const arsenalGroup = result.current.find((g) => g.team?.id === 1)!;
    expect(arsenalGroup.isAllPredicted).toBe(true);
  });

  it('populates team field on each group', () => {
    const matches = [scheduled(100, 1, 2, '2025-04-10T15:00:00Z')];

    const { result } = renderHook(() =>
      useTeamGroupedMatches(matches, emptyPredictions, teamsById, {
        filterTeams: [1, 2],
      }),
    );

    for (const group of result.current) {
      expect(group.team).toBeDefined();
      expect(group.label).toBe(group.team!.name);
    }
  });

  it('sorts groups alphabetically by team name', () => {
    const matches = [
      scheduled(100, 1, 2, '2025-04-10T15:00:00Z'),
      scheduled(101, 3, 1, '2025-04-12T15:00:00Z'),
    ];

    const { result } = renderHook(() =>
      useTeamGroupedMatches(matches, emptyPredictions, teamsById),
    );

    const names = result.current.map((g) => g.label);
    expect(names).toEqual(['Arsenal', 'Chelsea', 'Liverpool']);
  });
});
