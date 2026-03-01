import type {
  Team,
  Match,
  TeamStanding,
  FormResult,
  PointDeduction,
  PredictionsStore,
} from '../types';

const FORM_LENGTH = 6;

interface MatchResult {
  homeTeamId: number;
  awayTeamId: number;
  homeGoals: number;
  awayGoals: number;
}

function getFormResult(goalsFor: number, goalsAgainst: number): FormResult {
  if (goalsFor > goalsAgainst) return 'W';
  if (goalsFor === goalsAgainst) return 'D';
  return 'L';
}

function createEmptyStanding(team: Team): TeamStanding {
  return {
    team,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    deduction: 0,
    form: [],
  };
}

function applyResult(standing: TeamStanding, goalsFor: number, goalsAgainst: number): void {
  standing.played += 1;
  standing.goalsFor += goalsFor;
  standing.goalsAgainst += goalsAgainst;
  standing.goalDifference = standing.goalsFor - standing.goalsAgainst;

  const result = getFormResult(goalsFor, goalsAgainst);
  standing.form.push(result);
  if (standing.form.length > FORM_LENGTH) {
    standing.form = standing.form.slice(-FORM_LENGTH);
  }

  if (goalsFor > goalsAgainst) {
    standing.won += 1;
    standing.points += 3;
  } else if (goalsFor === goalsAgainst) {
    standing.drawn += 1;
    standing.points += 1;
  } else {
    standing.lost += 1;
  }
}

/**
 * Head-to-head tiebreaker: compares two teams by their mutual matches.
 * Returns < 0 if team A ranks higher, > 0 if team B ranks higher, 0 if still tied.
 * Compares by: h2h points, then h2h goal difference, then away goals scored.
 */
function getHeadToHead(teamAId: number, teamBId: number, results: MatchResult[]): number {
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
}

export function calculateStandings(
  teams: Team[],
  matches: Match[],
  predictions: PredictionsStore,
  deductions: PointDeduction[] = [],
): TeamStanding[] {
  const standingsMap = new Map<number, TeamStanding>();

  for (const team of teams) {
    standingsMap.set(team.id, createEmptyStanding(team));
  }

  const results: MatchResult[] = [];

  for (const match of matches) {
    if (match.status === 'FINISHED' && match.homeGoals !== null && match.awayGoals !== null) {
      results.push({
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
        homeGoals: match.homeGoals,
        awayGoals: match.awayGoals,
      });
    } else if (match.status === 'SCHEDULED') {
      const prediction = predictions.predictions[String(match.id)];
      if (prediction) {
        results.push({
          homeTeamId: match.homeTeamId,
          awayTeamId: match.awayTeamId,
          homeGoals: prediction.homeGoals,
          awayGoals: prediction.awayGoals,
        });
      }
    }
  }

  for (const result of results) {
    const homeStanding = standingsMap.get(result.homeTeamId);
    const awayStanding = standingsMap.get(result.awayTeamId);

    if (homeStanding) {
      applyResult(homeStanding, result.homeGoals, result.awayGoals);
    }
    if (awayStanding) {
      applyResult(awayStanding, result.awayGoals, result.homeGoals);
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

  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

    const h2h = getHeadToHead(a.team.id, b.team.id, results);
    if (h2h !== 0) return h2h;

    return a.team.name.localeCompare(b.team.name);
  });

  return standings;
}
