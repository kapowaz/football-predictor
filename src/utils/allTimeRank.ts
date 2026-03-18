import type {
  AllTimeClubData,
  RankedClub,
  ScoringWeights,
  SeasonRecords,
  TieredHonourYears,
} from '../data/all-time-rank/types';

const TIER_WEIGHTS: Record<string, number> = {
  tier1: 4,
  tier2: 3,
  tier3: 2,
  tier4: 1,
};

const TIERS = ['tier1', 'tier2', 'tier3', 'tier4'] as const;

export const DEFAULT_WEIGHTS: ScoringWeights = {
  league: 1.0,
  domestic: 1.0,
  european: 1.0,
  attendance: 0.01,
  decayFloor: 0.15,
};

/**
 * Attempt to evaluate a cubic Bezier ease-in-out curve at parameter t.
 * Uses the standard CSS ease-in-out control points (0.42, 0, 0.58, 1).
 *
 * The cubic Bezier maps an input t (0..1) to an output y (0..1) following
 * an S-curve: slow start, fast middle, slow end.
 */
const easeInOut = (t: number): number => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  const p1x = 0.42;
  const p1y = 0.0;
  const p2x = 0.58;
  const p2y = 1.0;

  // Solve for the Bezier parameter u such that x(u) = t using Newton's method.
  // x(u) = 3(1-u)^2 * u * p1x + 3(1-u) * u^2 * p2x + u^3
  let u = t;
  for (let i = 0; i < 8; i++) {
    const u2 = u * u;
    const u3 = u2 * u;
    const oneMinusU = 1 - u;
    const oneMinusU2 = oneMinusU * oneMinusU;

    const x = 3 * oneMinusU2 * u * p1x + 3 * oneMinusU * u2 * p2x + u3;
    const dx = 3 * oneMinusU2 * p1x + 6 * oneMinusU * u * (p2x - p1x) + 3 * u2 * (1 - p2x);

    if (Math.abs(dx) < 1e-10) break;
    u -= (x - t) / dx;
    u = Math.max(0, Math.min(1, u));
  }

  const u2 = u * u;
  const u3 = u2 * u;
  const oneMinusU = 1 - u;
  const oneMinusU2 = oneMinusU * oneMinusU;

  return 3 * oneMinusU2 * u * p1y + 3 * oneMinusU * u2 * p2y + u3;
};

/**
 * Compute the decay weight for a given year. Maps years into [0..1] range
 * relative to the dataset span, applies the cubic Bezier ease-in-out curve,
 * and maps the result to [decayFloor..1.0].
 */
const decayWeight = (year: number, currentYear: number, oldestYear: number, decayFloor: number): number => {
  if (decayFloor >= 1.0) return 1.0;
  if (currentYear === oldestYear) return 1.0;

  const t = (currentYear - year) / (currentYear - oldestYear);
  return 1 - easeInOut(t) * (1 - decayFloor);
};

const findOldestYear = (clubs: AllTimeClubData[]): number => {
  let oldest = Infinity;

  for (const club of clubs) {
    for (const tier of TIERS) {
      const tierData = club.leagueRecord[tier];
      if (!tierData) continue;
      for (const yearStr of Object.keys(tierData)) {
        const y = Number(yearStr);
        if (y < oldest) oldest = y;
      }
    }

    const allHonourYears = [
      ...club.honours.leagueTitles.tier1,
      ...club.honours.leagueTitles.tier2,
      ...club.honours.leagueTitles.tier3,
      ...club.honours.leagueTitles.tier4,
      ...club.honours.leagueRunnersUp.tier1,
      ...club.honours.leagueRunnersUp.tier2,
      ...club.honours.leagueRunnersUp.tier3,
      ...club.honours.leagueRunnersUp.tier4,
      ...club.honours.playoffWinners.tier1,
      ...club.honours.playoffWinners.tier2,
      ...club.honours.playoffWinners.tier3,
      ...club.honours.playoffWinners.tier4,
      ...club.honours.faCupWinners,
      ...club.honours.faCupRunnersUp,
      ...club.honours.leagueCupWinners,
      ...club.honours.leagueCupRunnersUp,
      ...club.europeanHonours.championsLeagueWinners,
      ...club.europeanHonours.championsLeagueRunnersUp,
      ...club.europeanHonours.europaLeagueWinners,
      ...club.europeanHonours.europaLeagueRunnersUp,
      ...club.europeanHonours.conferenceLeagueWinners,
      ...club.europeanHonours.conferenceLeagueRunnersUp,
    ];

    for (const y of allHonourYears) {
      if (y < oldest) oldest = y;
    }
  }

  return oldest === Infinity ? new Date().getFullYear() : oldest;
};

const scoreLeaguePerformance = (
  leagueRecord: AllTimeClubData['leagueRecord'],
  currentYear: number,
  oldestYear: number,
  decayFloor: number,
): number => {
  let score = 0;

  for (const tier of TIERS) {
    const tierWeight = TIER_WEIGHTS[tier];
    const seasons: SeasonRecords = leagueRecord[tier] ?? {};

    for (const [yearStr, record] of Object.entries(seasons)) {
      const year = Number(yearStr);
      const decay = decayWeight(year, currentYear, oldestYear, decayFloor);
      const points = 3 * record.won + record.drawn;
      score += points * tierWeight * decay;
    }
  }

  return score;
};

const HONOUR_BASE_VALUES = {
  champions: 25,
  runnersUp: 12.5,
  playoffWinners: 5,
};

const scoreTieredHonours = (
  honours: TieredHonourYears,
  baseValue: number,
  currentYear: number,
  oldestYear: number,
  decayFloor: number,
): number => {
  let score = 0;

  for (const tier of TIERS) {
    const tierWeight = TIER_WEIGHTS[tier];
    for (const year of honours[tier] ?? []) {
      const decay = decayWeight(year, currentYear, oldestYear, decayFloor);
      score += baseValue * tierWeight * decay;
    }
  }

  return score;
};

const scoreYearArray = (
  years: number[],
  baseValue: number,
  currentYear: number,
  oldestYear: number,
  decayFloor: number,
): number => {
  let score = 0;
  for (const year of years) {
    score += baseValue * decayWeight(year, currentYear, oldestYear, decayFloor);
  }
  return score;
};

const scoreDomesticHonours = (
  honours: AllTimeClubData['honours'],
  currentYear: number,
  oldestYear: number,
  decayFloor: number,
): number => {
  let score = 0;

  score += scoreTieredHonours(honours.leagueTitles, HONOUR_BASE_VALUES.champions, currentYear, oldestYear, decayFloor);
  score += scoreTieredHonours(honours.leagueRunnersUp, HONOUR_BASE_VALUES.runnersUp, currentYear, oldestYear, decayFloor);
  score += scoreTieredHonours(honours.playoffWinners, HONOUR_BASE_VALUES.playoffWinners, currentYear, oldestYear, decayFloor);

  score += scoreYearArray(honours.faCupWinners, 80, currentYear, oldestYear, decayFloor);
  score += scoreYearArray(honours.faCupRunnersUp, 40, currentYear, oldestYear, decayFloor);
  score += scoreYearArray(honours.leagueCupWinners, 50, currentYear, oldestYear, decayFloor);
  score += scoreYearArray(honours.leagueCupRunnersUp, 25, currentYear, oldestYear, decayFloor);

  return score;
};

const scoreEuropeanHonours = (
  europeanHonours: AllTimeClubData['europeanHonours'],
  currentYear: number,
  oldestYear: number,
  decayFloor: number,
): number => {
  let score = 0;

  score += scoreYearArray(europeanHonours.championsLeagueWinners, 200, currentYear, oldestYear, decayFloor);
  score += scoreYearArray(europeanHonours.championsLeagueRunnersUp, 100, currentYear, oldestYear, decayFloor);
  score += scoreYearArray(europeanHonours.europaLeagueWinners, 100, currentYear, oldestYear, decayFloor);
  score += scoreYearArray(europeanHonours.europaLeagueRunnersUp, 50, currentYear, oldestYear, decayFloor);
  score += scoreYearArray(europeanHonours.conferenceLeagueWinners, 50, currentYear, oldestYear, decayFloor);
  score += scoreYearArray(europeanHonours.conferenceLeagueRunnersUp, 25, currentYear, oldestYear, decayFloor);

  return score;
};

export const calculateAllTimeScores = (
  clubs: AllTimeClubData[],
  weights: ScoringWeights = DEFAULT_WEIGHTS,
): RankedClub[] => {
  const currentYear = new Date().getFullYear();
  const oldestYear = findOldestYear(clubs);

  const scored = clubs.map((club) => {
    const leagueScore = scoreLeaguePerformance(club.leagueRecord, currentYear, oldestYear, weights.decayFloor);

    const domesticScore = scoreDomesticHonours(club.honours, currentYear, oldestYear, weights.decayFloor);

    const europeanScore = scoreEuropeanHonours(club.europeanHonours, currentYear, oldestYear, weights.decayFloor);

    const attendanceScore = club.averageAttendance;

    const totalScore =
      leagueScore * weights.league +
      domesticScore * weights.domestic +
      europeanScore * weights.european +
      attendanceScore * weights.attendance;

    return {
      club,
      rank: 0,
      totalScore,
      leagueScore: leagueScore * weights.league,
      domesticScore: domesticScore * weights.domestic,
      europeanScore: europeanScore * weights.european,
      attendanceScore: attendanceScore * weights.attendance,
    };
  });

  scored.sort((a, b) => b.totalScore - a.totalScore);

  return scored.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
};
