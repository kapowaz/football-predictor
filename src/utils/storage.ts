import type { PointDeduction, PredictionsStore } from '../types';

const LEGACY_PREDICTIONS_KEY = 'football-predictor-predictions';
const LEGACY_DEDUCTIONS_KEY = 'football-predictor-deductions';

const predictionsKey = (slug: string) => `football-predictor-predictions-${slug}`;
const deductionsKey = (slug: string) => `football-predictor-deductions-${slug}`;

let migrationDone = false;

export const migrateStorage = (): void => {
  if (migrationDone) return;
  migrationDone = true;

  try {
    const legacyPredictions = localStorage.getItem(LEGACY_PREDICTIONS_KEY);
    if (legacyPredictions !== null) {
      const targetKey = predictionsKey('efl-championship');
      if (localStorage.getItem(targetKey) === null) {
        localStorage.setItem(targetKey, legacyPredictions);
      }
      localStorage.removeItem(LEGACY_PREDICTIONS_KEY);
    }

    const legacyDeductions = localStorage.getItem(LEGACY_DEDUCTIONS_KEY);
    if (legacyDeductions !== null) {
      const targetKey = deductionsKey('efl-championship');
      if (localStorage.getItem(targetKey) === null) {
        localStorage.setItem(targetKey, legacyDeductions);
      }
      localStorage.removeItem(LEGACY_DEDUCTIONS_KEY);
    }
  } catch (error) {
    console.error('Failed to migrate localStorage:', error);
  }
};

export const loadPredictions = (slug: string): PredictionsStore => {
  try {
    const stored = localStorage.getItem(predictionsKey(slug));
    if (stored) {
      return JSON.parse(stored) as PredictionsStore;
    }
  } catch (error) {
    console.error('Failed to load predictions from localStorage:', error);
  }
  return {
    predictions: {},
    lastModified: new Date().toISOString(),
  };
};

export const savePredictions = (slug: string, store: PredictionsStore): void => {
  try {
    const updated: PredictionsStore = {
      ...store,
      lastModified: new Date().toISOString(),
    };
    localStorage.setItem(predictionsKey(slug), JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save predictions to localStorage:', error);
  }
};

export const clearPredictions = (slug: string): void => {
  try {
    localStorage.removeItem(predictionsKey(slug));
  } catch (error) {
    console.error('Failed to clear predictions from localStorage:', error);
  }
};

const isValidDeduction = (d: unknown): d is PointDeduction =>
  typeof d === 'object' &&
  d !== null &&
  'teamId' in d &&
  'amount' in d &&
  typeof (d as PointDeduction).teamId === 'number' &&
  typeof (d as PointDeduction).amount === 'number' &&
  Number.isFinite((d as PointDeduction).teamId) &&
  Number.isFinite((d as PointDeduction).amount);

export const loadDeductions = (slug: string): PointDeduction[] | null => {
  try {
    const stored = localStorage.getItem(deductionsKey(slug));
    if (stored !== null) {
      const parsed = JSON.parse(stored) as unknown[];
      if (!Array.isArray(parsed) || !parsed.every(isValidDeduction)) {
        console.error('Corrupted deductions in localStorage, discarding');
        localStorage.removeItem(deductionsKey(slug));
        return null;
      }
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load deductions from localStorage:', error);
  }
  return null;
};

export const saveDeductions = (slug: string, deductions: PointDeduction[]): void => {
  try {
    localStorage.setItem(deductionsKey(slug), JSON.stringify(deductions));
  } catch (error) {
    console.error('Failed to save deductions to localStorage:', error);
  }
};

export const clearDeductions = (slug: string): void => {
  try {
    localStorage.removeItem(deductionsKey(slug));
  } catch (error) {
    console.error('Failed to clear deductions from localStorage:', error);
  }
};
