import type { TeamStanding } from '../types';
import type { CompetitionConfig } from '../competitions';
import { groupStandingsByZone } from './zones';

export const generateShareText = (
  standings: TeamStanding[],
  competition: CompetitionConfig,
): string => {
  const champion = standings[0];
  const zoneGroups = groupStandingsByZone(standings, competition.zones);

  const lines = [
    `⚽ **${competition.fullTitle}**`,
    ``,
    `🏆 Champions: ${champion?.team.name}`,
  ];

  for (const { zone, teams } of zoneGroups) {
    lines.push(`${zone.emoji} ${zone.label}: ${teams.map((s) => s.team.name).join(', ')}`);
  }

  lines.push('');
  lines.push(`[Check it out](${window.location.href})`);

  return lines.join('\n');
};
