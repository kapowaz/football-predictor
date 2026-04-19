import type { ZoneDefinition } from '../data/competitions';
import type {
  Match,
  PointDeduction,
  PredictionsStore,
  Team,
  TeamStanding,
  VariantRulesMode,
} from '../types';
import { calculatePositionHistory } from '../utils/positionHistory';
import { calculateStandings } from '../utils/standings';
import type { CompetitionSessionState } from './competitionSessionStore';

interface DeductionNote {
  label: string;
  reason: string;
}

interface StandingsViewModel {
  standings: TeamStanding[];
  deductionMarkers: Map<number, string>;
}

const memoizeByReference = <TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
): ((...args: TArgs) => TResult) => {
  let hasCachedResult = false;
  let previousArgs: TArgs | undefined;
  let previousResult: TResult;

  return (...args: TArgs): TResult => {
    const cachedArgs = previousArgs;
    if (
      hasCachedResult &&
      cachedArgs &&
      args.length === cachedArgs.length &&
      args.every((arg, index) => Object.is(arg, cachedArgs[index]))
    ) {
      return previousResult;
    }

    previousArgs = args;
    previousResult = fn(...args);
    hasCachedResult = true;
    return previousResult;
  };
};

export const selectTeamsById = memoizeByReference(
  (teams: Team[]): Map<number, Team> => {
    return new Map(teams.map((team) => [team.id, team]));
  },
);

export const selectStandings = memoizeByReference(
  (
    teams: Team[],
    matches: Match[],
    predictions: PredictionsStore,
    deductions: PointDeduction[],
    variantRules: VariantRulesMode = false,
  ): TeamStanding[] => {
    return calculateStandings(
      teams,
      matches,
      predictions,
      deductions,
      variantRules,
    );
  },
);

export const selectDeductionMarkers = memoizeByReference(
  (deductions: PointDeduction[]): Map<number, string> => {
    return new Map(
      deductions.map((deduction, index) => [
        deduction.teamId,
        '*'.repeat(index + 1),
      ]),
    );
  },
);

export const selectDeductionNotes = memoizeByReference(
  (
    deductions: PointDeduction[],
    teamsById: Map<number, Team>,
  ): DeductionNote[] => {
    return deductions.map((deduction, index) => {
      const team = teamsById.get(deduction.teamId);
      const marker = '*'.repeat(index + 1);

      return {
        label: `${marker}${team?.shortName ?? `Team ${deduction.teamId}`} -${deduction.amount} pts`,
        reason: deduction.reason ?? '',
      };
    });
  },
);

export const selectPredictedCount = memoizeByReference(
  (predictions: PredictionsStore): number => {
    return Object.keys(predictions.predictions).length;
  },
);

export const selectAllScheduledPredicted = memoizeByReference(
  (matches: Match[], predictions: PredictionsStore): boolean => {
    return matches
      .filter((match) => match.status === 'SCHEDULED')
      .every((match) => String(match.id) in predictions.predictions);
  },
);

export const selectAllFixturesResolved = memoizeByReference(
  (matches: Match[], predictions: PredictionsStore): boolean => {
    return matches.every(
      (match) =>
        match.status === 'FINISHED' ||
        String(match.id) in predictions.predictions,
    );
  },
);

export const selectIsSummaryOpen = memoizeByReference(
  (allFixturesResolved: boolean, summaryDismissed: boolean): boolean => {
    return allFixturesResolved && !summaryDismissed;
  },
);

export const selectCaptureSignature = memoizeByReference(
  (
    standings: TeamStanding[],
    deductionMarkers: Map<number, string>,
    theme: string,
  ): string => {
    const standingsKey = standings
      .map(
        (standing) =>
          `${standing.team.id}:${standing.points}:${standing.goalDifference}:${standing.deduction}`,
      )
      .join('|');
    const markerKey = [...deductionMarkers.entries()]
      .map(([teamId, marker]) => `${teamId}:${marker}`)
      .join('|');

    return `${theme}::${standingsKey}::${markerKey}`;
  },
);

export const selectStandingsViewModel = memoizeByReference(
  (
    teams: Team[],
    matches: Match[],
    predictions: PredictionsStore,
    deductions: PointDeduction[],
    _zones: ZoneDefinition[],
    variantRules: VariantRulesMode = false,
  ): StandingsViewModel => {
    const standings = selectStandings(
      teams,
      matches,
      predictions,
      deductions,
      variantRules,
    );
    const deductionMarkers = selectDeductionMarkers(deductions);

    return { standings, deductionMarkers };
  },
);

export const selectPositionHistory = memoizeByReference(
  (
    teams: Team[],
    matches: Match[],
    predictions: PredictionsStore,
    deductions: PointDeduction[],
    variantRules: VariantRulesMode = false,
  ): Map<number, number[]> => {
    return calculatePositionHistory(
      teams,
      matches,
      predictions,
      deductions,
      variantRules,
    );
  },
);

export const selectSessionForSlug = (
  sessions: Record<string, CompetitionSessionState>,
  slug: string,
): CompetitionSessionState | null => {
  return sessions[slug] ?? null;
};

export type { DeductionNote, StandingsViewModel };
