import type { PointDeduction } from '../types';
import { useCompetitionData } from './useCompetitionData';
import { useCompetitionSession } from '../state/useCompetitionSession';

export const useDeductions = (slug: string, defaults: PointDeduction[]) => {
  const { matches } = useCompetitionData(slug);
  const {
    deductions,
    deductionsCustomised,
    updateDeduction,
    addDeduction,
    removeDeduction,
    resetDeductions,
  } = useCompetitionSession({
    slug,
    matches,
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
