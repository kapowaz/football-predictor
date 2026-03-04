import * as fs from 'node:fs';
import * as path from 'node:path';
import { API_KEY, fetchFromApi, parseCompetitionArg } from './common';
import type { ScriptCompetition } from './common';

if (!API_KEY) {
  console.error('Error: FOOTBALL_DATA_API_KEY not found in environment');
  console.error('Please create a .env file with your API key (see .env.example)');
  process.exit(1);
}

interface ApiTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

interface ApiTeamsResponse {
  competition: {
    name: string;
  };
  season: {
    startDate: string;
    endDate: string;
  };
  teams: ApiTeam[];
}

const formatSeason = (startDate: string, endDate: string): string => {
  const startYear = new Date(startDate).getFullYear();
  const endYear = new Date(endDate).getFullYear();
  return `${startYear}-${String(endYear).slice(2)}`;
};

const teamNameToCrestKey = (name: string): string => {
  return name
    .replace(/\s*(FC|AFC)\s*$/i, '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-');
};

const fetchTeams = async (comp: ScriptCompetition): Promise<void> => {
  console.log(`Fetching teams for ${comp.name}...`);
  const data = await fetchFromApi<ApiTeamsResponse>(
    `/v4/competitions/${comp.footballDataCode}/teams`,
  );

  const dir = path.join(import.meta.dirname, '../src/data', comp.slug);
  fs.mkdirSync(dir, { recursive: true });
  const outputPath = path.join(dir, 'teams.json');

  const existingFotmobIds = new Map<number, number>();
  try {
    const existing = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    for (const team of existing.teams) {
      if (team.fotmobId) existingFotmobIds.set(team.id, team.fotmobId);
    }
  } catch {
    // File doesn't exist yet on first run
  }

  const teamsData = {
    competition: data.competition.name,
    season: formatSeason(data.season.startDate, data.season.endDate),
    teams: data.teams.map((team) => ({
      id: team.id,
      ...(existingFotmobIds.has(team.id) && { fotmobId: existingFotmobIds.get(team.id) }),
      name: team.name,
      shortName: team.shortName,
      tla: team.tla,
      crest: teamNameToCrestKey(team.name),
    })),
  };

  fs.writeFileSync(outputPath, JSON.stringify(teamsData, null, 2));
  console.log(`✓ Wrote ${teamsData.teams.length} teams to src/data/${comp.slug}/teams.json`);
  if (existingFotmobIds.size > 0) {
    console.log(`  (preserved ${existingFotmobIds.size} fotmobId mappings)`);
  }
};

const main = async (): Promise<void> => {
  const competitions = parseCompetitionArg();
  console.log('Fetching teams data from football-data.org...\n');

  try {
    for (const comp of competitions) {
      await fetchTeams(comp);
      console.log();
    }
    console.log('✓ Teams data fetch complete!');
  } catch (error) {
    console.error('Error fetching data:', error);
    process.exit(1);
  }
};

main();
