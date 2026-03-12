import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Match, PredictionsStore } from '../types';
import { loadPredictions, savePredictions, clearPredictions } from '../utils/storage';
import { encodePredictions, decodePredictions } from '../utils/serialization';

const loadInitialPredictions = (slug: string, matches: Match[]): PredictionsStore => {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('predictions');

  if (encoded) {
    try {
      const decoded = decodePredictions(encoded, matches);

      return {
        predictions: decoded,
        lastModified: new Date().toISOString(),
      };
    } catch (e) {
      console.error('Failed to decode predictions from URL:', e);
    }
  }

  return loadPredictions(slug);
};

export const usePredictions = (slug: string, matches: Match[]) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [predictions, setPredictions] = useState<PredictionsStore>(() =>
    loadInitialPredictions(slug, matches),
  );
  const isInitialRender = useRef(true);

  useEffect(() => {
    savePredictions(slug, predictions);

    const entries = Object.keys(predictions.predictions);
    const encodedPredictions =
      entries.length > 0 ? encodePredictions(predictions.predictions, matches) : null;
    const currentEncodedPredictions = searchParams.get('predictions');
    const shouldUpdateUrl = currentEncodedPredictions !== encodedPredictions;

    if (shouldUpdateUrl) {
      const shouldReplace = isInitialRender.current;
      setSearchParams(
        (previous) => {
          const params = new URLSearchParams(previous);
          if (encodedPredictions) {
            params.set('predictions', encodedPredictions);
          } else {
            params.delete('predictions');
          }
          return params;
        },
        { replace: shouldReplace },
      );
    }

    if (isInitialRender.current) {
      isInitialRender.current = false;
    }
  }, [predictions, matches, searchParams, setSearchParams, slug]);

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
    clearPredictions(slug);
    setPredictions({
      predictions: {},
      lastModified: new Date().toISOString(),
    });
  }, [slug]);

  const fillFromModel = useCallback(
    (modelPredictions: Record<string, { homeGoals: number; awayGoals: number }>) => {
      setPredictions({
        predictions: { ...modelPredictions },
        lastModified: new Date().toISOString(),
      });
    },
    [],
  );

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
    fillFromModel,
    getPrediction,
  };
};
