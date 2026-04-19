import type {
  TeamsData,
  MatchesData,
  PointDeduction,
  ApiStandingsData,
  ModelPredictionsData,
} from '../types';
import ENABLED_COMPETITION_SLUGS from './enabled-competitions.json';

export interface CompetitionData {
  teamsData: TeamsData;
  matchesData: MatchesData;
  overridesData: { lastUpdated: string; matches: MatchesData['matches'] };
  deductionsData: PointDeduction[];
  standingsData: ApiStandingsData;
  modelPredictionsData: ModelPredictionsData;
}

const loaders: Record<string, () => Promise<CompetitionData>> = {
  'premier-league': () =>
    import('./premier-league').then((m) => m as unknown as CompetitionData),
  'efl-championship': () =>
    import('./efl-championship').then((m) => m as unknown as CompetitionData),
  'efl-league-one': () =>
    import('./efl-league-one').then((m) => m as unknown as CompetitionData),
  'efl-league-two': () =>
    import('./efl-league-two').then((m) => m as unknown as CompetitionData),
};

const cache = new Map<string, Promise<CompetitionData>>();

/** Dynamically load competition data. Returns a cached promise for repeated calls. */
export const loadCompetitionData = (slug: string): Promise<CompetitionData> => {
  let promise = cache.get(slug);
  if (!promise) {
    const loader = loaders[slug];
    if (!loader) {
      return Promise.reject(
        new Error(`No data loader for competition: ${slug}`),
      );
    }
    promise = loader();
    cache.set(slug, promise);
  }
  return promise;
};

/** Synchronous check for whether a competition has loadable data. */
export const hasCompetitionData = (slug: string): boolean => {
  return ENABLED_COMPETITION_SLUGS.includes(slug) && slug in loaders;
};
