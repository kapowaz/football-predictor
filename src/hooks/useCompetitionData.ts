import { useEffect, useMemo } from 'react';
import type {
  Team,
  Match,
  PointDeduction,
  TeamsData,
  MatchesData,
  ApiStandingsData,
  ModelPredictionsData,
} from '../types';
import { competitionData } from '../data';
import { calculateStandings } from '../utils/standings';
import { validateStandings } from '../utils/validateStandings';

const applyOverrides = (base: Match[], overrides: Match[]): Match[] => {
  const overrideMap = new Map(overrides.map((m) => [m.id, m]));
  return base.map((match) => overrideMap.get(match.id) ?? match);
};

interface CompetitionDataResult {
  teams: Team[];
  matches: Match[];
  defaultDeductions: PointDeduction[];
  modelPredictions: Record<string, { homeGoals: number; awayGoals: number }>;
}

export const useCompetitionData = (slug: string): CompetitionDataResult => {
  const data = competitionData[slug];

  const teams = (data.teamsData as TeamsData).teams;
  const matches = applyOverrides(
    (data.matchesData as MatchesData).matches,
    (data.overridesData as unknown as MatchesData).matches,
  );
  const defaultDeductions = data.deductionsData as PointDeduction[];
  const apiStandings = data.standingsData as ApiStandingsData;
  const modelPredictions = (data.modelPredictionsData as ModelPredictionsData).predictions;

  const calculatedFromResults = useMemo(() => {
    const emptyPredictions = { predictions: {}, lastModified: '' };
    return calculateStandings(teams, matches, emptyPredictions, defaultDeductions);
  }, [teams, matches, defaultDeductions]);

  useEffect(() => {
    if (apiStandings.standings.length > 0) {
      validateStandings(calculatedFromResults, apiStandings);
    }
  }, [calculatedFromResults, apiStandings]);

  return { teams, matches, defaultDeductions, modelPredictions };
};
