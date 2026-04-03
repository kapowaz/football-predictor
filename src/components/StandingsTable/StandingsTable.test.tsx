import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ZoneDefinition } from '../../data/competitions';
import type { ZoneThreshold } from '../../utils/zoneThresholds';
import type { Team, TeamStanding } from '../../types';
import { StandingsTable } from './StandingsTable';

const makeTeam = (id: number): Team => ({
  id,
  fotmobId: id,
  name: `Team ${id}`,
  shortName: `T${id}`,
  tla: `T${id}`,
  crest: 'placeholder',
});

const makeStanding = (team: Team, points: number): TeamStanding => ({
  team,
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  goalDifference: 0,
  points,
  bonus: 0,
  deduction: 0,
  form: [],
});

const runInTestZones: ZoneDefinition[] = [
  {
    name: 'Top',
    type: 'champions',
    startPosition: 1,
    endPosition: 2,
    emoji: '🏆',
    label: 'Alpha zone',
  },
  {
    name: 'Mid',
    type: 'promotion',
    startPosition: 3,
    endPosition: 3,
    emoji: '⬆️',
    label: 'Beta zone',
  },
  {
    name: 'Rel',
    type: 'relegation',
    startPosition: 4,
    endPosition: 4,
    emoji: '⬇️',
    label: 'Relegation zone',
  },
];

const makeBoundaryTeam = (id: number) => ({
  teamId: id,
  teamName: `Team ${id}`,
  currentPoints: 30,
  remainingGames: 5,
  maxAchievable: 45,
});

const testThresholds: ZoneThreshold[] = [
  { zone: runInTestZones[0], threshold: 80, naiveThreshold: 82, boundaryTeam: makeBoundaryTeam(3) },
  { zone: runInTestZones[1], threshold: 70, naiveThreshold: 72, boundaryTeam: makeBoundaryTeam(4) },
  { zone: runInTestZones[2], threshold: 35, naiveThreshold: 37, boundaryTeam: makeBoundaryTeam(4) },
];

describe('StandingsTable run-in zone labels', () => {
  it('renders no zone threshold labels when isRunIn is false', () => {
    const teams = [1, 2, 3, 4].map(makeTeam);
    const standings = teams.map((t, i) => makeStanding(t, 40 - i));

    render(
      <StandingsTable
        standings={standings}
        zones={runInTestZones}
        zoneThresholds={testThresholds}
        isRunIn={false}
      />,
    );

    expect(screen.queryByText(/≥|≤/)).not.toBeInTheDocument();
  });

  it('renders zone threshold labels for each zone boundary when isRunIn is true', () => {
    const teams = [1, 2, 3, 4].map(makeTeam);
    const standings = teams.map((t, i) => makeStanding(t, 40 - i));

    render(
      <StandingsTable
        standings={standings}
        zones={runInTestZones}
        zoneThresholds={testThresholds}
        isRunIn
      />,
    );

    const geLabels = screen.getAllByText(/≥/i);
    expect(geLabels).toHaveLength(2);

    const leLabels = screen.getAllByText(/≤/i);
    expect(leLabels).toHaveLength(1);

    expect(screen.getByText('Champions')).toBeInTheDocument();
    expect(screen.getByText('Promotion')).toBeInTheDocument();
    expect(screen.getByText('Relegation')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
    expect(screen.getByText('70')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
  });

  it('renders no zone threshold labels when zoneThresholds is not provided', () => {
    const teams = [1, 2, 3, 4].map(makeTeam);
    const standings = teams.map((t, i) => makeStanding(t, 40 - i));

    render(
      <StandingsTable standings={standings} zones={runInTestZones} isRunIn />,
    );

    expect(screen.queryByText(/≥|≤/)).not.toBeInTheDocument();
  });
});
