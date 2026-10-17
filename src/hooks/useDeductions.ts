import { useCompetitionSession } from '../state/useCompetitionSession';
import type { PointDeduction } from '../types';
import { useCompetitionData } from './useCompetitionData';

export const useDeductions = (slug: string, defaults: PointDeduction[]) => {
  const { allMatches } = useCompetitionData(slug);
  const {
    deductions,
    deductionsCustomised,
    updateDeduction,
    addDeduction,
    removeDeduction,
    resetDeductions,
  } = useCompetitionSession({
    slug,
    matches: allMatches,
    defaultDeductions: defaults,
    persistenceMode: 'full',
  });

  return {
    deductions,
    isCustomised: deductionsCustomised,
    updateDeduction,
    addDeduction,
    removeDeduction,
    resetDeductions,
  };
};
