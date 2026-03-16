export interface Team {
  id: number;
  fotmobId: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface PointDeduction {
  teamId: number;
  amount: number;
  reason?: string;
}

export interface TeamsData {
  competition: string;
  season: string;
  teams: Team[];
}

interface MatchBase {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  utcDate: string;
}

export interface ScheduledMatch extends MatchBase {
  status: 'SCHEDULED';
  homeGoals: null;
  awayGoals: null;
}

export interface FinishedMatch extends MatchBase {
  status: 'FINISHED';
  homeGoals: number;
  awayGoals: number;
}

export type Match = ScheduledMatch | FinishedMatch;

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

export interface ModelPredictionsData {
  lastUpdated: string;
  predictions: Record<string, { homeGoals: number; awayGoals: number }>;
}

export type FormResult = 'W' | 'D' | 'L' | 'B';

/** Identifies which variant scoring system is active, or `false` for standard rules. */
export type VariantRulesMode = 'new-rules' | 'bonus-points' | false;

export interface FormEntry {
  result: FormResult;
  matchId: number;
  isPrediction: boolean;
  homeTeamName: string;
  awayTeamName: string;
  homeGoals: number;
  awayGoals: number;
  /** Goals scored by the team this entry belongs to. */
  goalsScored: number;
  /** Goals conceded by the team this entry belongs to. */
  goalsConceded: number;
}

export interface TeamStanding {
  team: Team;
  played: number;
  won: number;
  bonus: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  deduction: number;
  form: FormEntry[];
}
