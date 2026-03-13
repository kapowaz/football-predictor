import { shouldRenderGuaranteedPositionBadge } from '../src/components/StandingsTable/positionBadge';
import { describe, expect, it } from 'vitest';

describe('shouldRenderGuaranteedPositionBadge', () => {
  it('renders badge only when team is marked guaranteed', () => {
    const guaranteed = new Map<number, boolean>([
      [1, true],
      [2, false],
    ]);

    expect(shouldRenderGuaranteedPositionBadge(1, guaranteed)).toBe(true);
    expect(shouldRenderGuaranteedPositionBadge(2, guaranteed)).toBe(false);
    expect(shouldRenderGuaranteedPositionBadge(3, guaranteed)).toBe(false);
    expect(shouldRenderGuaranteedPositionBadge(1, undefined)).toBe(false);
  });
});
