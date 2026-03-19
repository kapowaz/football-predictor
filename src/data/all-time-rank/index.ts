export * from './types';

import type { AllTimeClubData } from './types';

let cached: AllTimeClubData[] | null = null;
let pending: Promise<AllTimeClubData[]> | null = null;

/**
 * Lazily load all club data. The data is fetched once and cached for
 * subsequent calls.  Returns a promise that resolves to the full array
 * of club records.
 */
export const loadAllTimeClubs = (): Promise<AllTimeClubData[]> => {
  if (cached) return Promise.resolve(cached);
  if (!pending) {
    pending = import('./all-clubs').then(({ allTimeClubs }) => {
      cached = allTimeClubs;
      return allTimeClubs;
    });
  }
  return pending;
};
