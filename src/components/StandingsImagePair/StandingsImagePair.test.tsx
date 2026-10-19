import { render, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { TeamStanding } from '../../types';
import { StandingsImagePair } from './StandingsImagePair';

const team = (id: number, name: string): TeamStanding => ({
  team: {
    id,
    fotmobId: id,
    name,
    shortName: name,
    tla: name.slice(0, 3).toUpperCase(),
    badge: name.toLowerCase(),
  },
  played: 1,
  won: 1,
  bonus: 0,
  drawn: 0,
  lost: 0,
  goalsFor: 1,
  goalsAgainst: 0,
  goalDifference: 1,
  points: 3,
  deduction: 0,
  form: [],
});

const standings = ['Alpha', 'Beta', 'Gamma'].map((name, i) =>
  team(i + 1, name),
);

const renderPair = (onLayout = vi.fn()) => {
  const refs = [createRef<HTMLDivElement>(), createRef<HTMLDivElement>()] as [
    ReturnType<typeof createRef<HTMLDivElement>>,
    ReturnType<typeof createRef<HTMLDivElement>>,
  ];
  const view = render(
    <StandingsImagePair
      standings={standings}
      competitionLogo="logo.svg"
      competitionName="Test League"
      competitionSeason="2026/27"
      deductionNotes={[]}
      deductionMarkers={new Map()}
      zones={[]}
      captureRefs={refs}
      onLayout={onLayout}
    />,
  );
  return { ...view, refs, onLayout };
};

describe('StandingsImagePair', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders a top and a bottom half on the given capture refs', () => {
    const { container, refs } = renderPair();
    const halves = container.querySelectorAll('[data-image-half]');
    expect([...halves].map((h) => h.getAttribute('data-image-half'))).toEqual([
      'top',
      'bottom',
    ]);
    expect(refs[0].current).not.toBeNull();
    expect(refs[1].current).not.toBeNull();
  });

  it('sizes both halves to the taller one at 1.91:1', async () => {
    // jsdom has no layout, so give the top half 606px and the bottom 557px.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        const half =
          this.closest('[data-image-half]')?.getAttribute('data-image-half');
        return { height: half === 'top' ? 606 : 557 } as DOMRect;
      },
    );
    const { container, onLayout } = renderPair();

    await waitFor(() =>
      expect(onLayout).toHaveBeenCalledWith({ width: 1157, height: 606 }),
    );
    const halves = container.querySelectorAll('[data-layout-ready="true"]');
    expect(halves).toHaveLength(2);
  });

  it('stays unsized while the halves have no height', () => {
    const { container, onLayout } = renderPair();
    expect(container.querySelector('[data-layout-ready]')).toBeNull();
    expect(onLayout).not.toHaveBeenCalled();
  });
});
