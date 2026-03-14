import type { TeamStanding } from '../types';
import type { ZoneDefinition, ZoneType } from '../data/competitions';

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
export const getDefaultZoneExtent = (zones: ZoneDefinition[]): DefaultZoneExtent | null => {
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
export const getDefaultZoneWeight = (position: number, zones: ZoneDefinition[]): number => {
  const extent = getDefaultZoneExtent(zones);
  if (!extent || extent.start === extent.end) return 0;
  return ((position - extent.start) / (extent.end - extent.start)) * 100;
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
