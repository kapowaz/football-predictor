import { useState, useCallback, useEffect, useRef } from 'react';
import type { Match, PredictionsStore } from '../types';
import { loadPredictions, savePredictions, clearPredictions } from '../utils/storage';
import { encodePredictions, decodePredictions } from '../utils/serialization';

const buildUrl = (params: URLSearchParams): string => {
  const search = params.toString();
  return window.location.pathname + (search ? `?${search}` : '');
};

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
  const [predictions, setPredictions] = useState<PredictionsStore>(() =>
    loadInitialPredictions(slug, matches),
  );
  const isInitialRender = useRef(true);

  useEffect(() => {
    savePredictions(slug, predictions);

    const params = new URLSearchParams(window.location.search);
    const entries = Object.keys(predictions.predictions);

    if (entries.length > 0) {
      const encoded = encodePredictions(predictions.predictions, matches);
      params.set('predictions', encoded);
    } else {
      params.delete('predictions');
    }

    const url = buildUrl(params);
    if (isInitialRender.current) {
      window.history.replaceState(null, '', url);
      isInitialRender.current = false;
    } else {
      window.history.pushState(null, '', url);
    }
  }, [predictions, matches, slug]);

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
