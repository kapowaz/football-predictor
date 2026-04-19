import type { LiveScore, PredictionsStore } from '../types';

/**
 * Merges user predictions with live scores, with user predictions taking
 * priority. Returns a new PredictionsStore that can be used anywhere
 * predictions are consumed (standings calculation, fixture display, etc.).
 */
export const getEffectivePredictions = (
  userPredictions: PredictionsStore,
  liveScores: Record<string, LiveScore> | null,
): PredictionsStore => {
  if (!liveScores) return userPredictions;

  const merged = { ...userPredictions.predictions };
  for (const [matchId, score] of Object.entries(liveScores)) {
    if (!(matchId in merged)) {
      merged[matchId] = {
        homeGoals: score.homeGoals,
        awayGoals: score.awayGoals,
      };
    }
  }
  return { predictions: merged, lastModified: userPredictions.lastModified };
};

/**
 * Returns the set of match IDs that are populated from live scores
 * (i.e. not overridden by a user prediction).
 */
export const getLiveScoreMatchIds = (
  userPredictions: PredictionsStore,
  liveScores: Record<string, LiveScore> | null,
): ReadonlySet<string> => {
  if (!liveScores) return new Set();

  const ids = new Set<string>();
  for (const matchId of Object.keys(liveScores)) {
    if (!(matchId in userPredictions.predictions)) {
      ids.add(matchId);
    }
  }
  return ids;
};
