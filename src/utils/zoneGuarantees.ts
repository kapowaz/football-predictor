import type { Match, PredictionsStore, TeamStanding } from '../types';
import type { ZoneDefinition } from '../data/competitions';
import { getZoneForPosition } from './zones';

export type StandingPositionOutcome =
  | 'zoneGuaranteed'
  | 'cannotReachZoneAbove'
  | 'safeFromRelegation'
  | null;

export interface UnresolvedMatch {
  homeTeamId: number;
  awayTeamId: number;
}

export interface TeamState {
  points: number;
  remaining: number;
}

interface Edge {
  to: number;
  rev: number;
  cap: number;
}

export class Dinic {
  private graph: Edge[][];
  private level: number[];
  private it: number[];

  constructor(nodeCount: number) {
    this.graph = Array.from({ length: nodeCount }, () => []);
    this.level = new Array(nodeCount).fill(-1);
    this.it = new Array(nodeCount).fill(0);
  }

  addEdge(from: number, to: number, cap: number): void {
    const forward: Edge = { to, rev: this.graph[to].length, cap };
    const backward: Edge = { to: from, rev: this.graph[from].length, cap: 0 };
    this.graph[from].push(forward);
    this.graph[to].push(backward);
  }

  private bfs(source: number, sink: number): boolean {
    this.level.fill(-1);
    const queue: number[] = [source];
    this.level[source] = 0;
    for (let i = 0; i < queue.length; i += 1) {
      const v = queue[i];
      for (const edge of this.graph[v]) {
        if (edge.cap > 0 && this.level[edge.to] < 0) {
          this.level[edge.to] = this.level[v] + 1;
          queue.push(edge.to);
        }
      }
    }
    return this.level[sink] >= 0;
  }

  private dfs(v: number, sink: number, flow: number): number {
    if (v === sink) return flow;
    for (; this.it[v] < this.graph[v].length; this.it[v] += 1) {
      const edge = this.graph[v][this.it[v]];
      if (edge.cap <= 0 || this.level[v] >= this.level[edge.to]) {
        continue;
      }
      const sent = this.dfs(edge.to, sink, Math.min(flow, edge.cap));
      if (sent <= 0) continue;
      edge.cap -= sent;
      this.graph[edge.to][edge.rev].cap += sent;
      return sent;
    }
    return 0;
  }

  maxFlow(source: number, sink: number): number {
    let total = 0;
    while (this.bfs(source, sink)) {
      this.it.fill(0);
      while (true) {
        const sent = this.dfs(source, sink, Number.MAX_SAFE_INTEGER);
        if (sent <= 0) break;
        total += sent;
      }
    }
    return total;
  }
}

const getCurrentZoneDefinition = (
  position: number,
  zones: ZoneDefinition[],
): ZoneDefinition | null => {
  for (const zone of zones) {
    if (position >= zone.startPosition && position <= zone.endPosition) {
      return zone;
    }
  }
  return null;
};

const getNearestZoneAbove = (position: number, zones: ZoneDefinition[]): ZoneDefinition | null => {
  let nearest: ZoneDefinition | null = null;
  for (const zone of zones) {
    if (zone.endPosition < position && (!nearest || zone.endPosition > nearest.endPosition)) {
      nearest = zone;
    }
  }
  return nearest;
};

const getRelegationZone = (zones: ZoneDefinition[]): ZoneDefinition | null => {
  for (const zone of zones) {
    if (zone.type === 'relegation') return zone;
  }
  return null;
};

export const buildTeamState = (
  standings: TeamStanding[],
  unresolvedMatches: UnresolvedMatch[],
): Map<number, TeamState> => {
  const state = new Map<number, TeamState>();
  for (const standing of standings) {
    state.set(standing.team.id, { points: standing.points, remaining: 0 });
  }
  for (const match of unresolvedMatches) {
    state.get(match.homeTeamId)!.remaining += 1;
    state.get(match.awayTeamId)!.remaining += 1;
  }
  return state;
};

export const getUnresolvedMatches = (matches: Match[], predictions: PredictionsStore): UnresolvedMatch[] => {
  return matches
    .filter((match) => match.status === 'SCHEDULED' && !predictions.predictions[String(match.id)])
    .map((match) => ({ homeTeamId: match.homeTeamId, awayTeamId: match.awayTeamId }));
};

export const combinationSearch = (
  candidateTeamIds: number[],
  pickCount: number,
  canSubsetReachThreshold: (teamIds: number[]) => boolean,
): boolean => {
  if (pickCount <= 0) return true;
  if (candidateTeamIds.length < pickCount) return false;

  const chosen: number[] = [];
  const dfs = (index: number): boolean => {
    if (chosen.length === pickCount) {
      return canSubsetReachThreshold(chosen);
    }
    if (index >= candidateTeamIds.length) return false;
    if (chosen.length + (candidateTeamIds.length - index) < pickCount) return false;

    for (let i = index; i < candidateTeamIds.length; i += 1) {
      chosen.push(candidateTeamIds[i]);
      if (dfs(i + 1)) return true;
      chosen.pop();
    }
    return false;
  };

  return dfs(0);
};

const canAllTeamsReachThreshold = (
  selectedTeamIds: number[],
  threshold: number,
  targetTeamId: number,
  teamStateById: Map<number, TeamState>,
  unresolvedMatches: UnresolvedMatch[],
): boolean => {
  let totalDemand = 0;
  const demandByTeamId = new Map<number, number>();
  const boostedDemandByTeamId = new Map<number, number>();

  for (const teamId of selectedTeamIds) {
    const state = teamStateById.get(teamId);
    if (!state) return false;

    let boostedPoints = state.points;
    for (const match of unresolvedMatches) {
      if (match.homeTeamId === targetTeamId && match.awayTeamId === teamId) boostedPoints += 3;
      if (match.awayTeamId === targetTeamId && match.homeTeamId === teamId) boostedPoints += 3;
    }

    const demand = Math.max(0, threshold - boostedPoints);
    demandByTeamId.set(teamId, demand);
    boostedDemandByTeamId.set(teamId, boostedPoints);
    totalDemand += demand;
  }

  if (totalDemand === 0) return true;

  const selectedTeamIdSet = new Set(selectedTeamIds);
  const relevantMatches = unresolvedMatches.filter((match) => {
    if (match.homeTeamId === targetTeamId || match.awayTeamId === targetTeamId) {
      return false;
    }
    return selectedTeamIdSet.has(match.homeTeamId) || selectedTeamIdSet.has(match.awayTeamId);
  });

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
    if (homeNode != null) {
      flow.addEdge(matchNode, homeNode, 3);
    }
    const awayNode = teamNodeById.get(match.awayTeamId);
    if (awayNode != null) {
      flow.addEdge(matchNode, awayNode, 3);
    }
  });

  selectedTeamIds.forEach((teamId) => {
    const node = teamNodeById.get(teamId)!;
    const demand = demandByTeamId.get(teamId) ?? 0;
    flow.addEdge(node, sink, demand);
  });

  const achieved = flow.maxFlow(source, sink);
  if (achieved !== totalDemand) return false;

  // Stage B (ORDER-aware tie handling): if a selected team cannot exceed threshold
  // by points, treat the tie as potentially hostile and keep the candidate valid.
  // This remains conservative while still accounting for point-equality boundaries.
  for (const teamId of selectedTeamIds) {
    const boostedPoints = boostedDemandByTeamId.get(teamId) ?? 0;
    const canExceedThresholdByPoints = boostedPoints + 3 > threshold;
    if (!canExceedThresholdByPoints) {
      continue;
    }
  }

  return true;
};

const canTeamFinishBelowZone = (
  targetTeamId: number,
  zoneEndPosition: number,
  standings: TeamStanding[],
  teamStateById: Map<number, TeamState>,
  unresolvedMatches: UnresolvedMatch[],
): boolean => {
  const targetState = teamStateById.get(targetTeamId);
  if (!targetState) return false;

  const threshold = targetState.points;
  const standingsIndexByTeamId = new Map<number, number>();
  standings.forEach((standing, index) => {
    standingsIndexByTeamId.set(standing.team.id, index);
  });
  const isAlreadyAtOrAboveThreshold = (candidateTeamId: number): boolean => {
    const candidateState = teamStateById.get(candidateTeamId);
    if (!candidateState) return false;

    if (candidateState.points > threshold) return true;
    if (candidateState.points < threshold) return false;

    // Equal-points scenarios are treated as unsafe while either side still has games:
    // goal difference/goals scored/head-to-head can still move before the season is resolved.
    if (candidateState.remaining > 0 || targetState.remaining > 0) return true;

    // With no games left for both, ordering is fixed on current tiebreakers.
    const candidateIndex = standingsIndexByTeamId.get(candidateTeamId) ?? Number.MAX_SAFE_INTEGER;
    const targetIndex = standingsIndexByTeamId.get(targetTeamId) ?? Number.MAX_SAFE_INTEGER;
    return candidateIndex < targetIndex;
  };
  const canReachThreshold = (candidateTeamId: number): boolean => {
    if (isAlreadyAtOrAboveThreshold(candidateTeamId)) return true;

    const candidateState = teamStateById.get(candidateTeamId);
    if (!candidateState) return false;
    const candidateMaxPoints = candidateState.points + candidateState.remaining * 3;
    if (candidateMaxPoints > threshold) return true;
    if (candidateMaxPoints < threshold) return false;

    // Reaching only a points tie can still be enough while unresolved matches remain.
    return candidateState.remaining > 0 || targetState.remaining > 0;
  };

  const otherTeamIds = standings.map((standing) => standing.team.id).filter((id) => id !== targetTeamId);
  const guaranteedThresholdTeamIds = otherTeamIds.filter((teamId) => {
    return isAlreadyAtOrAboveThreshold(teamId);
  });
  if (guaranteedThresholdTeamIds.length >= zoneEndPosition) {
    return true;
  }

  const remainingNeeded = zoneEndPosition - guaranteedThresholdTeamIds.length;
  const candidateIds = otherTeamIds.filter((teamId) => {
    if (guaranteedThresholdTeamIds.includes(teamId)) return false;
    return canReachThreshold(teamId);
  });
  if (candidateIds.length < remainingNeeded) return false;

  return combinationSearch(candidateIds, remainingNeeded, (selectedIds) =>
    canAllTeamsReachThreshold(
      [...guaranteedThresholdTeamIds, ...selectedIds],
      threshold,
      targetTeamId,
      teamStateById,
      unresolvedMatches,
    ),
  );
};

const isGuaranteedRelegated = (
  targetTeamId: number,
  zoneStartPosition: number,
  standings: TeamStanding[],
  teamStateById: Map<number, TeamState>,
): boolean => {
  const state = teamStateById.get(targetTeamId);
  if (!state) return false;
  const targetMaxPoints = state.points + state.remaining * 3;
  const strictlyAbove = standings
    .map((standing) => standing.team.id)
    .filter((id) => id !== targetTeamId)
    .filter((id) => (teamStateById.get(id)?.points ?? 0) > targetMaxPoints).length;

  return strictlyAbove >= zoneStartPosition - 1;
};

const cannotReachZoneAbove = (
  targetTeamId: number,
  targetZoneEndPosition: number,
  standings: TeamStanding[],
  teamStateById: Map<number, TeamState>,
): boolean => {
  const targetState = teamStateById.get(targetTeamId);
  if (!targetState) return false;

  const targetMaxPoints = targetState.points + targetState.remaining * 3;
  const guaranteedAbove = standings
    .map((standing) => standing.team.id)
    .filter((id) => id !== targetTeamId)
    .filter((id) => (teamStateById.get(id)?.points ?? 0) > targetMaxPoints).length;

  return guaranteedAbove >= targetZoneEndPosition;
};

const isSafeFromRelegation = (
  targetTeamId: number,
  standings: TeamStanding[],
  teamStateById: Map<number, TeamState>,
  relegationZone: ZoneDefinition,
): boolean => {
  const targetState = teamStateById.get(targetTeamId);
  if (!targetState) return false;

  const relegationTeamIds = standings
    .slice(relegationZone.startPosition - 1, relegationZone.endPosition)
    .map((standing) => standing.team.id);

  return relegationTeamIds.every((relegationTeamId) => {
    if (relegationTeamId === targetTeamId) return false;
    const relegationState = teamStateById.get(relegationTeamId);
    if (!relegationState) return false;
    const relegationMax = relegationState.points + relegationState.remaining * 3;
    return targetState.points > relegationMax;
  });
};

const getOutcomeForDefaultZoneTeam = (
  targetTeamId: number,
  position: number,
  standings: TeamStanding[],
  zones: ZoneDefinition[],
  teamStateById: Map<number, TeamState>,
): StandingPositionOutcome => {
  const midpoint = Math.floor(standings.length / 2);

  if (position <= midpoint) {
    const zoneAbove = getNearestZoneAbove(position, zones);
    if (!zoneAbove) return null;
    return cannotReachZoneAbove(targetTeamId, zoneAbove.endPosition, standings, teamStateById)
      ? 'cannotReachZoneAbove'
      : null;
  }

  const relegationZone = getRelegationZone(zones);
  if (!relegationZone) return null;
  if (position >= relegationZone.startPosition) return null;

  return isSafeFromRelegation(targetTeamId, standings, teamStateById, relegationZone)
    ? 'safeFromRelegation'
    : null;
};

export const calculateStandingPositionOutcomeByTeamId = (
  standings: TeamStanding[],
  matches: Match[],
  predictions: PredictionsStore,
  zones: ZoneDefinition[],
): Map<number, StandingPositionOutcome> => {
  const unresolvedMatches = getUnresolvedMatches(matches, predictions);
  const teamStateById = buildTeamState(standings, unresolvedMatches);
  const outcomeByTeamId = new Map<number, StandingPositionOutcome>();
  const allResolved = unresolvedMatches.length === 0;

  if (allResolved) {
    const midpoint = Math.floor(standings.length / 2);
    for (let index = 0; index < standings.length; index += 1) {
      const standing = standings[index];
      const position = index + 1;
      const zoneType = getZoneForPosition(position, zones);
      if (zoneType !== 'default') {
        outcomeByTeamId.set(standing.team.id, 'zoneGuaranteed');
      } else if (position <= midpoint) {
        outcomeByTeamId.set(standing.team.id, 'cannotReachZoneAbove');
      } else {
        outcomeByTeamId.set(standing.team.id, 'safeFromRelegation');
      }
    }
    return outcomeByTeamId;
  }

  for (let index = 0; index < standings.length; index += 1) {
    const standing = standings[index];
    const position = index + 1;
    const zoneType = getZoneForPosition(position, zones);
    if (zoneType === 'default') {
      outcomeByTeamId.set(
        standing.team.id,
        getOutcomeForDefaultZoneTeam(standing.team.id, position, standings, zones, teamStateById),
      );
      continue;
    }

    const zone = getCurrentZoneDefinition(position, zones);
    if (!zone) {
      outcomeByTeamId.set(standing.team.id, null);
      continue;
    }

    if (zone.type === 'relegation') {
      outcomeByTeamId.set(
        standing.team.id,
        isGuaranteedRelegated(standing.team.id, zone.startPosition, standings, teamStateById)
          ? 'zoneGuaranteed'
          : null,
      );
      continue;
    }

    const canDropBelow = canTeamFinishBelowZone(
      standing.team.id,
      zone.endPosition,
      standings,
      teamStateById,
      unresolvedMatches,
    );
    outcomeByTeamId.set(standing.team.id, canDropBelow ? null : 'zoneGuaranteed');
  }

  return outcomeByTeamId;
};

export const calculateZoneGuaranteedByTeamId = (
  standings: TeamStanding[],
  matches: Match[],
  predictions: PredictionsStore,
  zones: ZoneDefinition[],
): Map<number, boolean> => {
  const outcomeByTeamId = calculateStandingPositionOutcomeByTeamId(
    standings,
    matches,
    predictions,
    zones,
  );
  const guaranteedByTeamId = new Map<number, boolean>();

  for (const standing of standings) {
    guaranteedByTeamId.set(standing.team.id, outcomeByTeamId.get(standing.team.id) != null);
  }

  return guaranteedByTeamId;
};
