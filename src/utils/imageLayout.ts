/**
 * Width-to-height ratio of each standings image half. Facebook, LinkedIn and
 * X crop large link previews to 1.91:1, so a half at this ratio loses no rows.
 */
export const STANDINGS_IMAGE_ASPECT_RATIO = 1.91;

export interface StandingsImageSize {
  /** Width in CSS pixels. */
  width: number;
  /** Height in CSS pixels. */
  height: number;
}

/**
 * Size shared by both halves of a standings image: the taller half's height
 * (the shorter half is padded at the bottom), and the width that gives
 * `STANDINGS_IMAGE_ASPECT_RATIO`. Returns null until both heights are known.
 */
export const getStandingsImageSize = (
  heights: number[],
): StandingsImageSize | null => {
  if (heights.length === 0 || heights.some((h) => !(h > 0))) return null;
  const height = Math.ceil(Math.max(...heights));
  return {
    width: Math.round(height * STANDINGS_IMAGE_ASPECT_RATIO),
    height,
  };
};
