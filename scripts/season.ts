import * as fs from 'node:fs';
import * as path from 'node:path';

interface SeasonConfig {
  current: string;
}

const SEASON_JSON_PATH = path.join(
  import.meta.dirname,
  '../src/data/season.json',
);

/**
 * Resolve the season identifier (e.g. "2025-26") for Node-side scripts.
 *
 * Resolution order: `VITE_SEASON` env var → `SEASON` env var → the `current`
 * field in `src/data/season.json`. The `VITE_SEASON` alias is recognised so
 * the same env var can drive both `pnpm build` and the fetch scripts.
 */
export const getSeasonId = (): string => {
  const fromEnv = process.env.VITE_SEASON ?? process.env.SEASON;
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  const json = JSON.parse(
    fs.readFileSync(SEASON_JSON_PATH, 'utf-8'),
  ) as SeasonConfig;
  return json.current;
};
