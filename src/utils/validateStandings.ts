import type { TeamStanding, ApiStandingsData } from '../types';

interface Discrepancy {
  teamName: string;
  field: string;
  calculated: number;
  api: number;
}

export const validateStandings = (
  calculated: TeamStanding[],
  apiStandings: ApiStandingsData,
): void => {
  if (apiStandings.standings.length === 0) {
    return;
  }

  const discrepancies: Discrepancy[] = [];

  for (const apiEntry of apiStandings.standings) {
    const calcEntry = calculated.find((s) => s.team.id === apiEntry.teamId);
    if (!calcEntry) {
      console.warn(
        `[Standings Validation] Team "${apiEntry.teamName}" (id: ${apiEntry.teamId}) not found in calculated standings`,
      );
      continue;
    }

    const checks: [string, number, number][] = [
      ['played', calcEntry.played, apiEntry.playedGames],
      ['won', calcEntry.won, apiEntry.won],
      ['drawn', calcEntry.drawn, apiEntry.drawn],
      ['lost', calcEntry.lost, apiEntry.lost],
      ['points', calcEntry.points, apiEntry.points],
      ['goalsFor', calcEntry.goalsFor, apiEntry.goalsFor],
      ['goalsAgainst', calcEntry.goalsAgainst, apiEntry.goalsAgainst],
      ['goalDifference', calcEntry.goalDifference, apiEntry.goalDifference],
    ];

    for (const [field, calcValue, apiValue] of checks) {
      if (calcValue !== apiValue) {
        discrepancies.push({
          teamName: calcEntry.team.name,
          field,
          calculated: calcValue,
          api: apiValue,
        });
      }
    }
  }

  if (discrepancies.length === 0) {
    console.log(
      `%c[Standings Validation] ✓ All ${apiStandings.standings.length} teams match the API standings (as of ${apiStandings.lastUpdated})`,
      'color: green',
    );
  } else {
    console.warn(
      `[Standings Validation] Found ${discrepancies.length} discrepancies vs API standings (as of ${apiStandings.lastUpdated}):`,
    );
    for (const d of discrepancies) {
      console.warn(
        `  ${d.teamName}: ${d.field} — calculated: ${d.calculated}, API: ${d.api}`,
      );
    }
  }
};
