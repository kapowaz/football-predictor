import * as fs from 'node:fs';
import * as path from 'node:path';

import { API_KEY, fetchFromApi, parseCompetitionArg } from './common';
import type { ScriptCompetition } from './common';
import { getSeasonId } from './season';

const seasonId = getSeasonId();

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

/**
 * Custom TLA overrides for teams whose football-data.org TLA clashes
 * with another team across the four enabled competitions.
 * Keyed by football-data.org team ID.
 */
const TLA_OVERRIDES: Record<number, string> = {
  336: 'BPL',   // Blackpool       (API: BLA, clashes with Blackburn Rovers)
  376: 'NTH',   // Northampton Town (API: NOR, clashes with Norwich City)
  1072: 'BTA',  // Burton Albion   (API: BUR, clashes with Burnley)
  363: 'CFD',   // Chesterfield    (API: CHE, clashes with Chelsea)
  411: 'CHT',   // Cheltenham Town (API: CHE, clashes with Chelsea)
  400: 'BRV',   // Bristol Rovers  (API: BRI, clashes with Bristol City)
  1110: 'BAW',  // Barrow          (API: BAR, clashes with Barnet)
  1134: 'BNT',  // Barnet          (API: BAR, clashes with Barrow)
  1142: 'NPT',  // Newport County  (API: NEW, clashes with Newcastle United)
};

const stripNameSuffix = (name: string): string =>
  name.replace(/\s+(FC|AFC)$/i, '').trim();

const teamNameToBadgeKey = (name: string): string => {
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

  const dir = path.join(
    import.meta.dirname,
    '../src/data',
    comp.slug,
    seasonId,
  );
  fs.mkdirSync(dir, { recursive: true });
  const outputPath = path.join(dir, 'teams.json');

  interface ExistingTeam { fotmobId?: number; shortName: string; tla: string }
  const existingTeams = new Map<number, ExistingTeam>();
  try {
    const existing = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    for (const team of existing.teams) {
      existingTeams.set(team.id, {
        ...(team.fotmobId && { fotmobId: team.fotmobId }),
        shortName: team.shortName,
        tla: team.tla,
      });
    }
  } catch {
    // File doesn't exist yet on first run
  }

  const teamsData = {
    competition: data.competition.name,
    season: formatSeason(data.season.startDate, data.season.endDate),
    teams: data.teams.map((team) => {
      const existing = existingTeams.get(team.id);
      return {
        id: team.id,
        ...(existing?.fotmobId && { fotmobId: existing.fotmobId }),
        name: stripNameSuffix(team.name),
        shortName: existing?.shortName ?? team.shortName,
        tla: TLA_OVERRIDES[team.id] ?? existing?.tla ?? team.tla,
        badge: teamNameToBadgeKey(team.name),
      };
    }),
  };

  const tlaOverrideCount = teamsData.teams.filter((t) => t.id in TLA_OVERRIDES).length;

  fs.writeFileSync(outputPath, JSON.stringify(teamsData, null, 2));
  console.log(
    `✓ Wrote ${teamsData.teams.length} teams to src/data/${comp.slug}/${seasonId}/teams.json`,
  );
  if (existingTeams.size > 0) {
    console.log(`  (preserved local overrides from ${existingTeams.size} existing teams)`);
  }
  if (tlaOverrideCount > 0) {
    console.log(`  (applied ${tlaOverrideCount} TLA overrides)`);
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
