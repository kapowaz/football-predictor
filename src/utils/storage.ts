import type { PointDeduction, PredictionsStore } from '../types';

const STORAGE_KEY = 'football-predictor-predictions';
const DEDUCTIONS_STORAGE_KEY = 'football-predictor-deductions';

export function loadPredictions(): PredictionsStore {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
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
}

export function savePredictions(store: PredictionsStore): void {
  try {
    const updated: PredictionsStore = {
      ...store,
      lastModified: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save predictions to localStorage:', error);
  }
}

export function clearPredictions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear predictions from localStorage:', error);
  }
}

export function loadDeductions(): PointDeduction[] | null {
  try {
    const stored = localStorage.getItem(DEDUCTIONS_STORAGE_KEY);
    if (stored !== null) {
      return JSON.parse(stored) as PointDeduction[];
    }
  } catch (error) {
    console.error('Failed to load deductions from localStorage:', error);
  }
  return null;
}

export function saveDeductions(deductions: PointDeduction[]): void {
  try {
    localStorage.setItem(DEDUCTIONS_STORAGE_KEY, JSON.stringify(deductions));
  } catch (error) {
    console.error('Failed to save deductions to localStorage:', error);
  }
}

export function clearDeductions(): void {
  try {
    localStorage.removeItem(DEDUCTIONS_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear deductions from localStorage:', error);
  }
}
