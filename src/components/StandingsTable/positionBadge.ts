export const shouldRenderGuaranteedPositionBadge = (
  teamId: number,
  zoneGuaranteedByTeamId?: Map<number, boolean>,
): boolean => {
  return zoneGuaranteedByTeamId?.get(teamId) ?? false;
};
