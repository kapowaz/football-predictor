import type {
  Team,
  Match,
  TeamStanding,
  FormResult,
  FormEntry,
  PointDeduction,
  PredictionsStore,
  VariantRulesMode,
} from '../types';

const FORM_LENGTH = 6;

export interface MatchResult {
  matchId: number;
  isPrediction: boolean;
  homeTeamId: number;
  awayTeamId: number;
  homeTeamName: string;
  awayTeamName: string;
  homeGoals: number;
  awayGoals: number;
}

export const getFormResult = (
  goalsFor: number,
  goalsAgainst: number,
  variantRules: VariantRulesMode = false,
): FormResult => {
  if (goalsFor > goalsAgainst) {
    if (variantRules === 'new-rules' && goalsFor - goalsAgainst >= 2)
      return 'B';
    return 'W';
  }
  if (goalsFor === goalsAgainst) return 'D';
  return 'L';
};

export const createEmptyStanding = (team: Team): TeamStanding => {
  return {
    team,
    played: 0,
    won: 0,
    bonus: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    deduction: 0,
    form: [],
  };
};

/**
 * Calculate per-match points under bonus-points rules:
 * 4 for a win, 2 for a draw, 0 for a loss,
 * +1 if you lose by only 1 goal, +1 if you score 3+ goals.
 */
export const getBonusPointsForResult = (
  goalsScored: number,
  goalsConceded: number,
): number => {
  let points = 0;
  if (goalsScored > goalsConceded) {
    points += 4;
  } else if (goalsScored === goalsConceded) {
    points += 2;
  } else if (goalsConceded - goalsScored === 1) {
    points += 1;
  }
  if (goalsScored >= 3) points += 1;
  return points;
};

export const applyResult = (
  standing: TeamStanding,
  goalsFor: number,
  goalsAgainst: number,
  entry: FormEntry,
  variantRules: VariantRulesMode = false,
): void => {
  standing.played += 1;
  standing.goalsFor += goalsFor;
  standing.goalsAgainst += goalsAgainst;
  standing.goalDifference = standing.goalsFor - standing.goalsAgainst;

  standing.form.push(entry);
  if (standing.form.length > FORM_LENGTH) {
    standing.form = standing.form.slice(-FORM_LENGTH);
  }

  if (goalsFor > goalsAgainst) {
    standing.won += 1;
    if (variantRules === 'new-rules' && goalsFor - goalsAgainst >= 2) {
      standing.bonus += 1;
      standing.points += 3;
    } else if (variantRules === 'new-rules') {
      standing.points += 2;
    } else if (variantRules === 'bonus-points') {
      standing.points += getBonusPointsForResult(goalsFor, goalsAgainst);
    } else {
      standing.points += 3;
    }
  } else if (goalsFor === goalsAgainst) {
    standing.drawn += 1;
    if (variantRules === 'bonus-points') {
      standing.points += getBonusPointsForResult(goalsFor, goalsAgainst);
    } else {
      standing.points += 1;
    }
  } else {
    standing.lost += 1;
    if (variantRules === 'bonus-points') {
      standing.points += getBonusPointsForResult(goalsFor, goalsAgainst);
    }
  }
};

/**
 * Head-to-head tiebreaker: compares two teams by their mutual matches.
 * Returns < 0 if team A ranks higher, > 0 if team B ranks higher, 0 if still tied.
 * Compares by: h2h points, then h2h goal difference, then away goals scored.
 */
export const getHeadToHead = (
  teamAId: number,
  teamBId: number,
  results: MatchResult[],
): number => {
  const h2hMatches = results.filter(
    (r) =>
      (r.homeTeamId === teamAId && r.awayTeamId === teamBId) ||
      (r.homeTeamId === teamBId && r.awayTeamId === teamAId),
  );

  if (h2hMatches.length === 0) return 0;

  let aPoints = 0;
  let bPoints = 0;
  let aGoalsFor = 0;
  let aGoalsAgainst = 0;
  let aAwayGoals = 0;
  let bAwayGoals = 0;

  for (const match of h2hMatches) {
    const aIsHome = match.homeTeamId === teamAId;
    const aGoals = aIsHome ? match.homeGoals : match.awayGoals;
    const bGoals = aIsHome ? match.awayGoals : match.homeGoals;

    aGoalsFor += aGoals;
    aGoalsAgainst += bGoals;

    if (!aIsHome) aAwayGoals += aGoals;
    else bAwayGoals += bGoals;

    if (aGoals > bGoals) {
      aPoints += 3;
    } else if (aGoals === bGoals) {
      aPoints += 1;
      bPoints += 1;
    } else {
      bPoints += 3;
    }
  }

  if (aPoints !== bPoints) return bPoints - aPoints;

  const aGD = aGoalsFor - aGoalsAgainst;
  const bGD = -aGD;
  if (aGD !== bGD) return bGD - aGD;

  if (aAwayGoals !== bAwayGoals) return bAwayGoals - aAwayGoals;

  return 0;
};

export const compareTeamStandings = (
  a: TeamStanding,
  b: TeamStanding,
  results: MatchResult[],
): number => {
  if (b.points !== a.points) return b.points - a.points;
  if (b.goalDifference !== a.goalDifference)
    return b.goalDifference - a.goalDifference;
  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

  const h2h = getHeadToHead(a.team.id, b.team.id, results);
  if (h2h !== 0) return h2h;

  return a.team.name.localeCompare(b.team.name);
};

export const resolveMatchResults = (
  matches: Match[],
  predictions: PredictionsStore,
  teamsById: Map<number, Team>,
): MatchResult[] => {
  const results: MatchResult[] = [];

  for (const match of matches) {
    const homeTeamName = teamsById.get(match.homeTeamId)?.shortName ?? '';
    const awayTeamName = teamsById.get(match.awayTeamId)?.shortName ?? '';

    if (
      match.status === 'FINISHED' &&
      match.homeGoals !== null &&
      match.awayGoals !== null
    ) {
      results.push({
        matchId: match.id,
        isPrediction: false,
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
        homeTeamName,
        awayTeamName,
        homeGoals: match.homeGoals,
        awayGoals: match.awayGoals,
      });
      continue;
    }

    if (match.status === 'SCHEDULED') {
      const prediction = predictions.predictions[String(match.id)];
      if (prediction) {
        results.push({
          matchId: match.id,
          isPrediction: true,
          homeTeamId: match.homeTeamId,
          awayTeamId: match.awayTeamId,
          homeTeamName,
          awayTeamName,
          homeGoals: prediction.homeGoals,
          awayGoals: prediction.awayGoals,
        });
      }
    }
  }

  return results;
};

export const calculateStandings = (
  teams: Team[],
  matches: Match[],
  predictions: PredictionsStore,
  deductions: PointDeduction[] = [],
  variantRules: VariantRulesMode = false,
): TeamStanding[] => {
  const standingsMap = new Map<number, TeamStanding>();

  for (const team of teams) {
    standingsMap.set(team.id, createEmptyStanding(team));
  }

  const teamsById = new Map(teams.map((team) => [team.id, team] as const));
  const results = resolveMatchResults(matches, predictions, teamsById);

  for (const result of results) {
    const homeStanding = standingsMap.get(result.homeTeamId);
    const awayStanding = standingsMap.get(result.awayTeamId);
    const entry: FormEntry = {
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
        entry,
        variantRules,
      );
    }
    if (awayStanding) {
      const awayEntry: FormEntry = {
        ...entry,
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
    }
  }

  for (const deduction of deductions) {
    const standing = standingsMap.get(deduction.teamId);
    if (standing) {
      standing.deduction = deduction.amount;
      standing.points -= deduction.amount;
    }
  }

  const standings = Array.from(standingsMap.values());
  standings.sort((a, b) => compareTeamStandings(a, b, results));

  return standings;
};
