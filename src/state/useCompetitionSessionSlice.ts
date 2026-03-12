import { useMemo } from 'react';
import type { CompetitionSessionState } from './competitionSessionStore';
import { useCompetitionSessionStore } from './competitionSessionStore';
import { selectSessionForSlug } from './selectors';

interface CompetitionSessionSlice {
  session: CompetitionSessionState | null;
  setPrediction: (matchId: number, homeGoals: number, awayGoals: number) => void;
  removePrediction: (matchId: number) => void;
  resetAllPredictions: () => void;
  fillFromModel: (modelPredictions: Record<string, { homeGoals: number; awayGoals: number }>) => void;
  updateDeduction: (teamId: number, amount: number) => void;
  addDeduction: (teamId: number, amount: number) => void;
  removeDeduction: (teamId: number) => void;
  resetDeductions: () => void;
  setActiveTab: (tabId: 'standings' | 'fixtures') => void;
  setNavigateToMatchId: (matchId: number | null) => void;
  setDeductionsModalOpen: (isOpen: boolean) => void;
  dismissSummary: () => void;
}

export const useCompetitionSessionSlice = (slug: string): CompetitionSessionSlice => {
  const session = useCompetitionSessionStore((state) => selectSessionForSlug(state.sessions, slug));
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

  return useMemo(
    () => ({
      session,
      setPrediction: (matchId, homeGoals, awayGoals) =>
        setPrediction(slug, matchId, homeGoals, awayGoals),
      removePrediction: (matchId) => removePrediction(slug, matchId),
      resetAllPredictions: () => resetAllPredictions(slug),
      fillFromModel: (modelPredictions) => fillFromModel(slug, modelPredictions),
      updateDeduction: (teamId, amount) => updateDeduction(slug, teamId, amount),
      addDeduction: (teamId, amount) => addDeduction(slug, teamId, amount),
      removeDeduction: (teamId) => removeDeduction(slug, teamId),
      resetDeductions: () => resetDeductions(slug),
      setActiveTab: (tabId) => setActiveTab(slug, tabId),
      setNavigateToMatchId: (matchId) => setNavigateToMatchId(slug, matchId),
      setDeductionsModalOpen: (isOpen) => setDeductionsModalOpen(slug, isOpen),
      dismissSummary: () => dismissSummary(slug),
    }),
    [
      addDeduction,
      dismissSummary,
      fillFromModel,
      removeDeduction,
      removePrediction,
      resetAllPredictions,
      resetDeductions,
      session,
      setActiveTab,
      setDeductionsModalOpen,
      setNavigateToMatchId,
      setPrediction,
      slug,
      updateDeduction,
    ],
  );
};
