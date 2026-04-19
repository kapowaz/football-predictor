import type { ZoneDefinition } from '../data/competitions';
import type { Match, PredictionsStore, TeamStanding } from '../types';
import {
  Dinic,
  buildTeamState,
  getUnresolvedMatches,
  combinationSearch,
  type UnresolvedMatch,
  type TeamState,
} from './zoneGuarantees';

interface TeamMaxPoints {
  teamId: number;
  teamName: string;
  currentPoints: number;
  remainingGames: number;
  maxAchievable: number;
}

export interface ZoneThreshold {
  zone: ZoneDefinition;
  /** Tight minimum points to guarantee finishing in (or safe from) this zone. */
  threshold: number;
  /**
   * Naive threshold that treats each team's max achievable independently,
   * without accounting for the constraint that head-to-head opponents
   * cannot both win the same match.
   */
  naiveThreshold: number;
  /**
   * The team whose individual max achievable defines the naive boundary.
   * For non-relegation zones this is the first team just outside the zone;
   * for relegation it is the highest-potential team inside the zone.
   */
  boundaryTeam: TeamMaxPoints;
}

/**
 * Checks whether a specific set of teams can all simultaneously reach
 * {@link threshold} points, respecting the constraint that each unresolved
 * match distributes at most 3 points to one side.
 *
 * Models the problem as a max-flow network:
 *   source → match nodes (cap 3) → team nodes (cap = demand) → sink
 */
const canSubsetSimultaneouslyReachThreshold = (
  selectedTeamIds: number[],
  threshold: number,
  teamStateById: Map<number, TeamState>,
  unresolvedMatches: UnresolvedMatch[],
): boolean => {
  let totalDemand = 0;
  const demandByTeamId = new Map<number, number>();

  for (const teamId of selectedTeamIds) {
    const state = teamStateById.get(teamId);
    if (!state) return false;
    const demand = Math.max(0, threshold - state.points);
    demandByTeamId.set(teamId, demand);
    totalDemand += demand;
  }

  if (totalDemand === 0) return true;

  const selectedTeamIdSet = new Set(selectedTeamIds);
  const relevantMatches = unresolvedMatches.filter(
    (match) =>
      selectedTeamIdSet.has(match.homeTeamId) ||
      selectedTeamIdSet.has(match.awayTeamId),
  );

  const source = 0;
  const matchStart = 1;
  const teamStart = matchStart + relevantMatches.length;
  const sink = teamStart + selectedTeamIds.length;
  const flow = new Dinic(sink + 1);

  const teamNodeById = new Map<number, number>();
  selectedTeamIds.forEach((teamId, index) => {
    teamNodeById.set(teamId, teamStart + index);
  });

  relevantMatches.forEach((match, index) => {
    const matchNode = matchStart + index;
    flow.addEdge(source, matchNode, 3);

    const homeNode = teamNodeById.get(match.homeTeamId);
    if (homeNode != null) flow.addEdge(matchNode, homeNode, 3);
    const awayNode = teamNodeById.get(match.awayTeamId);
    if (awayNode != null) flow.addEdge(matchNode, awayNode, 3);
  });

  selectedTeamIds.forEach((teamId) => {
    const node = teamNodeById.get(teamId)!;
    const demand = demandByTeamId.get(teamId) ?? 0;
    flow.addEdge(node, sink, demand);
  });

  return flow.maxFlow(source, sink) === totalDemand;
};

/**
 * Returns true if any subset of exactly {@link subsetSize} teams can all
 * simultaneously reach {@link threshold} points. Only teams whose individual
 * max achievable >= threshold are considered as candidates.
 */
const canAnySubsetOfSizeReachThreshold = (
  subsetSize: number,
  threshold: number,
  allTeamIds: number[],
  teamStateById: Map<number, TeamState>,
  unresolvedMatches: UnresolvedMatch[],
): boolean => {
  const candidates = allTeamIds.filter((teamId) => {
    const state = teamStateById.get(teamId);
    if (!state) return false;
    return state.points + state.remaining * 3 >= threshold;
  });

  if (candidates.length < subsetSize) return false;

  return combinationSearch(candidates, subsetSize, (selectedIds) =>
    canSubsetSimultaneouslyReachThreshold(
      selectedIds,
      threshold,
      teamStateById,
      unresolvedMatches,
    ),
  );
};

/**
 * Binary-searches for the lowest threshold where no subset of
 * {@link subsetSize} teams can simultaneously reach that threshold.
 */
const findTightThreshold = (
  subsetSize: number,
  naiveThreshold: number,
  allTeamIds: number[],
  teamStateById: Map<number, TeamState>,
  unresolvedMatches: UnresolvedMatch[],
): number => {
  const currentPointsSorted = allTeamIds
    .map((id) => teamStateById.get(id)?.points ?? 0)
    .sort((a, b) => b - a);
  const lowerBound = (currentPointsSorted[subsetSize - 1] ?? 0) + 1;

  let lo = lowerBound;
  let hi = naiveThreshold;

  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (
      canAnySubsetOfSizeReachThreshold(
        subsetSize,
        mid,
        allTeamIds,
        teamStateById,
        unresolvedMatches,
      )
    ) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }

  return lo;
};

/**
 * Calculates the minimum points threshold to guarantee finishing in each zone
 * (or safe from relegation) based on current standings and remaining fixtures.
 *
 * Uses a max-flow network (Dinic's algorithm) to account for the constraint
 * that head-to-head opponents cannot both win the same match. This produces
 * tighter thresholds than the naive per-team-max approach.
 *
 * For a non-relegation zone covering positions 1–E, the threshold is the
 * lowest P where no set of (E+1) teams can simultaneously reach P.
 *
 * For relegation (positions S–end), the safety threshold is the lowest P
 * where no set of S teams can simultaneously reach P.
 */
export const calculateZoneThresholds = (
  standings: TeamStanding[],
  matches: Match[],
  predictions: PredictionsStore,
  zones: ZoneDefinition[],
): ZoneThreshold[] => {
  const unresolvedMatches = getUnresolvedMatches(matches, predictions);
  const teamStateById = buildTeamState(standings, unresolvedMatches);
  const allTeamIds = standings.map((s) => s.team.id);

  const teamMaxPointsList: TeamMaxPoints[] = standings.map((standing) => {
    const state = teamStateById.get(standing.team.id)!;
    return {
      teamId: standing.team.id,
      teamName: standing.team.name,
      currentPoints: standing.points,
      remainingGames: state.remaining,
      maxAchievable: state.points + state.remaining * 3,
    };
  });

  const sorted = [...teamMaxPointsList].sort(
    (a, b) => b.maxAchievable - a.maxAchievable,
  );

  return zones.map((zone) => {
    const isRelegation = zone.type === 'relegation';
    const subsetSize = isRelegation ? zone.startPosition : zone.endPosition + 1;
    const naiveBoundaryIndex = isRelegation
      ? zone.startPosition - 1
      : zone.endPosition;
    const boundaryTeam = sorted[naiveBoundaryIndex];
    const naiveThreshold = boundaryTeam.maxAchievable + 1;

    const threshold = findTightThreshold(
      subsetSize,
      naiveThreshold,
      allTeamIds,
      teamStateById,
      unresolvedMatches,
    );

    return { zone, threshold, naiveThreshold, boundaryTeam };
  });
};

/**
 * Formats zone threshold data for console output.
 */
export const formatZoneThresholds = (
  competitionName: string,
  thresholds: ZoneThreshold[],
): string => {
  const lines: string[] = [`\n=== ${competitionName}: Zone Thresholds ===`];

  for (const { zone, threshold, naiveThreshold, boundaryTeam } of thresholds) {
    const label =
      zone.type === 'relegation'
        ? `${zone.name} safety (guaranteed to avoid ${zone.label.toLowerCase()})`
        : `${zone.name} (guaranteed ${zone.label.toLowerCase()})`;

    lines.push(`\n${zone.emoji} ${label}`);
    lines.push(`  Threshold: ${threshold} points`);
    if (naiveThreshold !== threshold) {
      lines.push(
        `  Naive threshold: ${naiveThreshold} points (ignoring head-to-head constraints)`,
      );
    }
    lines.push(
      `  Boundary team: ${boundaryTeam.teamName} ` +
        `(${boundaryTeam.currentPoints} pts + ${boundaryTeam.remainingGames} remaining = ` +
        `${boundaryTeam.maxAchievable} max)`,
    );
  }

  return lines.join('\n');
};
