import { render, screen, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import type { Team, ScheduledMatch } from '../../types';
import type { ZoneDefinition } from '../../data/competitions';
import { FixtureCard } from './FixtureCard';

const homeTeam: Team = {
  id: 1,
  fotmobId: 1,
  name: 'Arsenal',
  shortName: 'Arsenal',
  tla: 'ARS',
  crest: 'arsenal',
};

const awayTeam: Team = {
  id: 2,
  fotmobId: 2,
  name: 'Chelsea',
  shortName: 'Chelsea',
  tla: 'CHE',
  crest: 'chelsea',
};

const match: ScheduledMatch = {
  id: 100,
  homeTeamId: 1,
  awayTeamId: 2,
  utcDate: '2025-03-15T15:00:00Z',
  status: 'SCHEDULED',
  homeGoals: null,
  awayGoals: null,
};

const zones: ZoneDefinition[] = [
  {
    name: 'Champions League',
    type: 'championsLeague',
    startPosition: 1,
    endPosition: 4,
    emoji: '🏆',
    label: 'CL',
  },
];

describe('FixtureCard', () => {
  afterEach(cleanup);
  it('shows only kickoff time when showDate is false', () => {
    render(
      <FixtureCard
        match={match}
        status="SCHEDULED"
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homePosition={1}
        awayPosition={2}
        zones={zones}
        result={null}
        onPredictionChange={vi.fn()}
        onPredictionRemove={vi.fn()}
      />,
    );

    expect(screen.getByText('15:00')).toBeInTheDocument();
    expect(screen.queryByText('15/03')).not.toBeInTheDocument();
  });

  it('shows date and kickoff time when showDate is true', () => {
    render(
      <FixtureCard
        match={match}
        status="SCHEDULED"
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homePosition={1}
        awayPosition={2}
        zones={zones}
        result={null}
        onPredictionChange={vi.fn()}
        onPredictionRemove={vi.fn()}
        showDate
      />,
    );

    const separator = screen.getByText((_content, element) => {
      return element?.tagName === 'SPAN' && element?.textContent === '15/0315:00';
    });
    expect(separator).toBeInTheDocument();
  });

  it('renders standing position badges for both teams', () => {
    render(
      <FixtureCard
        match={match}
        status="SCHEDULED"
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homePosition={1}
        awayPosition={5}
        zones={zones}
        result={null}
        onPredictionChange={vi.fn()}
        onPredictionRemove={vi.fn()}
      />,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
