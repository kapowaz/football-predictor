import type { ZoneDefinition, ZoneType } from '../data/competitions';
import type { Match, PredictionsStore, TeamStanding } from '../types';

export const getZoneForPosition = (
  position: number,
  zones: ZoneDefinition[],
): ZoneType | 'default' => {
  for (const zone of zones) {
    if (position >= zone.startPosition && position <= zone.endPosition) {
      return zone.type;
    }
  }
  return 'default';
};

export interface DefaultZoneExtent {
  start: number;
  end: number;
}

/**
 * Returns the first and last positions that fall outside every named zone.
 * Derives total team count from the highest `endPosition` across all zones
 * (works because the relegation zone always covers the final positions).
 */
export const getDefaultZoneExtent = (
  zones: ZoneDefinition[],
): DefaultZoneExtent | null => {
  if (zones.length === 0) return null;

  const teamCount = Math.max(...zones.map((z) => z.endPosition));
  const covered = new Set<number>();
  for (const zone of zones) {
    for (let i = zone.startPosition; i <= zone.endPosition; i++) {
      covered.add(i);
    }
  }

  let start: number | null = null;
  let end: number | null = null;
  for (let i = 1; i <= teamCount; i++) {
    if (!covered.has(i)) {
      if (start === null) start = i;
      end = i;
    }
  }

  if (start === null || end === null) return null;
  return { start, end };
};

/**
 * Returns 0–100 representing how far {@link position} sits through the
 * default (un-zoned) range, where 0 = top of the default zone and 100 = bottom.
 */
export const getDefaultZoneWeight = (
  position: number,
  zones: ZoneDefinition[],
): number => {
  const extent = getDefaultZoneExtent(zones);
  if (!extent || extent.start === extent.end) return 0;
  return ((position - extent.start) / (extent.end - extent.start)) * 100;
};

/**
 * Returns the last standing position covered by the contiguous top cluster
 * of zones (before the default/un-zoned range begins). Returns 0 if no
 * default zone exists (all positions are zoned).
 */
export const getTopZoneBoundary = (zones: ZoneDefinition[]): number => {
  const extent = getDefaultZoneExtent(zones);
  if (!extent) return 0;
  return extent.start - 1;
};

/**
 * Computes the run-in points margin based on how many unresolved matches
 * remain. Uses the maximum unresolved count across all teams so that the
 * margin narrows smoothly as the season progresses:
 *
 * - Any team has >= 2 unresolved → 6 points
 * - Every team has at most 1 unresolved → 3 points
 * - All matches resolved → 0 points
 */
export const getRunInPointsMargin = (
  matches: Match[],
  predictions: PredictionsStore,
  teamIds: number[],
): number => {
  const unresolvedPerTeam = new Map<number, number>();
  for (const teamId of teamIds) {
    unresolvedPerTeam.set(teamId, 0);
  }

  for (const match of matches) {
    if (
      match.status === 'SCHEDULED' &&
      !predictions.predictions[String(match.id)]
    ) {
      const home = unresolvedPerTeam.get(match.homeTeamId);
      if (home != null) unresolvedPerTeam.set(match.homeTeamId, home + 1);
      const away = unresolvedPerTeam.get(match.awayTeamId);
      if (away != null) unresolvedPerTeam.set(match.awayTeamId, away + 1);
    }
  }

  if (unresolvedPerTeam.size === 0) return 0;

  const maxRemaining = Math.max(...unresolvedPerTeam.values());
  if (maxRemaining >= 2) return 6;
  if (maxRemaining === 1) return 3;
  return 0;
};

export interface ZoneGroup {
  zone: ZoneDefinition;
  teams: TeamStanding[];
}

export const groupStandingsByZone = (
  standings: TeamStanding[],
  zones: ZoneDefinition[],
): ZoneGroup[] => {
  return zones.map((zone) => ({
    zone,
    teams: standings.slice(zone.startPosition - 1, zone.endPosition),
  }));
};
