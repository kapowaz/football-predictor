import { useMemo } from 'react';
import type { Match, PredictionsStore, TeamStanding } from '../types';
import type { ZoneDefinition } from '../data/competitions';
import { calculateZoneThresholds, type ZoneThreshold } from '../utils/zoneThresholds';

/**
 * Computes zone point thresholds using Dinic max-flow, recomputing
 * whenever standings, matches, predictions, or zones change.
 */
export const useZoneThresholds = (
  standings: TeamStanding[],
  matches: Match[],
  predictions: PredictionsStore,
  zones: ZoneDefinition[],
): ZoneThreshold[] => {
  return useMemo(
    () => calculateZoneThresholds(standings, matches, predictions, zones),
    [standings, matches, predictions, zones],
  );
};
