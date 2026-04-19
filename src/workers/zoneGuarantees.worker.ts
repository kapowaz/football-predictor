import type { ZoneDefinition } from '../data/competitions';
import type { Match, PredictionsStore, TeamStanding } from '../types';
import { calculateZoneGuaranteedByTeamId } from '../utils/zoneGuarantees';

export interface ZoneGuaranteesRequest {
  requestId: number;
  standings: TeamStanding[];
  matches: Match[];
  predictions: PredictionsStore;
  zones: ZoneDefinition[];
}

export interface ZoneGuaranteesResponse {
  requestId: number;
  result: Record<number, boolean>;
}

self.addEventListener(
  'message',
  (event: MessageEvent<ZoneGuaranteesRequest>) => {
    const { requestId, standings, matches, predictions, zones } = event.data;
    const map = calculateZoneGuaranteedByTeamId(
      standings,
      matches,
      predictions,
      zones,
    );

    const result: Record<number, boolean> = {};
    for (const [teamId, guaranteed] of map) {
      result[teamId] = guaranteed;
    }

    const response: ZoneGuaranteesResponse = { requestId, result };
    self.postMessage(response);
  },
);
