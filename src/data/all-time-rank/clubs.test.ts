import { describe, it, expect } from 'vitest';
import type { AllTimeClubData } from './types';
import clubsData from './clubs.json';

const clubs = clubsData as unknown as AllTimeClubData[];

const WAR_YEARS = new Set([
  1916, 1917, 1918, 1919, // WWI: 1915/16 – 1918/19 seasons not played
  1940, 1941, 1942, 1943, 1944, 1945, 1946, // WWII: 1939/40 – 1945/46 seasons not played
]);

type TierKey = 'tier1' | 'tier2' | 'tier3' | 'tier4';
const TIERS: TierKey[] = ['tier1', 'tier2', 'tier3', 'tier4'];

/**
 * Collect every recorded season for a club, returning a Map of year → tier.
 */
const collectSeasons = (club: AllTimeClubData): Map<number, TierKey> => {
  const seasons = new Map<number, TierKey>();
  for (const tier of TIERS) {
    for (const yearStr of Object.keys(club.leagueRecord[tier])) {
      seasons.set(Number(yearStr), tier);
    }
  }
  return seasons;
};

describe('all-time rank club data – season continuity', () => {
  it.each(clubs.map((c) => [c.name, c]))(
    '%s has a season entry for every year from first to last (excluding war years and below-tier-4 gaps)',
    (_name, club) => {
      const seasons = collectSeasons(club as AllTimeClubData);
      if (seasons.size === 0) return;

      const years = [...seasons.keys()].sort((a, b) => a - b);
      const firstYear = years[0];
      const lastYear = years[years.length - 1];

      const missingYears: number[] = [];

      for (let year = firstYear; year <= lastYear; year++) {
        if (WAR_YEARS.has(year)) continue;
        if (seasons.has(year)) continue;

        // Find the closest recorded season before this gap
        const previousYears = years.filter((y) => y < year);
        const previousYear = previousYears.length
          ? previousYears[previousYears.length - 1]
          : undefined;
        const previousTier = previousYear !== undefined ? seasons.get(previousYear) : undefined;

        // A gap is acceptable only if the team was last seen in tier 4
        // (meaning they dropped out of the football league)
        if (previousTier === 'tier4') continue;

        missingYears.push(year);
      }

      expect(
        missingYears,
        `${(club as AllTimeClubData).name} is missing season entries for: ${missingYears.join(', ')}`,
      ).toEqual([]);
    },
  );
});
