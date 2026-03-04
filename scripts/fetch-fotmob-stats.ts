import * as fs from 'node:fs';
import * as path from 'node:path';
import { parseCompetitionArg } from './common';
import type { ScriptCompetition } from './common';

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

interface FotMobStatEntry {
  ParticipantName: string;
  TeamId: number;
  StatValue: number;
  SubStatValue: number | null;
  MinutesPlayed?: number;
  MatchesPlayed?: number;
  Rank: number;
}

interface FotMobStatResponse {
  TopLists: {
    StatName: string;
    Title: string;
    StatList: FotMobStatEntry[];
  }[];
  LeagueName: string;
}

interface FotMobLeagueStatsTeamEntry {
  header: string;
  fetchAllUrl: string;
}

interface FotMobLeagueResponse {
  stats: {
    teams: FotMobLeagueStatsTeamEntry[];
  };
}

interface TeamJson {
  id: number;
  fotmobId?: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

interface TeamsJson {
  competition: string;
  season: string;
  teams: TeamJson[];
}

const normalizeName = (name: string): string =>
  name
    .replace(/\s*(FC|AFC)\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const fotmobFetch = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
    },
  });

  if (!response.ok) {
    throw new Error(`FotMob request failed: ${response.status} ${response.statusText} for ${url}`);
  }

  return response.json() as Promise<T>;
};

const fetchStatsForCompetition = async (comp: ScriptCompetition): Promise<void> => {
  const leagueStatsUrl = `https://www.fotmob.com/api/leagues?id=${comp.fotmobLeagueId}&tab=stats&type=league`;
  console.log(`Fetching FotMob stats for ${comp.name}...\n`);

  const dataDir = path.join(import.meta.dirname, '../src/data', comp.slug);
  const teamsPath = path.join(dataDir, 'teams.json');
  const teamsData: TeamsJson = JSON.parse(fs.readFileSync(teamsPath, 'utf-8'));

  console.log('Discovering available stats from FotMob league endpoint...');
  const leagueData = await fotmobFetch<FotMobLeagueResponse>(leagueStatsUrl);

  const statEntries = leagueData.stats.teams;
  if (!statEntries || statEntries.length === 0) {
    throw new Error('No team stats found in FotMob league response');
  }

  console.log(`Found ${statEntries.length} team stat categories`);

  const statResults = await Promise.all(
    statEntries.map(async (entry) => {
      const url = entry.fetchAllUrl.startsWith('http')
        ? entry.fetchAllUrl
        : `https://data.fotmob.com${entry.fetchAllUrl}`;
      try {
        const data = await fotmobFetch<FotMobStatResponse>(url);
        return data;
      } catch (err) {
        console.warn(`  Warning: failed to fetch stat from ${url}: ${err}`);
        return null;
      }
    }),
  );

  const fotmobIdByTeamId = new Map<number, number>();
  const teamIdByFotmobId = new Map<number, number>();

  for (const team of teamsData.teams) {
    if (team.fotmobId) {
      fotmobIdByTeamId.set(team.id, team.fotmobId);
      teamIdByFotmobId.set(team.fotmobId, team.id);
    }
  }

  const allFotmobTeams = new Map<number, string>();
  for (const result of statResults) {
    if (!result) continue;
    for (const topList of result.TopLists) {
      for (const entry of topList.StatList) {
        if (!allFotmobTeams.has(entry.TeamId)) {
          allFotmobTeams.set(entry.TeamId, entry.ParticipantName);
        }
      }
    }
  }

  let newMappings = 0;
  for (const [fotmobId, fotmobName] of allFotmobTeams) {
    if (teamIdByFotmobId.has(fotmobId)) continue;

    const normalizedFotmob = normalizeName(fotmobName);
    const matched = teamsData.teams.find(
      (t) => !fotmobIdByTeamId.has(t.id) && normalizeName(t.name) === normalizedFotmob,
    );

    if (matched) {
      fotmobIdByTeamId.set(matched.id, fotmobId);
      teamIdByFotmobId.set(fotmobId, matched.id);
      newMappings++;
    } else {
      console.warn(`  Warning: no match for FotMob team "${fotmobName}" (ID ${fotmobId})`);
    }
  }

  if (newMappings > 0) {
    for (const team of teamsData.teams) {
      const fotmobId = fotmobIdByTeamId.get(team.id);
      if (fotmobId && !team.fotmobId) {
        team.fotmobId = fotmobId;
      }
    }
    fs.writeFileSync(teamsPath, JSON.stringify(teamsData, null, 2) + '\n');
    console.log(`✓ Wrote ${newMappings} new fotmobId mappings to teams.json`);
  }

  const stats: Record<
    string,
    {
      teamName: string;
      fotmobId: number;
      matchesPlayed: number;
      [statName: string]: string | number | { value: number; subValue: number | null };
    }
  > = {};

  for (const result of statResults) {
    if (!result) continue;
    for (const topList of result.TopLists) {
      const statName = topList.StatName;
      for (const entry of topList.StatList) {
        const teamId = teamIdByFotmobId.get(entry.TeamId);
        if (!teamId) continue;

        if (!stats[String(teamId)]) {
          stats[String(teamId)] = {
            teamName: entry.ParticipantName,
            fotmobId: entry.TeamId,
            matchesPlayed: entry.MatchesPlayed ?? 0,
          };
        }

        if (
          entry.MatchesPlayed &&
          entry.MatchesPlayed > (stats[String(teamId)].matchesPlayed as number)
        ) {
          stats[String(teamId)].matchesPlayed = entry.MatchesPlayed;
        }

        stats[String(teamId)][statName] = {
          value: entry.StatValue,
          subValue: entry.SubStatValue,
        };
      }
    }
  }

  const season = teamsData.season;
  const outputData = {
    lastUpdated: new Date().toISOString(),
    season,
    stats,
  };

  const outputPath = path.join(dataDir, 'fotmob-stats.json');
  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

  const teamCount = Object.keys(stats).length;
  const statCount = statResults
    .filter(Boolean)
    .reduce((acc, r) => acc + (r?.TopLists.length ?? 0), 0);
  console.log(
    `\n✓ Wrote stats for ${teamCount} teams (${statCount} stat categories) to src/data/${comp.slug}/fotmob-stats.json`,
  );

  const unmatchedTeams = teamsData.teams.filter((t) => !fotmobIdByTeamId.has(t.id));
  if (unmatchedTeams.length > 0) {
    console.warn(`\nWarning: ${unmatchedTeams.length} teams have no FotMob mapping:`);
    for (const t of unmatchedTeams) {
      console.warn(`  - ${t.name} (ID ${t.id})`);
    }
  }
};

const main = async (): Promise<void> => {
  const competitions = parseCompetitionArg();

  try {
    for (const comp of competitions) {
      await fetchStatsForCompetition(comp);
      console.log();
    }
  } catch (error) {
    console.error('Error fetching FotMob stats:', error);
    process.exit(1);
  }
};

main();
