import { describe, expect, it } from 'vitest';

import { getStandingsImageSize } from './imageLayout';

describe('getStandingsImageSize', () => {
  it('uses the taller half and derives a 1.91:1 width', () => {
    expect(getStandingsImageSize([606, 557])).toEqual({
      width: 1157,
      height: 606,
    });
  });

  it('matches the worked example of two 582px halves', () => {
    expect(getStandingsImageSize([582, 582])).toEqual({
      width: 1112,
      height: 582,
    });
  });

  it('rounds fractional heights up so no content is clipped', () => {
    expect(getStandingsImageSize([581.2, 580])?.height).toBe(582);
  });

  it('returns null until both halves have a height', () => {
    expect(getStandingsImageSize([])).toBeNull();
    expect(getStandingsImageSize([606, 0])).toBeNull();
  });
});
