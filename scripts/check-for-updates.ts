/**
 * Lightweight check script that queries football-data.org to detect new match
 * results or in-play matches since the last check. Used by the scheduled
 * GitHub Actions workflow to trigger redeployment only when fixture data has
 * actually changed or live matches are underway.
 *
 * Requires: FOOTBALL_DATA_API_KEY environment variable
 */

import * as fs from 'node:fs';
import { API_KEY, COMPETITIONS, fetchFromApi } from './common';
import ENABLED_COMPETITION_SLUGS from '../src/data/enabled-competitions.json';

const STATE_FILE = '.match-state.json';

const IN_PLAY_STATUSES = new Set([
  'IN_PLAY',
  'PAUSED',
  'HALFTIME',
  'EXTRA_TIME',
  'PENALTY_SHOOTOUT',
]);

if (!API_KEY) {
  console.error('Error: FOOTBALL_DATA_API_KEY not found in environment');
  console.error('Please create a .env file with your API key (see .env.example)');
  process.exit(1);
}

interface ApiMatchesResponse {
  matches: { status: string }[];
}

interface MatchCounts {
  finished: number;
  inPlay: number;
}

const fetchMatchCounts = async (competitionCode: string): Promise<MatchCounts> => {
  const { matches } = await fetchFromApi<ApiMatchesResponse>(
    `/v4/competitions/${competitionCode}/matches`,
  );
  return {
    finished: matches.filter((m) => m.status === 'FINISHED').length,
    inPlay: matches.filter((m) => IN_PLAY_STATUSES.has(m.status)).length,
  };
};

const main = async (): Promise<void> => {
  const current: Record<string, number> = {};
  let hasInPlayMatches = false;

  const enabledCompetitions = ENABLED_COMPETITION_SLUGS.map((slug) => COMPETITIONS[slug]);

  for (const comp of enabledCompetitions) {
    const counts = await fetchMatchCounts(comp.footballDataCode);
    current[comp.footballDataCode] = counts.finished;

    const parts = [`${counts.finished} finished`];
    if (counts.inPlay > 0) {
      parts.push(`${counts.inPlay} in-play`);
      hasInPlayMatches = true;
    }
    console.log(`${comp.name}: ${parts.join(', ')}`);
  }

  let previous: Record<string, number> = {};
  try {
    previous = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
  } catch {
    console.log('No previous state found (first run)');
  }

  const finishedChanged = JSON.stringify(current) !== JSON.stringify(previous);
  const changed = finishedChanged || hasInPlayMatches;

  if (finishedChanged) {
    console.log('→ Finished match count changed');
  }
  if (hasInPlayMatches) {
    console.log('→ In-play matches detected');
  }
  if (!changed) {
    console.log('→ No changes');
  }

  if (finishedChanged) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(current, null, 2));
  }

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
  }
};

main().catch((err) => {
  console.error('Check failed:', err);
  process.exit(1);
});
