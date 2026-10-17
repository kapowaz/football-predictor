import { describe, it, expect } from 'vitest';

import type { Match, PointDeduction, Team } from '../types';
import { calculateStandings } from '../utils/standings';
import { COMPETITIONS } from './competitions';
import {
  applyGenuineToConfig,
  applyGenuineToData,
  isGenuineCompetition,
} from './genuine';
import { matchesData, teamsData } from './premier-league';

const MAN_CITY = 65;

const teams = teamsData.teams as Team[];
const matches = matchesData.matches as Match[];
const deductions: PointDeduction[] = [{ teamId: MAN_CITY, amount: 10 }];

describe('genuine', () => {
  it('only applies to the Premier League', () => {
    expect(isGenuineCompetition('premier-league')).toBe(true);
    expect(isGenuineCompetition('efl-championship')).toBe(false);
  });

  it('removes Man City, their matches and their deductions', () => {
    const result = applyGenuineToData('premier-league', {
      teams,
      matches,
      deductions,
    });

    expect(result.teams.some((t) => t.id === MAN_CITY)).toBe(false);
    expect(
      result.matches.some(
        (m) => m.homeTeamId === MAN_CITY || m.awayTeamId === MAN_CITY,
      ),
    ).toBe(false);
    expect(result.deductions).toEqual([]);
  });

  it('leaves other competitions unchanged', () => {
    const data = { teams, matches, deductions };
    expect(applyGenuineToData('efl-championship', data)).toBe(data);
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

  // Skipped automatically when the season data is a stub.
  it.skipIf(teams.length === 0)(
    'tabulates 19 teams without results against Man City',
    () => {
      const result = applyGenuineToData('premier-league', {
        teams,
        matches,
        deductions: [],
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
