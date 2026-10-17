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
  /** Teams in the table (excluded teams removed in "genuine" mode). */
  teams: Team[];
  /** Matches that count (excluded teams' matches removed in "genuine" mode). */
  matches: Match[];
  /**
   * Every match of the season, regardless of "genuine" mode. Pass this to
   * `useCompetitionSession`: URL-encoded predictions are positional over it,
   * so shared links decode the same whichever mode is active.
   */
  allMatches: Match[];
  /**
   * Default deductions, unfiltered so the session's defaults do not change
   * when "genuine" mode is toggled; `useCompetitionSession` filters its output.
   */
  defaultDeductions: PointDeduction[];
  modelPredictions: Record<string, { homeGoals: number; awayGoals: number }>;
}

export const useCompetitionData = (slug: string): CompetitionDataResult => {
  const data = use(loadCompetitionData(slug));
  const genuine = useGenuine(slug);

  const allTeams = useMemo(
    () => (data.teamsData as TeamsData).teams,
    [data.teamsData],
  );
  const allMatches = useMemo(
    () =>
      applyOverrides(
        (data.matchesData as MatchesData).matches,
        (data.overridesData as unknown as MatchesData).matches,
      ),
    [data.matchesData, data.overridesData],
  );
  // In "genuine" mode, excluded teams and all of their matches are removed,
  // so standings will not match the API's table.
  const { teams, matches } = useMemo(() => {
    const base = { teams: allTeams, matches: allMatches };
    return genuine ? applyGenuineToData(slug, base) : base;
  }, [allTeams, allMatches, genuine, slug]);
  const defaultDeductions = useMemo(
    () => data.deductionsData as PointDeduction[],
    [data.deductionsData],
  );
  const apiStandings = useMemo(
    () => data.standingsData as ApiStandingsData,
    [data.standingsData],
  );
  // Empty when the feature is off, which hides every "AI Predictions" action.
  // Limited to counted matches so excluded teams' fixtures are never filled.
  const modelPredictions = useMemo(() => {
    if (!features.aiPredictions) return {};
    const all = (data.modelPredictionsData as ModelPredictionsData).predictions;
    const ids = new Set(matches.map((m) => String(m.id)));
    return Object.fromEntries(
      Object.entries(all).filter(([id]) => ids.has(id)),
    );
  }, [data.modelPredictionsData, matches]);

  const validationRequestId = useRef(-1);

  useEffect(() => {
    // The API table includes excluded teams, so validation would only warn.
    if (genuine || apiStandings.standings.length === 0) return;

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
  }, [genuine, teams, matches, defaultDeductions, apiStandings]);

  return { teams, matches, allMatches, defaultDeductions, modelPredictions };
};
