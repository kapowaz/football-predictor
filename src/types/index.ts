export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface PointDeduction {
  teamId: number;
  amount: number;
  reason: string;
}

export interface TeamsData {
  competition: string;
  season: string;
  teams: Team[];
}

export interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  utcDate: string;
  status: 'SCHEDULED' | 'FINISHED';
  homeGoals: number | null;
  awayGoals: number | null;
}

export interface MatchesData {
  lastUpdated: string;
  matches: Match[];
}

export interface Prediction {
  matchId: number;
  homeGoals: number;
  awayGoals: number;
}

export interface PredictionsStore {
  predictions: Record<string, { homeGoals: number; awayGoals: number }>;
  lastModified: string;
}

export interface ApiStandingEntry {
  position: number;
  teamId: number;
  teamName: string;
  playedGames: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface ApiStandingsData {
  lastUpdated: string;
  standings: ApiStandingEntry[];
}

export type FormResult = 'W' | 'D' | 'L';

export interface TeamStanding {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  deduction: number;
  form: FormResult[];
}
