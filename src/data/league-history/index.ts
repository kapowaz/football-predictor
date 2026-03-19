export * from './types';

import type { HistoricalSeason } from './types';

const seasonModules = import.meta.glob<HistoricalSeason[]>('./seasons/*.json', {
  eager: true,
  import: 'default',
});

export const allSeasons: HistoricalSeason[] = Object.values(seasonModules)
  .flat()
  .sort((a, b) => a.year - b.year);

const seasonsByYear = new Map<number, HistoricalSeason>();
for (const season of allSeasons) {
  seasonsByYear.set(season.year, season);
}

/** Look up a single season by its end year (e.g. 1889 for the 1888-89 season). */
export const getSeason = (year: number): HistoricalSeason | undefined =>
  seasonsByYear.get(year);
