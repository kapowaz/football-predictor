import * as fs from 'node:fs';
import * as path from 'node:path';
import { config } from 'dotenv';
import { COMPETITION_CODE, API_KEY, fetchFromApi } from './common';

config();

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

const fetchMatches = async (): Promise<void> => {
  console.log('Fetching matches...');
  const data = await fetchFromApi<ApiMatchesResponse>(
    `/v4/competitions/${COMPETITION_CODE}/matches`,
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

  const outputPath = path.join(import.meta.dirname, '../src/data/matches.json');
  fs.writeFileSync(outputPath, JSON.stringify(matchesData, null, 2));
  console.log(`✓ Wrote ${matchesData.matches.length} matches to src/data/matches.json`);
};

const fetchStandings = async (): Promise<void> => {
  console.log('Fetching standings...');
  const data = await fetchFromApi<ApiStandingsResponse>(
    `/v4/competitions/${COMPETITION_CODE}/standings`,
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

  const outputPath = path.join(import.meta.dirname, '../src/data/standings.json');
  fs.writeFileSync(outputPath, JSON.stringify(standingsData, null, 2));
  console.log(`✓ Wrote ${standingsData.standings.length} standings to src/data/standings.json`);
};

const main = async (): Promise<void> => {
  console.log('Fetching data from football-data.org...\n');

  try {
    await fetchMatches();
    await fetchStandings();
    console.log('\n✓ Data fetch complete!');
  } catch (error) {
    console.error('Error fetching data:', error);
    process.exit(1);
  }
};

main();
