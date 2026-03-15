/**
 * Lightweight check script that queries football-data.org to detect new match
 * results since the last check. Used by the scheduled GitHub Actions workflow
 * to trigger redeployment only when fixture data has actually changed.
 *
 * Requires: FOOTBALL_DATA_API_KEY environment variable
 */

import * as fs from 'node:fs';
import { API_KEY, COMPETITIONS, fetchFromApi } from './common';
import ENABLED_COMPETITION_SLUGS from '../src/data/enabled-competitions.json';

const STATE_FILE = '.match-state.json';

if (!API_KEY) {
  console.error('Error: FOOTBALL_DATA_API_KEY not found in environment');
  console.error('Please create a .env file with your API key (see .env.example)');
  process.exit(1);
}

interface ApiMatchesResponse {
  matches: { status: string }[];
}

const fetchFinishedCount = async (competitionCode: string): Promise<number> => {
  const { matches } = await fetchFromApi<ApiMatchesResponse>(
    `/v4/competitions/${competitionCode}/matches`,
  );
  return matches.filter((m) => m.status === 'FINISHED').length;
};

const main = async (): Promise<void> => {
  const current: Record<string, number> = {};

  const enabledCompetitions = ENABLED_COMPETITION_SLUGS.map((slug) => COMPETITIONS[slug]);

  for (const comp of enabledCompetitions) {
    current[comp.footballDataCode] = await fetchFinishedCount(comp.footballDataCode);
    console.log(`${comp.name}: ${current[comp.footballDataCode]} finished matches`);
  }

  let previous: Record<string, number> = {};
  try {
    previous = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
  } catch {
    console.log('No previous state found (first run)');
  }

  const changed = JSON.stringify(current) !== JSON.stringify(previous);
  console.log(changed ? '→ Changes detected' : '→ No changes');

  if (changed) {
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
