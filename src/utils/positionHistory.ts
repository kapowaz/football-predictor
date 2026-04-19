import type {
  Team,
  Match,
  FormEntry,
  PointDeduction,
  PredictionsStore,
  VariantRulesMode,
} from '../types';
import {
  resolveMatchResults,
  createEmptyStanding,
  applyResult,
  getFormResult,
  compareTeamStandings,
  type MatchResult,
} from './standings';

/**
 * Computes a position history for every team, snapshotting positions only at
 * completed round boundaries (when every team has played at least N matches).
 *
 * Returns a Map from team ID to an array of 1-based positions, one per
 * completed round.
 */
export const calculatePositionHistory = (
  teams: Team[],
  matches: Match[],
  predictions: PredictionsStore,
  deductions: PointDeduction[] = [],
  variantRules: VariantRulesMode = false,
): Map<number, number[]> => {
  const teamsById = new Map(teams.map((team) => [team.id, team] as const));
  const results = resolveMatchResults(matches, predictions, teamsById);

  const standingsMap = new Map(
    teams.map((team) => [team.id, createEmptyStanding(team)] as const),
  );

  for (const deduction of deductions) {
    const standing = standingsMap.get(deduction.teamId);
    if (standing) {
      standing.deduction = deduction.amount;
      standing.points -= deduction.amount;
    }
  }

  const matchCounts = new Map<number, number>(
    teams.map((team) => [team.id, 0]),
  );
  const history = new Map<number, number[]>(teams.map((team) => [team.id, []]));
  const processedResults: MatchResult[] = [];
  let currentMinPlayed = 0;

  for (const result of results) {
    const homeStanding = standingsMap.get(result.homeTeamId);
    const awayStanding = standingsMap.get(result.awayTeamId);

    const homeEntry: FormEntry = {
      result: getFormResult(result.homeGoals, result.awayGoals, variantRules),
      matchId: result.matchId,
      isPrediction: result.isPrediction,
      homeTeamName: result.homeTeamName,
      awayTeamName: result.awayTeamName,
      homeGoals: result.homeGoals,
      awayGoals: result.awayGoals,
      goalsScored: result.homeGoals,
      goalsConceded: result.awayGoals,
    };

    if (homeStanding) {
      applyResult(
        homeStanding,
        result.homeGoals,
        result.awayGoals,
        homeEntry,
        variantRules,
      );
      matchCounts.set(
        result.homeTeamId,
        (matchCounts.get(result.homeTeamId) ?? 0) + 1,
      );
    }

    if (awayStanding) {
      const awayEntry: FormEntry = {
        ...homeEntry,
        result: getFormResult(result.awayGoals, result.homeGoals, variantRules),
        goalsScored: result.awayGoals,
        goalsConceded: result.homeGoals,
      };
      applyResult(
        awayStanding,
        result.awayGoals,
        result.homeGoals,
        awayEntry,
        variantRules,
      );
      matchCounts.set(
        result.awayTeamId,
        (matchCounts.get(result.awayTeamId) ?? 0) + 1,
      );
    }

    processedResults.push(result);

    const minPlayed = Math.min(...matchCounts.values());
    if (minPlayed > currentMinPlayed) {
      currentMinPlayed = minPlayed;

      const sorted = Array.from(standingsMap.values());
      sorted.sort((a, b) => compareTeamStandings(a, b, processedResults));

      for (let i = 0; i < sorted.length; i++) {
        history.get(sorted[i].team.id)!.push(i + 1);
      }
    }
  }

  return history;
};

export type PositionTrend = 'positive' | 'negative' | 'stable';

/** Derive the overall trend from a slice of position history. */
export const getPositionTrend = (positions: number[]): PositionTrend => {
  if (positions.length < 2) return 'stable';
  const first = positions[0];
  const last = positions[positions.length - 1];
  if (last < first) return 'positive';
  if (last > first) return 'negative';
  return 'stable';
};
