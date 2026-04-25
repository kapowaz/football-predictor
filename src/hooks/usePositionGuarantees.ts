import { useMemo } from 'react';

import type { Match, PredictionsStore, TeamStanding } from '../types';
import { calculatePositionGuaranteedByTeamId } from '../utils/zoneGuarantees';

/**
 * Computes which teams' exact final league position is mathematically locked.
 * Runs synchronously on the main thread: the pointwise check is O(n²) which
 * is trivial for league sizes (≤24 teams).
 */
export const usePositionGuarantees = (
  standings: TeamStanding[],
  matches: Match[],
  predictions: PredictionsStore,
): Map<number, boolean> => {
  return useMemo(
    () => calculatePositionGuaranteedByTeamId(standings, matches, predictions),
    [standings, matches, predictions],
  );
};
