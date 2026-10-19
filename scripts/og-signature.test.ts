import { describe, expect, it } from 'vitest';

import { finishedResults } from './og-signature';

const match = (
  id: number,
  status: 'FINISHED' | 'SCHEDULED',
  homeGoals: number | null = null,
  awayGoals: number | null = null,
) => ({ id, homeTeamId: 1, awayTeamId: 2, status, homeGoals, awayGoals });

describe('finishedResults', () => {
  it('keeps finished matches only, sorted by id', () => {
    expect(
      finishedResults(
        [
          match(3, 'FINISHED', 1, 0),
          match(2, 'SCHEDULED'),
          match(1, 'FINISHED', 2, 2),
        ],
        [],
      ),
    ).toEqual([
      [1, 1, 2, 2, 2],
      [3, 1, 2, 1, 0],
    ]);
  });

  it('applies overrides before filtering', () => {
    expect(
      finishedResults(
        [match(1, 'FINISHED', 2, 2), match(2, 'SCHEDULED')],
        [match(1, 'FINISHED', 3, 0), match(2, 'FINISHED', 1, 1)],
      ),
    ).toEqual([
      [1, 1, 2, 3, 0],
      [2, 1, 2, 1, 1],
    ]);
  });

  it('ignores live-score style changes to scheduled matches', () => {
    expect(finishedResults([match(1, 'SCHEDULED', 1, 0)], [])).toEqual([]);
  });
});
