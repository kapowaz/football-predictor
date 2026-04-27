import seasonJson from './season.json';

const overrideFromEnv =
  typeof import.meta.env !== 'undefined' &&
  typeof import.meta.env.VITE_SEASON === 'string' &&
  import.meta.env.VITE_SEASON.length > 0
    ? import.meta.env.VITE_SEASON
    : undefined;

/**
 * Season identifier in dashed form (e.g. "2025-26"). Used for filesystem
 * paths and stable identifiers.
 *
 * Sourced from `src/data/season.json` by default; overridable at build time
 * with `VITE_SEASON=2024-25 pnpm build` for archive deployments.
 */
export const seasonId: string = overrideFromEnv ?? seasonJson.current;

/** Human-readable display form of the season (e.g. "2025/26"). */
export const seasonDisplay: string = seasonId.replace('-', '/');
