export * from './types';

import type { AllTimeClubData } from './types';
import clubsData from './clubs.json';

export const allTimeClubs: AllTimeClubData[] = clubsData as unknown as AllTimeClubData[];
