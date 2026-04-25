import { describe, expect, it } from 'vitest';

import type { ZoneDefinition } from '../src/data/competitions';
import type { Match, PredictionsStore, Team, TeamStanding } from '../src/types';
import {
  calculatePositionGuaranteedByTeamId,
  calculateStandingPositionOutcomeByTeamId,
  calculateZoneGuaranteedByTeamId,
} from '../src/utils/zoneGuarantees';

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
  deduction: 0,
  form: [],
});

const emptyPredictions: PredictionsStore = {
  predictions: {},
  lastModified: '',
};

describe('zone guarantees', () => {
  it('marks relegation as guaranteed when max points cannot clear safety line', () => {
  const teams = [1, 2, 3, 4].map(makeTeam);
  const standings: TeamStanding[] = [
    makeStanding(teams[0], 40),
    makeStanding(teams[1], 30),
    makeStanding(teams[2], 21),
    makeStanding(teams[3], -7),
  ];
  const matches: Match[] = [
    {
      id: 1,
      status: 'SCHEDULED',
      homeTeamId: 4,
      awayTeamId: 1,
      utcDate: '2026-01-01T12:00:00Z',
      homeGoals: null,
      awayGoals: null,
    },
    {
      id: 2,
      status: 'SCHEDULED',
      homeTeamId: 4,
      awayTeamId: 2,
      utcDate: '2026-01-02T12:00:00Z',
      homeGoals: null,
      awayGoals: null,
    },
    {
      id: 3,
      status: 'SCHEDULED',
      homeTeamId: 4,
      awayTeamId: 3,
      utcDate: '2026-01-03T12:00:00Z',
      homeGoals: null,
      awayGoals: null,
    },
  ];
  const zones: ZoneDefinition[] = [
    {
      name: 'Relegation',
      type: 'relegation',
      startPosition: 4,
      endPosition: 4,
      emoji: '⬇️',
      label: 'Relegated',
    },
  ];

  const guaranteed = calculateZoneGuaranteedByTeamId(standings, matches, emptyPredictions, zones);
  expect(guaranteed.get(4)).toBe(true);
  });

  it('marks playoff team as guaranteed at least playoffs when no challenger can catch', () => {
  const teams = [1, 2, 3, 4, 5, 6].map(makeTeam);
  const standings: TeamStanding[] = [
    makeStanding(teams[0], 70),
    makeStanding(teams[1], 63),
    makeStanding(teams[2], 62),
    makeStanding(teams[3], 58),
    makeStanding(teams[4], 58),
    makeStanding(teams[5], 20),
  ];
  const matches: Match[] = [
    {
      id: 11,
      status: 'SCHEDULED',
      homeTeamId: 3,
      awayTeamId: 2,
      utcDate: '2026-02-01T12:00:00Z',
      homeGoals: null,
      awayGoals: null,
    },
  ];
  const zones: ZoneDefinition[] = [
    {
      name: 'Promotion',
      type: 'promotion',
      startPosition: 1,
      endPosition: 2,
      emoji: '⬆️',
      label: 'Promoted',
    },
    {
      name: 'Playoffs',
      type: 'playoff',
      startPosition: 3,
      endPosition: 4,
      emoji: '🔀',
      label: 'Playoffs',
    },
  ];

  const guaranteed = calculateZoneGuaranteedByTeamId(standings, matches, emptyPredictions, zones);
  expect(guaranteed.get(3)).toBe(true);
  });

  it('respects fixture coupling when two challengers share a single match', () => {
  const teams = [1, 2, 3, 4, 5, 6, 7, 8].map(makeTeam);
  const standings: TeamStanding[] = [
    makeStanding(teams[0], 80),
    makeStanding(teams[1], 75),
    makeStanding(teams[2], 70),
    makeStanding(teams[3], 65),
    makeStanding(teams[4], 61),
    makeStanding(teams[5], 59),
    makeStanding(teams[6], 59),
    makeStanding(teams[7], 10),
  ];
  const matches: Match[] = [
    {
      id: 21,
      status: 'SCHEDULED',
      homeTeamId: 6,
      awayTeamId: 7,
      utcDate: '2026-03-01T12:00:00Z',
      homeGoals: null,
      awayGoals: null,
    },
  ];
  const zones: ZoneDefinition[] = [
    {
      name: 'Playoffs',
      type: 'playoff',
      startPosition: 3,
      endPosition: 6,
      emoji: '🔀',
      label: 'Playoffs',
    },
  ];

  const guaranteed = calculateZoneGuaranteedByTeamId(standings, matches, emptyPredictions, zones);
  expect(guaranteed.get(5)).toBe(true);
  });

  it('does not guarantee a promotion place when only point-level tie is reachable', () => {
  const teams = [1, 2, 3, 4].map(makeTeam);
  const standings: TeamStanding[] = [
    makeStanding(teams[0], 74),
    makeStanding(teams[1], 70),
    makeStanding(teams[2], 67),
    makeStanding(teams[3], 20),
  ];
  const matches: Match[] = [
    {
      id: 31,
      status: 'SCHEDULED',
      homeTeamId: 3,
      awayTeamId: 4,
      utcDate: '2026-04-01T12:00:00Z',
      homeGoals: null,
      awayGoals: null,
    },
  ];
  const zones: ZoneDefinition[] = [
    {
      name: 'Promotion',
      type: 'promotion',
      startPosition: 1,
      endPosition: 2,
      emoji: '⬆️',
      label: 'Promoted',
    },
  ];

  const guaranteed = calculateZoneGuaranteedByTeamId(standings, matches, emptyPredictions, zones);
  expect(guaranteed.get(2)).toBe(false);
  });

  it('does not guarantee a zone when a rival can still tie on points and overturn goal difference', () => {
  const teams = [1, 2, 3, 4, 5].map(makeTeam);
  const standings: TeamStanding[] = [
    makeStanding(teams[0], 75),
    makeStanding(teams[1], 70), // target team in promotion spot
    makeStanding(teams[2], 58), // rival can still reach 70
    makeStanding(teams[3], 40),
    makeStanding(teams[4], 20),
  ];
  const matches: Match[] = [
    {
      id: 61,
      status: 'SCHEDULED',
      homeTeamId: 2,
      awayTeamId: 4,
      utcDate: '2026-07-01T12:00:00Z',
      homeGoals: null,
      awayGoals: null,
    },
    {
      id: 62,
      status: 'SCHEDULED',
      homeTeamId: 2,
      awayTeamId: 5,
      utcDate: '2026-07-08T12:00:00Z',
      homeGoals: null,
      awayGoals: null,
    },
    {
      id: 63,
      status: 'SCHEDULED',
      homeTeamId: 4,
      awayTeamId: 2,
      utcDate: '2026-07-15T12:00:00Z',
      homeGoals: null,
      awayGoals: null,
    },
    {
      id: 64,
      status: 'SCHEDULED',
      homeTeamId: 5,
      awayTeamId: 2,
      utcDate: '2026-07-22T12:00:00Z',
      homeGoals: null,
      awayGoals: null,
    },
    {
      id: 65,
      status: 'SCHEDULED',
      homeTeamId: 3,
      awayTeamId: 4,
      utcDate: '2026-07-02T12:00:00Z',
      homeGoals: null,
      awayGoals: null,
    },
    {
      id: 66,
      status: 'SCHEDULED',
      homeTeamId: 3,
      awayTeamId: 5,
      utcDate: '2026-07-09T12:00:00Z',
      homeGoals: null,
      awayGoals: null,
    },
    {
      id: 67,
      status: 'SCHEDULED',
      homeTeamId: 4,
      awayTeamId: 3,
      utcDate: '2026-07-16T12:00:00Z',
      homeGoals: null,
      awayGoals: null,
    },
    {
      id: 68,
      status: 'SCHEDULED',
      homeTeamId: 5,
      awayTeamId: 3,
      utcDate: '2026-07-23T12:00:00Z',
      homeGoals: null,
      awayGoals: null,
    },
  ];
  const zones: ZoneDefinition[] = [
    {
      name: 'Promotion',
      type: 'promotion',
      startPosition: 1,
      endPosition: 2,
      emoji: '⬆️',
      label: 'Promoted',
    },
  ];

  const guaranteed = calculateZoneGuaranteedByTeamId(standings, matches, emptyPredictions, zones);
  expect(guaranteed.get(2)).toBe(false);
  });

  it('marks top-half non-zone teams that cannot reach the zone above', () => {
  const teams = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(makeTeam);
  const standings: TeamStanding[] = [
    makeStanding(teams[0], 95),
    makeStanding(teams[1], 88),
    makeStanding(teams[2], 82),
    makeStanding(teams[3], 81),
    makeStanding(teams[4], 70),
    makeStanding(teams[5], 60),
    makeStanding(teams[6], 50),
    makeStanding(teams[7], 10),
    makeStanding(teams[8], 5),
    makeStanding(teams[9], 4),
  ];
  const matches: Match[] = [
    {
      id: 41,
      status: 'SCHEDULED',
      homeTeamId: 5,
      awayTeamId: 9,
      utcDate: '2026-05-01T12:00:00Z',
      homeGoals: null,
      awayGoals: null,
    },
  ];
  const zones: ZoneDefinition[] = [
    {
      name: 'Promotion',
      type: 'promotion',
      startPosition: 1,
      endPosition: 2,
      emoji: '⬆️',
      label: 'Promoted',
    },
    {
      name: 'Playoffs',
      type: 'playoff',
      startPosition: 3,
      endPosition: 4,
      emoji: '🔀',
      label: 'Playoffs',
    },
    {
      name: 'Relegation',
      type: 'relegation',
      startPosition: 10,
      endPosition: 10,
      emoji: '⬇️',
      label: 'Relegated',
    },
  ];

  const outcomes = calculateStandingPositionOutcomeByTeamId(standings, matches, emptyPredictions, zones);
  expect(outcomes.get(5)).toBe('cannotReachZoneAbove');
  });

  it('marks bottom-half non-zone teams as safe from relegation when relegation teams cannot catch points', () => {
  const teams = [1, 2, 3, 4, 5, 6, 7, 8].map(makeTeam);
  const standings: TeamStanding[] = [
    makeStanding(teams[0], 80),
    makeStanding(teams[1], 70),
    makeStanding(teams[2], 60),
    makeStanding(teams[3], 50),
    makeStanding(teams[4], 40),
    makeStanding(teams[5], 35),
    makeStanding(teams[6], 10),
    makeStanding(teams[7], 5),
  ];
  const matches: Match[] = [
    {
      id: 51,
      status: 'SCHEDULED',
      homeTeamId: 7,
      awayTeamId: 8,
      utcDate: '2026-06-01T12:00:00Z',
      homeGoals: null,
      awayGoals: null,
    },
  ];
  const zones: ZoneDefinition[] = [
    {
      name: 'Promotion',
      type: 'promotion',
      startPosition: 1,
      endPosition: 2,
      emoji: '⬆️',
      label: 'Promoted',
    },
    {
      name: 'Relegation',
      type: 'relegation',
      startPosition: 7,
      endPosition: 8,
      emoji: '⬇️',
      label: 'Relegated',
    },
  ];

  const outcomes = calculateStandingPositionOutcomeByTeamId(standings, matches, emptyPredictions, zones);
  expect(outcomes.get(6)).toBe('safeFromRelegation');
  });
});

describe('position guarantees', () => {
  it('marks every team as position-guaranteed when no fixtures remain', () => {
    const teams = [1, 2, 3, 4].map(makeTeam);
    const standings: TeamStanding[] = [
      makeStanding(teams[0], 80),
      makeStanding(teams[1], 70),
      makeStanding(teams[2], 60),
      makeStanding(teams[3], 50),
    ];

    const result = calculatePositionGuaranteedByTeamId(
      standings,
      [],
      emptyPredictions,
    );
    expect(result.get(1)).toBe(true);
    expect(result.get(2)).toBe(true);
    expect(result.get(3)).toBe(true);
    expect(result.get(4)).toBe(true);
  });

  it('marks a team as position-guaranteed when no team can catch and none above can drop', () => {
    const teams = [1, 2, 3, 4].map(makeTeam);
    const standings: TeamStanding[] = [
      makeStanding(teams[0], 100),
      makeStanding(teams[1], 80),
      makeStanding(teams[2], 50),
      makeStanding(teams[3], 48),
    ];
    const matches: Match[] = [
      {
        id: 1,
        status: 'SCHEDULED',
        homeTeamId: 3,
        awayTeamId: 4,
        utcDate: '2026-04-01T12:00:00Z',
        homeGoals: null,
        awayGoals: null,
      },
    ];

    const result = calculatePositionGuaranteedByTeamId(
      standings,
      matches,
      emptyPredictions,
    );
    // Team 1 (100) cannot be caught — Team 2 max 80, others lower.
    expect(result.get(1)).toBe(true);
    // Team 2 (80) cannot rise (Team 1 has 100) and cannot drop (Team 3 max 53).
    expect(result.get(2)).toBe(true);
    // Team 4 could win (51) and overtake Team 3, so positions 3 and 4 may swap.
    expect(result.get(3)).toBe(false);
    expect(result.get(4)).toBe(false);
  });

  it('does not guarantee position when a team below could reach equal points', () => {
    const teams = [1, 2, 3].map(makeTeam);
    const standings: TeamStanding[] = [
      makeStanding(teams[0], 80),
      makeStanding(teams[1], 50),
      makeStanding(teams[2], 47),
    ];
    const matches: Match[] = [
      {
        id: 1,
        status: 'SCHEDULED',
        homeTeamId: 3,
        awayTeamId: 1,
        utcDate: '2026-04-01T12:00:00Z',
        homeGoals: null,
        awayGoals: null,
      },
    ];

    const result = calculatePositionGuaranteedByTeamId(
      standings,
      matches,
      emptyPredictions,
    );
    // Team 3 could reach 50 (tie with Team 2) → goal difference might shift.
    expect(result.get(2)).toBe(false);
  });

  it('does not guarantee position when a team above could drop to equal points', () => {
    const teams = [1, 2, 3].map(makeTeam);
    const standings: TeamStanding[] = [
      makeStanding(teams[0], 80),
      makeStanding(teams[1], 50),
      makeStanding(teams[2], 30),
    ];
    const matches: Match[] = [
      {
        id: 1,
        status: 'SCHEDULED',
        homeTeamId: 1,
        awayTeamId: 3,
        utcDate: '2026-04-01T12:00:00Z',
        homeGoals: null,
        awayGoals: null,
      },
    ];

    const result = calculatePositionGuaranteedByTeamId(
      standings,
      matches,
      emptyPredictions,
    );
    // Team 1 stays well clear of Team 2 (max 33 from one win can't catch 50).
    expect(result.get(1)).toBe(true);
  });

  it('locks tied teams when neither has remaining matches', () => {
    const teams = [1, 2, 3].map(makeTeam);
    const standings: TeamStanding[] = [
      makeStanding(teams[0], 60),
      makeStanding(teams[1], 60), // tied with team 1, sorted lower
      makeStanding(teams[2], 30),
    ];
    const matches: Match[] = [
      {
        id: 1,
        status: 'SCHEDULED',
        homeTeamId: 3,
        awayTeamId: 3,
        utcDate: '2026-04-01T12:00:00Z',
        homeGoals: null,
        awayGoals: null,
      },
    ];
    // Note: above match references team 3 only; teams 1 and 2 have remaining=0.

    const result = calculatePositionGuaranteedByTeamId(
      standings,
      matches,
      emptyPredictions,
    );
    // Teams 1 and 2 tied on points but both have remaining=0 → tiebreakers
    // locked, current standings sort holds.
    expect(result.get(1)).toBe(true);
    expect(result.get(2)).toBe(true);
  });
});
