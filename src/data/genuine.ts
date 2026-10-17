import type { Match, PointDeduction, Team } from '../types';
import type { CompetitionConfig } from './competitions';

/**
 * Teams (football-data.org IDs) that do not take part in a competition while
 * "genuine" mode is on, keyed by competition slug.
 */
const GENUINE_EXCLUDED_TEAM_IDS: Record<string, readonly number[]> = {
  'premier-league': [
    65, // Manchester City
  ],
};

/** Whether "genuine" mode changes anything for this competition. */
export const isGenuineCompetition = (slug: string): boolean =>
  slug in GENUINE_EXCLUDED_TEAM_IDS;

const excludedIdsFor = (slug: string): ReadonlySet<number> =>
  new Set(GENUINE_EXCLUDED_TEAM_IDS[slug] ?? []);

/** Removes every match (result or fixture) involving an excluded team. */
export const excludeGenuineMatches = <
  T extends Pick<Match, 'homeTeamId' | 'awayTeamId'>,
>(
  slug: string,
  matches: T[],
): T[] => {
  const excluded = excludedIdsFor(slug);
  if (excluded.size === 0) return matches;
  return matches.filter(
    (m) => !excluded.has(m.homeTeamId) && !excluded.has(m.awayTeamId),
  );
};

/** Removes deductions against excluded teams. */
export const excludeGenuineDeductions = (
  slug: string,
  deductions: PointDeduction[],
): PointDeduction[] => {
  const excluded = excludedIdsFor(slug);
  if (excluded.size === 0) return deductions;
  return deductions.filter((d) => !excluded.has(d.teamId));
};

/** Removes excluded teams and every match they play in. */
export const applyGenuineToData = <
  T extends { teams: Team[]; matches: Match[] },
>(
  slug: string,
  data: T,
): T => {
  const excluded = excludedIdsFor(slug);
  if (excluded.size === 0) return data;
  return {
    ...data,
    teams: data.teams.filter((t) => !excluded.has(t.id)),
    matches: excludeGenuineMatches(slug, data.matches),
  };
};

/**
 * Shrinks the team count and the relegation zone by the number of excluded
 * teams, so the bottom zone still ends at last place (e.g. 18th–19th in a
 * 19-team Premier League). All other zones are unchanged.
 */
export const applyGenuineToConfig = (
  config: CompetitionConfig,
): CompetitionConfig => {
  const removed = excludedIdsFor(config.slug).size;
  if (removed === 0) return config;
  return {
    ...config,
    teamCount: config.teamCount - removed,
    zones: config.zones.map((zone) =>
      zone.type === 'relegation'
        ? { ...zone, endPosition: zone.endPosition - removed }
        : zone,
    ),
  };
};
