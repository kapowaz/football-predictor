import * as fs from 'node:fs';
import * as path from 'node:path';

import { API_KEY, fetchFromApi, parseCompetitionArg } from './common';
import type { ScriptCompetition } from './common';

if (!API_KEY) {
  console.error('Error: FOOTBALL_DATA_API_KEY not found in environment');
  console.error('Please create a .env file with your API key (see .env.example)');
  process.exit(1);
}

interface ApiMatch {
  id: number;
  status: string;
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
}

interface ApiMatchesResponse {
  matches: ApiMatch[];
}

export interface LiveScoreEntry {
  homeGoals: number;
  awayGoals: number;
  status: string;
}

export interface LiveScoresFile {
  lastUpdated: string;
  scores: Record<string, LiveScoreEntry>;
}

const LIVE_STATUSES = new Set([
  'IN_PLAY',
  'PAUSED',
  'HALFTIME',
  'EXTRA_TIME',
  'PENALTY_SHOOTOUT',
  'FINISHED',
]);

const outputDir = path.join(import.meta.dirname, '../public/live-scores');

export const generateForCompetition = async (
  comp: ScriptCompetition,
): Promise<{ inPlayCount: number; totalScored: number }> => {
  const data = await fetchFromApi<ApiMatchesResponse>(
    `/v4/competitions/${comp.footballDataCode}/matches`,
  );

  const scores: Record<string, LiveScoreEntry> = {};
  let inPlayCount = 0;

  for (const match of data.matches) {
    if (!LIVE_STATUSES.has(match.status)) continue;
    if (match.score.fullTime.home == null || match.score.fullTime.away == null) continue;

    scores[String(match.id)] = {
      homeGoals: match.score.fullTime.home,
      awayGoals: match.score.fullTime.away,
      status: match.status,
    };

    if (match.status !== 'FINISHED') {
      inPlayCount++;
    }
  }

  const liveScoresData: LiveScoresFile = {
    lastUpdated: new Date().toISOString(),
    scores,
  };

  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${comp.slug}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(liveScoresData, null, 2));

  return { inPlayCount, totalScored: Object.keys(scores).length };
};

const main = async (): Promise<void> => {
  const competitions = parseCompetitionArg();
  console.log('Generating live scores from football-data.org...\n');

  try {
    for (const comp of competitions) {
      const { inPlayCount, totalScored } = await generateForCompetition(comp);
      console.log(
        `✓ ${comp.name}: ${totalScored} scored matches (${inPlayCount} in-play) → public/live-scores/${comp.slug}.json`,
      );
    }
    console.log('\n✓ Live scores generation complete!');
  } catch (error) {
    console.error('Error generating live scores:', error);
    process.exit(1);
  }
};

main();
