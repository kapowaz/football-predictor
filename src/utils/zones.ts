import type { TeamStanding } from '../types';
import type { ZoneDefinition, ZoneType } from '../competitions';

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
