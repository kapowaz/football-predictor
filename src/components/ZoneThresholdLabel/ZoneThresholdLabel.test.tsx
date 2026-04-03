import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ZoneThresholdLabel } from './ZoneThresholdLabel';
import type { ZoneType } from '../../data/competitions';

const normalise = (text: string | null | undefined) =>
  text?.replace(/\s+/g, ' ').trim() ?? '';

describe('ZoneThresholdLabel', () => {
  it('renders the label and threshold with ≥ for non-relegation zones', () => {
    const { container } = render(
      <ZoneThresholdLabel zone="champions" label="Champions" threshold={85} />,
    );

    expect(normalise(container.textContent)).toMatch(/Champions\s*:\s*≥\s*85 pts/);
  });

  it('renders ≤ instead of ≥ for relegation zones', () => {
    const { container } = render(
      <ZoneThresholdLabel zone="relegation" label="Relegation" threshold={30} />,
    );

    expect(normalise(container.textContent)).toMatch(/Relegation\s*:\s*≤\s*30 pts/);
  });

  it('renders correctly for each non-relegation zone type', () => {
    const nonRelegationZones: { zone: ZoneType; label: string; threshold: number }[] = [
      { zone: 'champions', label: 'Champions', threshold: 90 },
      { zone: 'promotion', label: 'Promotion', threshold: 80 },
      { zone: 'playoff', label: 'Playoffs', threshold: 70 },
      { zone: 'championsLeague', label: 'Champions League', threshold: 75 },
      { zone: 'europaLeague', label: 'Europa League', threshold: 65 },
      { zone: 'conferenceLeague', label: 'Conference League', threshold: 60 },
    ];

    for (const { zone, label, threshold } of nonRelegationZones) {
      const { container, unmount } = render(
        <ZoneThresholdLabel zone={zone} label={label} threshold={threshold} />,
      );
      const pattern = new RegExp(`${label}\\s*:\\s*≥\\s*${threshold} pts`);
      expect(normalise(container.textContent)).toMatch(pattern);
      unmount();
    }
  });

  it('renders as a span element', () => {
    const { container } = render(
      <ZoneThresholdLabel zone="promotion" label="Promotion" threshold={75} />,
    );

    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
  });
});
