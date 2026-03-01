import { useMemo } from 'react';
import type { Team, Match, TeamStanding, PredictionsStore } from '../types';
import { calculateStandings } from '../utils/standings';

export function useStandings(
  teams: Team[],
  matches: Match[],
  predictions: PredictionsStore
): TeamStanding[] {
  return useMemo(() => {
    return calculateStandings(teams, matches, predictions);
  }, [teams, matches, predictions]);
}
