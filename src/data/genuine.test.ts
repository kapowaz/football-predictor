import { describe, it, expect } from 'vitest';

import type { Match, PointDeduction, Team } from '../types';
import { calculateStandings } from '../utils/standings';
import { COMPETITIONS } from './competitions';
import {
  applyGenuineToConfig,
  applyGenuineToData,
  excludeGenuineDeductions,
  excludeGenuineMatches,
  isGenuineCompetition,
} from './genuine';
import { matchesData, teamsData } from './premier-league';

const MAN_CITY = 65;
const ARSENAL = 57;
const CHELSEA = 61;

const team = (id: number, name: string): Team => ({
  id,
  fotmobId: id,
  name,
  shortName: name,
  tla: name.slice(0, 3).toUpperCase(),
  badge: name.toLowerCase(),
});

const match = (
  id: number,
  homeTeamId: number,
  awayTeamId: number,
  score?: [number, number],
): Match => {
  const base = { id, homeTeamId, awayTeamId, utcDate: '2026-09-01T15:00:00Z' };
  return score
    ? { ...base, status: 'FINISHED', homeGoals: score[0], awayGoals: score[1] }
    : { ...base, status: 'SCHEDULED', homeGoals: null, awayGoals: null };
};

const teams = [
  team(ARSENAL, 'Arsenal'),
  team(CHELSEA, 'Chelsea'),
  team(MAN_CITY, 'City'),
];
const matches = [
  match(1, ARSENAL, CHELSEA, [1, 0]),
  match(2, MAN_CITY, ARSENAL, [3, 0]),
  match(3, CHELSEA, MAN_CITY),
];
const deductions: PointDeduction[] = [
  { teamId: MAN_CITY, amount: 10 },
  { teamId: CHELSEA, amount: 2 },
];

describe('genuine', () => {
  it('only applies to the Premier League', () => {
    expect(isGenuineCompetition('premier-league')).toBe(true);
    expect(isGenuineCompetition('efl-championship')).toBe(false);
  });

  it('removes Man City and every match they play in', () => {
    const result = applyGenuineToData('premier-league', { teams, matches });

    expect(result.teams.map((t) => t.id)).toEqual([ARSENAL, CHELSEA]);
    expect(result.matches.map((m) => m.id)).toEqual([1]);
  });

  it('removes only deductions against Man City', () => {
    expect(excludeGenuineDeductions('premier-league', deductions)).toEqual([
      { teamId: CHELSEA, amount: 2 },
    ]);
  });

  it('leaves other competitions unchanged', () => {
    const data = { teams, matches };
    expect(applyGenuineToData('efl-championship', data)).toBe(data);
    expect(excludeGenuineMatches('efl-championship', matches)).toBe(matches);
    expect(excludeGenuineDeductions('efl-championship', deductions)).toBe(
      deductions,
    );
  });

  it('leaves results against Man City out of the tabulation', () => {
    const result = applyGenuineToData('premier-league', { teams, matches });
    const standings = calculateStandings(
      result.teams,
      result.matches,
      { predictions: {}, lastModified: '' },
      [],
    );

    expect(standings).toHaveLength(2);
    const arsenal = standings.find((s) => s.team.id === ARSENAL);
    expect(arsenal).toMatchObject({ played: 1, points: 3 });
  });

  it('shrinks the relegation zone to 18th–19th and leaves other zones alone', () => {
    const config = COMPETITIONS['premier-league'];
    const result = applyGenuineToConfig(config);

    expect(result.teamCount).toBe(19);
    expect(result.zones.find((z) => z.type === 'relegation')).toMatchObject({
      startPosition: 18,
      endPosition: 19,
    });
    expect(result.zones.filter((z) => z.type !== 'relegation')).toEqual(
      config.zones.filter((z) => z.type !== 'relegation'),
    );
  });

  it('includes Man City in the current Premier League teams', () => {
    // Guards the hard-coded team ID against a football-data.org ID change.
    const seasonTeams = teamsData.teams as Team[];
    expect(seasonTeams.some((t) => t.id === MAN_CITY)).toBe(true);
  });

  // Skipped when the season's matches are a stub (e.g. in CI).
  it.skipIf((matchesData.matches as Match[]).length === 0)(
    'tabulates 19 teams from the real season data',
    () => {
      const result = applyGenuineToData('premier-league', {
        teams: teamsData.teams as Team[],
        matches: matchesData.matches as Match[],
      });
      const standings = calculateStandings(
        result.teams,
        result.matches,
        { predictions: {}, lastModified: '' },
        [],
      );

      expect(standings).toHaveLength(19);
      const totalPlayed = standings.reduce((n, s) => n + s.played, 0);
      const finished = result.matches.filter(
        (m) => m.status === 'FINISHED',
      ).length;
      expect(totalPlayed).toBe(finished * 2);
    },
  );
});
