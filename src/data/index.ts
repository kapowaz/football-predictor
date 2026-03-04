import type {
  TeamsData,
  MatchesData,
  PointDeduction,
  ApiStandingsData,
  ModelPredictionsData,
} from '../types';

import * as eflChampionship from './efl-championship';
import * as premierLeague from './premier-league';

export interface CompetitionData {
  teamsData: TeamsData;
  matchesData: MatchesData;
  overridesData: { lastUpdated: string; matches: MatchesData['matches'] };
  deductionsData: PointDeduction[];
  standingsData: ApiStandingsData;
  modelPredictionsData: ModelPredictionsData;
}

export const competitionData: Record<string, CompetitionData> = {
  'efl-championship': eflChampionship as unknown as CompetitionData,
  'premier-league': premierLeague as unknown as CompetitionData,
};
