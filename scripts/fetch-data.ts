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
  utcDate: string;
  status: string;
  homeTeam: { id: number };
  awayTeam: { id: number };
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

interface ApiStandingEntry {
  position: number;
  team: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
  };
  playedGames: number;
  form: string;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

interface ApiStandingsGroup {
  stage: string;
  type: string;
  group: string | null;
  table: ApiStandingEntry[];
}

interface ApiStandingsResponse {
  standings: ApiStandingsGroup[];
}

const dataDir = (comp: ScriptCompetition) =>
  path.join(import.meta.dirname, '../src/data', comp.slug);

const fetchMatches = async (comp: ScriptCompetition): Promise<void> => {
  console.log(`Fetching matches for ${comp.name}...`);
  const data = await fetchFromApi<ApiMatchesResponse>(
    `/v4/competitions/${comp.footballDataCode}/matches`,
  );

  const matchesData = {
    lastUpdated: new Date().toISOString(),
    matches: data.matches.map((match) => ({
      id: match.id,
      homeTeamId: match.homeTeam.id,
      awayTeamId: match.awayTeam.id,
      utcDate: match.utcDate,
      status: match.status === 'FINISHED' ? 'FINISHED' : 'SCHEDULED',
      homeGoals: match.score.fullTime.home,
      awayGoals: match.score.fullTime.away,
    })),
  };

  const dir = dataDir(comp);
  fs.mkdirSync(dir, { recursive: true });
  const outputPath = path.join(dir, 'matches.json');
  fs.writeFileSync(outputPath, JSON.stringify(matchesData, null, 2));
  console.log(`✓ Wrote ${matchesData.matches.length} matches to src/data/${comp.slug}/matches.json`);
};

const fetchStandings = async (comp: ScriptCompetition): Promise<void> => {
  console.log(`Fetching standings for ${comp.name}...`);
  const data = await fetchFromApi<ApiStandingsResponse>(
    `/v4/competitions/${comp.footballDataCode}/standings`,
  );

  const totalStandings = data.standings.find((s) => s.type === 'TOTAL');
  if (!totalStandings) {
    throw new Error('No TOTAL standings found in API response');
  }

  const standingsData = {
    lastUpdated: new Date().toISOString(),
    standings: totalStandings.table.map((entry) => ({
      position: entry.position,
      teamId: entry.team.id,
      teamName: entry.team.name,
      playedGames: entry.playedGames,
      won: entry.won,
      drawn: entry.draw,
      lost: entry.lost,
      points: entry.points,
      goalsFor: entry.goalsFor,
      goalsAgainst: entry.goalsAgainst,
      goalDifference: entry.goalDifference,
    })),
  };

  const dir = dataDir(comp);
  fs.mkdirSync(dir, { recursive: true });
  const outputPath = path.join(dir, 'standings.json');
  fs.writeFileSync(outputPath, JSON.stringify(standingsData, null, 2));
  console.log(
    `✓ Wrote ${standingsData.standings.length} standings to src/data/${comp.slug}/standings.json`,
  );
};

const main = async (): Promise<void> => {
  const competitions = parseCompetitionArg();
  console.log('Fetching data from football-data.org...\n');

  try {
    for (const comp of competitions) {
      await fetchMatches(comp);
      await fetchStandings(comp);
      console.log();
    }
    console.log('✓ Data fetch complete!');
  } catch (error) {
    console.error('Error fetching data:', error);
    process.exit(1);
  }
};

main();
