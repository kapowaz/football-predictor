export * from './types';

import type { AllTimeClubData } from './types';

const clubModules = import.meta.glob<AllTimeClubData>('./clubs/*.json', {
  eager: true,
  import: 'default',
});

export const allTimeClubs: AllTimeClubData[] = Object.values(clubModules);
