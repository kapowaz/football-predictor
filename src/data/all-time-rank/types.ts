/** A single season's league record for a club at a given tier. */
export interface TierRecord {
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
}

/** Per-season records keyed by year (using the second year of the season, e.g. 2025/26 = 2026). */
export type SeasonRecords = Record<number, TierRecord>;

/** Years in which a tiered honour was achieved. */
export interface TieredHonourYears {
  tier1: number[];
  tier2: number[];
  tier3: number[];
  tier4: number[];
}

export interface AllTimeClubData {
  name: string;
  shortName: string;
  badge: string;
  founded: number;
  /** 1-4 for current EFL/PL tier, or null if below the football league. */
  currentTier: number | null;
  leagueRecord: {
    tier1: SeasonRecords;
    tier2: SeasonRecords;
    tier3: SeasonRecords;
    tier4: SeasonRecords;
  };
  honours: {
    leagueTitles: TieredHonourYears;
    leagueRunnersUp: TieredHonourYears;
    playoffWinners: TieredHonourYears;
    faCupWinners: number[];
    faCupRunnersUp: number[];
    leagueCupWinners: number[];
    leagueCupRunnersUp: number[];
  };
  europeanHonours: {
    championsLeagueWinners: number[];
    championsLeagueRunnersUp: number[];
    europaLeagueWinners: number[];
    europaLeagueRunnersUp: number[];
    conferenceLeagueWinners: number[];
    conferenceLeagueRunnersUp: number[];
  };
  /** All-time historical average home attendance. */
  averageAttendance: number;
}

export interface ScoringWeights {
  /** Scaling factor for league performance category. */
  league: number;
  /** Scaling factor for domestic honours category. */
  domestic: number;
  /** Scaling factor for European honours category. */
  european: number;
  /** Scaling factor for attendance category. */
  attendance: number;
  /** Minimum weight applied to the oldest seasons (1.0 = no decay). */
  decayFloor: number;
}

export interface RankedClub {
  club: AllTimeClubData;
  rank: number;
  totalScore: number;
  leagueScore: number;
  domesticScore: number;
  europeanScore: number;
  attendanceScore: number;
}
