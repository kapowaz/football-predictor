import { useState, useMemo } from 'react';
import type { Match, PredictionsStore } from '../types';

interface SeasonSummaryState {
  isSummaryOpen: boolean;
  dismissSummary: () => void;
}

export const useSeasonSummary = (
  matches: Match[],
  predictions: PredictionsStore,
): SeasonSummaryState => {
  const allFixturesResolved = useMemo(() => {
    return matches.every(
      (m) => m.status === 'FINISHED' || String(m.id) in predictions.predictions,
    );
  }, [predictions, matches]);

  const [summaryDismissed, setSummaryDismissed] = useState(false);
  const [prevAllResolved, setPrevAllResolved] = useState(allFixturesResolved);

  if (prevAllResolved !== allFixturesResolved) {
    setPrevAllResolved(allFixturesResolved);
    if (prevAllResolved && !allFixturesResolved) {
      setSummaryDismissed(false);
    }
  }

  return {
    isSummaryOpen: allFixturesResolved && !summaryDismissed,
    dismissSummary: () => setSummaryDismissed(true),
  };
};
