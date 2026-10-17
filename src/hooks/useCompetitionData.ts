import { use, useEffect, useMemo, useRef } from 'react';

import { loadCompetitionData } from '../data';
import { features } from '../data/features';
import { applyGenuineToData } from '../data/genuine';
import type {
  Team,
  Match,
  PointDeduction,
  TeamsData,
  MatchesData,
  ApiStandingsData,
  ModelPredictionsData,
} from '../types';
import type { ValidateStandingsResponse } from '../workers/validateStandings.worker';
import { useGenuine } from './useGenuine';

const applyOverrides = (base: Match[], overrides: Match[]): Match[] => {
  const overrideMap = new Map(overrides.map((m) => [m.id, m]));
  return base.map((match) => overrideMap.get(match.id) ?? match);
};

let validationWorker: Worker | null = null;
let nextValidationRequestId = 0;

const getValidationWorker = (): Worker => {
  if (!validationWorker) {
    validationWorker = new Worker(
      new URL('../workers/validateStandings.worker.ts', import.meta.url),
      { type: 'module' },
    );
  }
  return validationWorker;
};

interface CompetitionDataResult {
  teams: Team[];
  matches: Match[];
  defaultDeductions: PointDeduction[];
  modelPredictions: Record<string, { homeGoals: number; awayGoals: number }>;
}

export const useCompetitionData = (slug: string): CompetitionDataResult => {
  const data = use(loadCompetitionData(slug));
  const genuine = useGenuine(slug);

  // In "genuine" mode, excluded teams and all of their matches are removed,
  // so standings will not match the API's table (validation logs say so).
  const {
    teams,
    matches,
    deductions: defaultDeductions,
  } = useMemo(() => {
    const base = {
      teams: (data.teamsData as TeamsData).teams,
      matches: applyOverrides(
        (data.matchesData as MatchesData).matches,
        (data.overridesData as unknown as MatchesData).matches,
      ),
      deductions: data.deductionsData as PointDeduction[],
    };
    return genuine ? applyGenuineToData(slug, base) : base;
  }, [
    data.teamsData,
    data.matchesData,
    data.overridesData,
    data.deductionsData,
    genuine,
    slug,
  ]);
  const apiStandings = useMemo(
    () => data.standingsData as ApiStandingsData,
    [data.standingsData],
  );
  // Empty when the feature is off, which hides every "AI Predictions" action.
  const modelPredictions = useMemo(
    () =>
      features.aiPredictions
        ? (data.modelPredictionsData as ModelPredictionsData).predictions
        : {},
    [data.modelPredictionsData],
  );

  const validationRequestId = useRef(-1);

  useEffect(() => {
    if (apiStandings.standings.length === 0) return;

    const id = ++nextValidationRequestId;
    validationRequestId.current = id;

    const w = getValidationWorker();

    const handler = (event: MessageEvent<ValidateStandingsResponse>) => {
      if (event.data.requestId !== id) return;
      for (const entry of event.data.logs) {
        if (entry.level === 'warn') {
          console.warn(...entry.args);
        } else {
          console.log(...entry.args);
        }
      }
    };

    w.addEventListener('message', handler);
    w.postMessage({
      requestId: id,
      teams,
      matches,
      defaultDeductions,
      apiStandings,
    });

    return () => {
      w.removeEventListener('message', handler);
    };
  }, [teams, matches, defaultDeductions, apiStandings]);

  return { teams, matches, defaultDeductions, modelPredictions };
};
