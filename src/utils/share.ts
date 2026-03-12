import type { TeamStanding } from '../types';
import type { CompetitionConfig } from '../data/competitions';
import { groupStandingsByZone } from './zones';

export const generateShareText = (
  standings: TeamStanding[],
  competition: CompetitionConfig,
): string => {
  const champion = standings[0];
  const zoneGroups = groupStandingsByZone(standings, competition.zones);

  const lines = [
    `⚽ **[${competition.fullTitle}](${window.location.href})**`,
    ``,
    `🏆 Champions: ${champion?.team.name}`,
  ];

  for (const { zone, teams } of zoneGroups) {
    lines.push(`${zone.emoji} ${zone.label}: ${teams.map((s) => s.team.name).join(', ')}`);
  }

  return lines.join('\n');
};
