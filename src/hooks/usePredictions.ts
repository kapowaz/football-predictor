import { useState, useCallback, useEffect } from 'react';
import type { PredictionsStore } from '../types';
import { loadPredictions, savePredictions, clearPredictions } from '../utils/storage';

export function usePredictions() {
  const [predictions, setPredictions] = useState<PredictionsStore>(() => loadPredictions());

  useEffect(() => {
    savePredictions(predictions);
  }, [predictions]);

  const setPrediction = useCallback((matchId: number, homeGoals: number, awayGoals: number) => {
    setPredictions((prev) => ({
      ...prev,
      predictions: {
        ...prev.predictions,
        [String(matchId)]: { homeGoals, awayGoals },
      },
    }));
  }, []);

  const removePrediction = useCallback((matchId: number) => {
    setPredictions((prev) => {
      const updated = { ...prev.predictions };
      delete updated[String(matchId)];
      return {
        ...prev,
        predictions: updated,
      };
    });
  }, []);

  const resetAllPredictions = useCallback(() => {
    clearPredictions();
    setPredictions({
      predictions: {},
      lastModified: new Date().toISOString(),
    });
  }, []);

  const getPrediction = useCallback(
    (matchId: number) => {
      return predictions.predictions[String(matchId)] ?? null;
    },
    [predictions],
  );

  return {
    predictions,
    setPrediction,
    removePrediction,
    resetAllPredictions,
    getPrediction,
  };
}
