import type {
  TeamsData,
  MatchesData,
  PointDeduction,
  ApiStandingsData,
  ModelPredictionsData,
} from '../types';
import ENABLED_COMPETITION_SLUGS from './enabled-competitions.json';

import * as eflChampionship from './efl-championship';
import * as eflLeagueOne from './efl-league-one';
import * as eflLeagueTwo from './efl-league-two';
import * as premierLeague from './premier-league';

export interface CompetitionData {
  teamsData: TeamsData;
  matchesData: MatchesData;
  overridesData: { lastUpdated: string; matches: MatchesData['matches'] };
  deductionsData: PointDeduction[];
  standingsData: ApiStandingsData;
  modelPredictionsData: ModelPredictionsData;
}

const allCompetitionData: Record<string, CompetitionData> = {
  'premier-league': premierLeague as unknown as CompetitionData,
  'efl-championship': eflChampionship as unknown as CompetitionData,
  'efl-league-one': eflLeagueOne as unknown as CompetitionData,
  'efl-league-two': eflLeagueTwo as unknown as CompetitionData,
};

export const competitionData: Record<string, CompetitionData> = Object.fromEntries(
  Object.entries(allCompetitionData).filter(([slug]) =>
    ENABLED_COMPETITION_SLUGS.includes(slug),
  ),
);
