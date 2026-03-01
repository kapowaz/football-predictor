import { useMemo } from 'react';
import type { Team, Match, TeamStanding, PointDeduction, PredictionsStore } from '../types';
import { calculateStandings } from '../utils/standings';

export function useStandings(
  teams: Team[],
  matches: Match[],
  predictions: PredictionsStore,
  deductions: PointDeduction[] = [],
): TeamStanding[] {
  return useMemo(() => {
    return calculateStandings(teams, matches, predictions, deductions);
  }, [teams, matches, predictions, deductions]);
}
