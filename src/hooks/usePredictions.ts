import { useCompetitionSession } from '../state/useCompetitionSession';
import type { Match } from '../types';
import { useCompetitionData } from './useCompetitionData';

export const usePredictions = (slug: string, matches: Match[]) => {
  const { defaultDeductions } = useCompetitionData(slug);
  const {
    predictions,
    setPrediction,
    removePrediction,
    resetAllPredictions,
    fillFromModel,
    getPrediction,
  } = useCompetitionSession({
    slug,
    matches,
    defaultDeductions,
    persistenceMode: 'full',
  });

  return {
    predictions,
    setPrediction,
    removePrediction,
    resetAllPredictions,
    fillFromModel,
    getPrediction,
  };
};
