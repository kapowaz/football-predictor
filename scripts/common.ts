import { config } from 'dotenv';

config();

export const API_BASE = 'https://api.football-data.org/v4';
export const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

export interface ScriptCompetition {
  slug: string;
  footballDataCode: string;
  fotmobLeagueId: number;
  name: string;
}

/**
 * Slugs of competitions that have API data available.
 * Scripts using --all will only process these competitions.
 */
import ENABLED_COMPETITION_SLUGS from '../src/data/enabled-competitions.json';

export const COMPETITIONS: Record<string, ScriptCompetition> = {
  'efl-championship': {
    slug: 'efl-championship',
    footballDataCode: 'ELC',
    fotmobLeagueId: 48,
    name: 'EFL Championship',
  },
  'efl-league-one': {
    slug: 'efl-league-one',
    footballDataCode: 'EL1',
    fotmobLeagueId: 108,
    name: 'EFL League One',
  },
  'efl-league-two': {
    slug: 'efl-league-two',
    footballDataCode: 'EL2',
    fotmobLeagueId: 109,
    name: 'EFL League Two',
  },
  'premier-league': {
    slug: 'premier-league',
    footballDataCode: 'PL',
    fotmobLeagueId: 47,
    name: 'Premier League',
  },
};

export const fetchFromApi = async <T>(endpoint: string): Promise<T> => {
  const url = new URL(endpoint, API_BASE);
  const response = await fetch(url.toString(), {
    headers: {
      'X-Auth-Token': API_KEY!,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

export const parseCompetitionArg = (): ScriptCompetition[] => {
  const args = process.argv.slice(2);
  const allIdx = args.indexOf('--all');
  const compIdx = args.indexOf('--competition');

  if (allIdx !== -1) {
    return ENABLED_COMPETITION_SLUGS.map((slug) => COMPETITIONS[slug]);
  }

  if (compIdx !== -1 && args[compIdx + 1]) {
    const slug = args[compIdx + 1];
    const comp = COMPETITIONS[slug];
    if (!comp) {
      console.error(`Unknown competition: ${slug}`);
      console.error(`Available: ${Object.keys(COMPETITIONS).join(', ')}`);
      process.exit(1);
    }
    return [comp];
  }

  return ENABLED_COMPETITION_SLUGS.map((slug) => COMPETITIONS[slug]);
};
