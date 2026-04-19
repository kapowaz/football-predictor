import { describe, it, expect } from 'vitest';

import type {
  AllTimeClubData,
  ScoringWeights,
} from '../data/all-time-rank/types';
import { calculateAllTimeScores, DEFAULT_WEIGHTS } from './allTimeRank';

const emptyTieredHonours = { tier1: [], tier2: [], tier3: [], tier4: [] };
const emptyEuropean = {
  championsLeagueWinners: [],
  championsLeagueRunnersUp: [],
  europaLeagueWinners: [],
  europaLeagueRunnersUp: [],
  conferenceLeagueWinners: [],
  conferenceLeagueRunnersUp: [],
};

const makeClub = (
  overrides: Partial<AllTimeClubData> = {},
): AllTimeClubData => ({
  name: 'Test Club',
  shortName: 'Test',
  badge: 'test',
  founded: 1900,
  currentTier: 1,
  leagueRecord: { tier1: {}, tier2: {}, tier3: {}, tier4: {} },
  honours: {
    leagueTitles: { ...emptyTieredHonours },
    leagueRunnersUp: { ...emptyTieredHonours },
    playoffWinners: { ...emptyTieredHonours },
    faCupWinners: [],
    faCupRunnersUp: [],
    leagueCupWinners: [],
    leagueCupRunnersUp: [],
  },
  europeanHonours: { ...emptyEuropean },
  averageAttendance: 10000,
  ...overrides,
});

const noDecayWeights: ScoringWeights = {
  league: 1.0,
  domestic: 1.0,
  european: 1.0,
  attendance: 0,
  decayFloor: 1.0,
};

describe('calculateAllTimeScores', () => {
  it('returns clubs sorted by total score descending', () => {
    const clubA = makeClub({
      name: 'Strong Club',
      leagueRecord: {
        tier1: {
          2025: { won: 30, drawn: 5, lost: 3, goalsFor: 90, goalsAgainst: 30 },
        },
        tier2: {},
        tier3: {},
        tier4: {},
      },
    });
    const clubB = makeClub({
      name: 'Weak Club',
      leagueRecord: {
        tier1: {},
        tier2: {},
        tier3: {},
        tier4: {
          2025: { won: 10, drawn: 5, lost: 23, goalsFor: 40, goalsAgainst: 70 },
        },
      },
    });

    const results = calculateAllTimeScores([clubB, clubA], noDecayWeights);

    expect(results[0].club.name).toBe('Strong Club');
    expect(results[1].club.name).toBe('Weak Club');
    expect(results[0].rank).toBe(1);
    expect(results[1].rank).toBe(2);
  });

  it('applies tier weights correctly — tier 1 scores higher than tier 4', () => {
    const seasonRecord = {
      won: 20,
      drawn: 10,
      lost: 10,
      goalsFor: 60,
      goalsAgainst: 40,
    };

    const clubTier1 = makeClub({
      name: 'Tier 1 Club',
      leagueRecord: {
        tier1: { 2025: seasonRecord },
        tier2: {},
        tier3: {},
        tier4: {},
      },
    });
    const clubTier4 = makeClub({
      name: 'Tier 4 Club',
      leagueRecord: {
        tier1: {},
        tier2: {},
        tier3: {},
        tier4: { 2025: seasonRecord },
      },
    });

    const results = calculateAllTimeScores(
      [clubTier4, clubTier1],
      noDecayWeights,
    );

    expect(results[0].club.name).toBe('Tier 1 Club');
    expect(results[0].leagueScore).toBe(results[1].leagueScore * 4);
  });

  it('scores league performance as (3W + D) * tier_weight', () => {
    const club = makeClub({
      leagueRecord: {
        tier1: {
          2025: { won: 10, drawn: 5, lost: 5, goalsFor: 40, goalsAgainst: 25 },
        },
        tier2: {},
        tier3: {},
        tier4: {},
      },
    });

    const results = calculateAllTimeScores([club], noDecayWeights);

    // (3*10 + 5) * 4 = 35 * 4 = 140
    expect(results[0].leagueScore).toBe(140);
  });

  it('scores domestic honours with tier weighting', () => {
    const club = makeClub({
      honours: {
        leagueTitles: { tier1: [2025], tier2: [], tier3: [], tier4: [] },
        leagueRunnersUp: { ...emptyTieredHonours },
        playoffWinners: { ...emptyTieredHonours },
        faCupWinners: [],
        faCupRunnersUp: [],
        leagueCupWinners: [],
        leagueCupRunnersUp: [],
      },
    });

    const results = calculateAllTimeScores([club], noDecayWeights);

    // Champions base 25 * tier1 weight 4 = 100
    expect(results[0].domesticScore).toBe(100);
  });

  it('scores FA Cup wins at 80 points each', () => {
    const club = makeClub({
      honours: {
        leagueTitles: { ...emptyTieredHonours },
        leagueRunnersUp: { ...emptyTieredHonours },
        playoffWinners: { ...emptyTieredHonours },
        faCupWinners: [2020, 2025],
        faCupRunnersUp: [],
        leagueCupWinners: [],
        leagueCupRunnersUp: [],
      },
    });

    const results = calculateAllTimeScores([club], noDecayWeights);

    expect(results[0].domesticScore).toBe(160);
  });

  it('scores European honours correctly', () => {
    const club = makeClub({
      europeanHonours: {
        championsLeagueWinners: [2005],
        championsLeagueRunnersUp: [],
        europaLeagueWinners: [],
        europaLeagueRunnersUp: [],
        conferenceLeagueWinners: [],
        conferenceLeagueRunnersUp: [],
      },
    });

    const results = calculateAllTimeScores([club], noDecayWeights);

    expect(results[0].europeanScore).toBe(200);
  });

  it('applies attendance weight correctly', () => {
    const club = makeClub({ averageAttendance: 50000 });
    const weights: ScoringWeights = { ...noDecayWeights, attendance: 0.01 };

    const results = calculateAllTimeScores([club], weights);

    expect(results[0].attendanceScore).toBe(500);
  });

  it('reduces scores for older seasons when decay is enabled', () => {
    const season = {
      won: 20,
      drawn: 10,
      lost: 10,
      goalsFor: 60,
      goalsAgainst: 40,
    };

    const recentClub = makeClub({
      name: 'Recent',
      leagueRecord: {
        tier1: { 2025: season },
        tier2: {},
        tier3: {},
        tier4: {},
      },
    });
    const oldClub = makeClub({
      name: 'Old',
      leagueRecord: {
        tier1: { 1920: season },
        tier2: {},
        tier3: {},
        tier4: {},
      },
    });

    const decayWeights: ScoringWeights = {
      ...noDecayWeights,
      decayFloor: 0.15,
    };
    const results = calculateAllTimeScores([recentClub, oldClub], decayWeights);

    expect(results[0].club.name).toBe('Recent');
    expect(results[0].leagueScore).toBeGreaterThan(results[1].leagueScore);
  });

  it('produces equal scores with decayFloor 1.0 (no decay)', () => {
    const season = {
      won: 20,
      drawn: 10,
      lost: 10,
      goalsFor: 60,
      goalsAgainst: 40,
    };

    const clubA = makeClub({
      name: 'Club A',
      leagueRecord: {
        tier1: { 2025: season },
        tier2: {},
        tier3: {},
        tier4: {},
      },
    });
    const clubB = makeClub({
      name: 'Club B',
      leagueRecord: {
        tier1: { 1920: season },
        tier2: {},
        tier3: {},
        tier4: {},
      },
    });

    const results = calculateAllTimeScores([clubA, clubB], noDecayWeights);

    expect(results[0].leagueScore).toBe(results[1].leagueScore);
  });

  it('handles empty clubs gracefully', () => {
    const club = makeClub();
    const results = calculateAllTimeScores([club], DEFAULT_WEIGHTS);

    expect(results).toHaveLength(1);
    expect(results[0].rank).toBe(1);
    expect(results[0].leagueScore).toBe(0);
    expect(results[0].domesticScore).toBe(0);
    expect(results[0].europeanScore).toBe(0);
  });
});
