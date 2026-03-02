import type { PointDeduction, PredictionsStore } from '../types';

type PredictionsPayload = PredictionsStore['predictions'];

const serializePredictions = (predictions: PredictionsPayload): string => {
  return Object.entries(predictions)
    .map(([matchId, { homeGoals, awayGoals }]) => `${matchId}:${homeGoals}:${awayGoals}`)
    .join(';');
};

const deserializePredictions = (serialized: string): PredictionsPayload => {
  if (!serialized) return {};

  return Object.fromEntries(
    serialized.split(';').map((entry) => {
      const [matchId, home, away] = entry.split(':');
      return [matchId, { homeGoals: Number(home), awayGoals: Number(away) }];
    }),
  );
};

export const encodePredictions = (predictions: PredictionsPayload): string => {
  return btoa(serializePredictions(predictions));
};

export const decodePredictions = (encoded: string): PredictionsPayload => {
  return deserializePredictions(atob(encoded));
};

export const encodeDeductions = (deductions: PointDeduction[]): string => {
  return btoa(JSON.stringify(deductions));
};

export const decodeDeductions = (encoded: string): PointDeduction[] => {
  if (!encoded) return [];
  return JSON.parse(atob(encoded)) as PointDeduction[];
};
