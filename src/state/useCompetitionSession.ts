import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Match, PointDeduction, PredictionsStore } from '../types';
import { clearDeductions, loadDeductions, loadPredictions, saveDeductions, savePredictions } from '../utils/storage';
import {
  decodeDeductions,
  decodePredictions,
  encodeDeductions,
  encodePredictions,
} from '../utils/serialization';
import {
  createDefaultSession,
  type CompetitionTabId,
  type PersistenceMode,
  useCompetitionSessionStore,
} from './competitionSessionStore';
import { selectAllFixturesResolved, selectIsSummaryOpen, selectSessionForSlug } from './selectors';

interface UseCompetitionSessionOptions {
  slug: string;
  matches: Match[];
  defaultDeductions: PointDeduction[];
  persistenceMode?: PersistenceMode;
}

interface UseCompetitionSessionResult {
  predictions: PredictionsStore;
  deductions: PointDeduction[];
  deductionsCustomised: boolean;
  activeTab: CompetitionTabId;
  navigateToMatchId: number | null;
  deductionsModalOpen: boolean;
  isSummaryOpen: boolean;
  setPrediction: (matchId: number, homeGoals: number, awayGoals: number) => void;
  removePrediction: (matchId: number) => void;
  resetAllPredictions: () => void;
  fillFromModel: (modelPredictions: Record<string, { homeGoals: number; awayGoals: number }>) => void;
  getPrediction: (matchId: number) => { homeGoals: number; awayGoals: number } | null;
  updateDeduction: (teamId: number, amount: number) => void;
  addDeduction: (teamId: number, amount: number) => void;
  removeDeduction: (teamId: number) => void;
  resetDeductions: () => void;
  setActiveTab: (tabId: CompetitionTabId) => void;
  setNavigateToMatchId: (matchId: number | null) => void;
  setDeductionsModalOpen: (isOpen: boolean) => void;
  dismissSummary: () => void;
}

const resolveInitialPredictions = (
  slug: string,
  matches: Match[],
  persistenceMode: PersistenceMode,
  searchParams: URLSearchParams,
): PredictionsStore => {
  if (persistenceMode === 'full') {
    const encodedPredictions = searchParams.get('predictions');
    if (encodedPredictions) {
      try {
        return {
          predictions: decodePredictions(encodedPredictions, matches),
          lastModified: new Date().toISOString(),
        };
      } catch (error) {
        console.error('Failed to decode predictions from URL:', error);
      }
    }
  }

  return loadPredictions(slug);
};

const resolveInitialDeductions = (
  slug: string,
  defaultDeductions: PointDeduction[],
  persistenceMode: PersistenceMode,
  searchParams: URLSearchParams,
): { deductions: PointDeduction[]; deductionsCustomised: boolean } => {
  if (persistenceMode === 'full') {
    const encodedDeductions = searchParams.get('deductions');
    if (encodedDeductions !== null) {
      try {
        return {
          deductions: decodeDeductions(encodedDeductions, defaultDeductions),
          deductionsCustomised: true,
        };
      } catch (error) {
        console.error('Failed to decode deductions from URL:', error);
      }
    }
  }

  const storedDeductions = loadDeductions(slug);
  if (storedDeductions !== null) {
    return { deductions: storedDeductions, deductionsCustomised: true };
  }

  return { deductions: defaultDeductions, deductionsCustomised: false };
};

export const useCompetitionSession = ({
  slug,
  matches,
  defaultDeductions,
  persistenceMode = 'full',
}: UseCompetitionSessionOptions): UseCompetitionSessionResult => {
  const [searchParams, setSearchParams] = useSearchParams();
  const session = useCompetitionSessionStore((state) => selectSessionForSlug(state.sessions, slug));
  const initialSessionRef = useRef<{ slug: string; session: ReturnType<typeof createDefaultSession> } | null>(null);

  if (!initialSessionRef.current || initialSessionRef.current.slug !== slug) {
    const predictions = resolveInitialPredictions(slug, matches, persistenceMode, searchParams);
    const deductionsState = resolveInitialDeductions(
      slug,
      defaultDeductions,
      persistenceMode,
      searchParams,
    );
    initialSessionRef.current = {
      slug,
      session: {
        ...createDefaultSession(defaultDeductions),
        predictions,
        deductions: deductionsState.deductions,
        deductionsCustomised: deductionsState.deductionsCustomised,
      },
    };
  }

  if (!session) {
    useCompetitionSessionStore.getState().initializeSession(slug, {
      predictions: initialSessionRef.current.session.predictions,
      deductions: initialSessionRef.current.session.deductions,
      deductionsCustomised: initialSessionRef.current.session.deductionsCustomised,
      defaultDeductions,
    });
  }

  const activeSession = session ?? initialSessionRef.current.session;
  const setPrediction = useCompetitionSessionStore((state) => state.setPrediction);
  const removePrediction = useCompetitionSessionStore((state) => state.removePrediction);
  const resetAllPredictions = useCompetitionSessionStore((state) => state.resetAllPredictions);
  const fillFromModel = useCompetitionSessionStore((state) => state.fillFromModel);
  const updateDeduction = useCompetitionSessionStore((state) => state.updateDeduction);
  const addDeduction = useCompetitionSessionStore((state) => state.addDeduction);
  const removeDeduction = useCompetitionSessionStore((state) => state.removeDeduction);
  const resetDeductions = useCompetitionSessionStore((state) => state.resetDeductions);
  const setActiveTab = useCompetitionSessionStore((state) => state.setActiveTab);
  const setNavigateToMatchId = useCompetitionSessionStore((state) => state.setNavigateToMatchId);
  const setDeductionsModalOpen = useCompetitionSessionStore((state) => state.setDeductionsModalOpen);
  const dismissSummary = useCompetitionSessionStore((state) => state.dismissSummary);
  const resetSummaryDismissed = useCompetitionSessionStore((state) => state.resetSummaryDismissed);

  useEffect(() => {
    savePredictions(slug, activeSession.predictions);
  }, [activeSession.predictions, slug]);

  useEffect(() => {
    if (activeSession.deductionsCustomised) {
      saveDeductions(slug, activeSession.deductions);
    } else {
      clearDeductions(slug);
    }
  }, [activeSession.deductions, activeSession.deductionsCustomised, slug]);

  const isInitialUrlSync = useRef(true);
  useEffect(() => {
    if (persistenceMode !== 'full') {
      return;
    }

    const encodedPredictions =
      Object.keys(activeSession.predictions.predictions).length > 0
        ? encodePredictions(activeSession.predictions.predictions, matches)
        : null;
    const encodedDeductions = activeSession.deductionsCustomised
      ? encodeDeductions(activeSession.deductions)
      : null;
    const currentEncodedPredictions = searchParams.get('predictions');
    const currentEncodedDeductions = searchParams.get('deductions');

    const shouldUpdatePredictions = currentEncodedPredictions !== encodedPredictions;
    const shouldUpdateDeductions = currentEncodedDeductions !== encodedDeductions;

    if (shouldUpdatePredictions || shouldUpdateDeductions) {
      const shouldReplace = isInitialUrlSync.current;
      setSearchParams(
        (previous) => {
          const params = new URLSearchParams(previous);

          if (encodedPredictions) {
            params.set('predictions', encodedPredictions);
          } else {
            params.delete('predictions');
          }

          if (encodedDeductions) {
            params.set('deductions', encodedDeductions);
          } else {
            params.delete('deductions');
          }

          return params;
        },
        { replace: shouldReplace },
      );
    }

    if (isInitialUrlSync.current) {
      isInitialUrlSync.current = false;
    }
  }, [
    activeSession.deductions,
    activeSession.deductionsCustomised,
    activeSession.predictions,
    matches,
    persistenceMode,
    searchParams,
    setSearchParams,
  ]);

  const allFixturesResolved = useMemo(
    () => selectAllFixturesResolved(matches, activeSession.predictions),
    [activeSession.predictions, matches],
  );
  const previousAllResolved = useRef(allFixturesResolved);
  useEffect(() => {
    if (previousAllResolved.current && !allFixturesResolved) {
      resetSummaryDismissed(slug);
    }
    previousAllResolved.current = allFixturesResolved;
  }, [allFixturesResolved, resetSummaryDismissed, slug]);

  const isSummaryOpen = useMemo(
    () => selectIsSummaryOpen(allFixturesResolved, activeSession.summaryDismissed),
    [activeSession.summaryDismissed, allFixturesResolved],
  );

  return {
    predictions: activeSession.predictions,
    deductions: activeSession.deductions,
    deductionsCustomised: activeSession.deductionsCustomised,
    activeTab: activeSession.activeTab,
    navigateToMatchId: activeSession.navigateToMatchId,
    deductionsModalOpen: activeSession.deductionsModalOpen,
    isSummaryOpen,
    setPrediction: (matchId, homeGoals, awayGoals) => setPrediction(slug, matchId, homeGoals, awayGoals),
    removePrediction: (matchId) => removePrediction(slug, matchId),
    resetAllPredictions: () => resetAllPredictions(slug),
    fillFromModel: (modelPredictions) => fillFromModel(slug, modelPredictions),
    getPrediction: (matchId) => activeSession.predictions.predictions[String(matchId)] ?? null,
    updateDeduction: (teamId, amount) => updateDeduction(slug, teamId, amount),
    addDeduction: (teamId, amount) => addDeduction(slug, teamId, amount),
    removeDeduction: (teamId) => removeDeduction(slug, teamId),
    resetDeductions: () => resetDeductions(slug),
    setActiveTab: (tabId) => setActiveTab(slug, tabId),
    setNavigateToMatchId: (matchId) => setNavigateToMatchId(slug, matchId),
    setDeductionsModalOpen: (isOpen) => setDeductionsModalOpen(slug, isOpen),
    dismissSummary: () => dismissSummary(slug),
  };
};
