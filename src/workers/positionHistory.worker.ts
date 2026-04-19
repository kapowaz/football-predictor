import type {
  Team,
  Match,
  PredictionsStore,
  PointDeduction,
  VariantRulesMode,
} from '../types';
import { calculatePositionHistory } from '../utils/positionHistory';

export interface PositionHistoryRequest {
  requestId: number;
  teams: Team[];
  matches: Match[];
  predictions: PredictionsStore;
  deductions: PointDeduction[];
  variantRules?: VariantRulesMode;
}

export interface PositionHistoryResponse {
  requestId: number;
  result: Record<number, number[]>;
}

self.addEventListener(
  'message',
  (event: MessageEvent<PositionHistoryRequest>) => {
    const { requestId, teams, matches, predictions, deductions, variantRules } =
      event.data;
    const map = calculatePositionHistory(
      teams,
      matches,
      predictions,
      deductions,
      variantRules,
    );

    const result: Record<number, number[]> = {};
    for (const [teamId, positions] of map) {
      result[teamId] = positions;
    }

    const response: PositionHistoryResponse = { requestId, result };
    self.postMessage(response);
  },
);
