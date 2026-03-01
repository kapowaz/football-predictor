import type { PredictionsStore } from '../types';

type PredictionsPayload = PredictionsStore['predictions'];

function serializePredictions(predictions: PredictionsPayload): string {
  return Object.entries(predictions)
    .map(([matchId, { homeGoals, awayGoals }]) => `${matchId}:${homeGoals}:${awayGoals}`)
    .join(';');
}

function deserializePredictions(serialized: string): PredictionsPayload {
  if (!serialized) return {};

  return Object.fromEntries(
    serialized.split(';').map((entry) => {
      const [matchId, home, away] = entry.split(':');
      return [matchId, { homeGoals: Number(home), awayGoals: Number(away) }];
    }),
  );
}

export function encodePredictions(predictions: PredictionsPayload): string {
  return btoa(serializePredictions(predictions));
}

export function decodePredictions(encoded: string): PredictionsPayload {
  return deserializePredictions(atob(encoded));
}
