import { render, screen, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import type { Team, PredictionsStore, Match } from '../../types';
import { FixtureGroup } from './FixtureGroup';

const mockTeam: Team = {
  id: 1,
  fotmobId: 1,
  name: 'Arsenal',
  shortName: 'Arsenal',
  tla: 'ARS',
  crest: 'arsenal',
};

const emptyPredictions: PredictionsStore = { predictions: {}, lastModified: '' };

const scheduledMatch: Match = {
  id: 100,
  homeTeamId: 1,
  awayTeamId: 2,
  utcDate: '2025-04-10T15:00:00Z',
  status: 'SCHEDULED',
  homeGoals: null,
  awayGoals: null,
};

describe('FixtureGroup', () => {
  afterEach(cleanup);
  it('renders date label when no team is provided', () => {
    render(
      <FixtureGroup
        label="Monday 10 March"
        isExpanded={false}
        allPredicted={false}
        matches={[scheduledMatch]}
        predictions={emptyPredictions}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: /Monday 10 March/i })).toBeInTheDocument();
  });

  it('renders team name and crest when team is provided', () => {
    render(
      <FixtureGroup
        label="Arsenal"
        team={mockTeam}
        isExpanded={false}
        allPredicted={false}
        matches={[scheduledMatch]}
        predictions={emptyPredictions}
        onClick={vi.fn()}
      />,
    );

    const button = screen.getByRole('button', { name: /Arsenal/i });
    expect(button).toBeInTheDocument();
    expect(button.querySelector('img')).toBeInTheDocument();
  });

  it('sets aria-expanded correctly', () => {
    const { rerender } = render(
      <FixtureGroup
        label="Monday 10 March"
        isExpanded={false}
        allPredicted={false}
        matches={[scheduledMatch]}
        predictions={emptyPredictions}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');

    rerender(
      <FixtureGroup
        label="Monday 10 March"
        isExpanded={true}
        allPredicted={false}
        matches={[scheduledMatch]}
        predictions={emptyPredictions}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });
});
