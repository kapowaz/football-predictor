import type { Match, PredictionsStore, TeamStanding } from '../types';
import type { ZoneDefinition } from '../data/competitions';
import { calculateZoneThresholds, type ZoneThreshold } from '../utils/zoneThresholds';

export interface ZoneThresholdsRequest {
  requestId: number;
  standings: TeamStanding[];
  matches: Match[];
  predictions: PredictionsStore;
  zones: ZoneDefinition[];
}

export interface ZoneThresholdsResponse {
  requestId: number;
  result: ZoneThreshold[];
}

self.addEventListener('message', (event: MessageEvent<ZoneThresholdsRequest>) => {
  const { requestId, standings, matches, predictions, zones } = event.data;
  const result = calculateZoneThresholds(standings, matches, predictions, zones);
  const response: ZoneThresholdsResponse = { requestId, result };
  self.postMessage(response);
});
