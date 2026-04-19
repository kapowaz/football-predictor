import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { RankedClub, ScoringWeights } from '../../data/all-time-rank/types';
import { DEFAULT_WEIGHTS } from '../../utils/allTimeRank';
import { AllTimeRankTable } from './AllTimeRankTable';

const emptyTieredHonours = { tier1: [], tier2: [], tier3: [], tier4: [] };

const makeRankedClub = (overrides: Partial<RankedClub> = {}): RankedClub => ({
  club: {
    name: 'Test FC',
    shortName: 'Test',
    badge: 'test',
    founded: 1900,
    currentTier: 1,
    leagueRecord: { tier1: {}, tier2: {}, tier3: {}, tier4: {} },
    honours: {
      leagueTitles: { ...emptyTieredHonours },
      leagueRunnersUp: { ...emptyTieredHonours },
      playoffWinners: { ...emptyTieredHonours },
      faCupWinners: [],
      faCupRunnersUp: [],
      leagueCupWinners: [],
      leagueCupRunnersUp: [],
    },
    europeanHonours: {
      championsLeagueWinners: [],
      championsLeagueRunnersUp: [],
      europaLeagueWinners: [],
      europaLeagueRunnersUp: [],
      conferenceLeagueWinners: [],
      conferenceLeagueRunnersUp: [],
    },
    averageAttendance: 30000,
  },
  rank: 1,
  totalScore: 500,
  leagueScore: 300,
  domesticScore: 100,
  europeanScore: 50,
  attendanceScore: 50,
  ...overrides,
});

const weights: ScoringWeights = DEFAULT_WEIGHTS;

describe('AllTimeRankTable', () => {
  it('renders a table with header row', () => {
    render(<AllTimeRankTable rankedClubs={[]} weights={weights} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /team/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /score/i })).toBeInTheDocument();
  });

  it('renders a row for each ranked club', () => {
    const clubs = [
      makeRankedClub({ rank: 1, club: { ...makeRankedClub().club, name: 'Liverpool' } }),
      makeRankedClub({ rank: 2, club: { ...makeRankedClub().club, name: 'Arsenal' } }),
    ];

    render(<AllTimeRankTable rankedClubs={clubs} weights={weights} />);

    expect(screen.getByText('Liverpool')).toBeInTheDocument();
    expect(screen.getByText('Arsenal')).toBeInTheDocument();
  });

  it('displays the total score formatted to one decimal place', () => {
    const club = makeRankedClub({ totalScore: 1234.567 });

    render(<AllTimeRankTable rankedClubs={[club]} weights={weights} />);

    expect(screen.getByText('1,234.6')).toBeInTheDocument();
  });

  it('displays trophy counts as raw numbers', () => {
    const club = makeRankedClub({
      club: {
        ...makeRankedClub().club,
        honours: {
          leagueTitles: { tier1: [1990, 2000, 2010], tier2: [], tier3: [], tier4: [] },
          leagueRunnersUp: { ...emptyTieredHonours },
          playoffWinners: { ...emptyTieredHonours },
          faCupWinners: [1995, 2005],
          faCupRunnersUp: [],
          leagueCupWinners: [2015],
          leagueCupRunnersUp: [],
        },
        europeanHonours: {
          championsLeagueWinners: [2005],
          championsLeagueRunnersUp: [],
          europaLeagueWinners: [],
          europaLeagueRunnersUp: [],
          conferenceLeagueWinners: [],
          conferenceLeagueRunnersUp: [],
        },
      },
    });

    render(<AllTimeRankTable rankedClubs={[club]} weights={weights} />);

    const threes = screen.getAllByText('3');
    expect(threes.length).toBeGreaterThanOrEqual(1);

    const twos = screen.getAllByText('2');
    expect(twos.length).toBeGreaterThanOrEqual(1);

    const ones = screen.getAllByText('1');
    expect(ones.length).toBeGreaterThanOrEqual(1);
  });

  it('shows dash for zero trophy counts', () => {
    const club = makeRankedClub();

    render(<AllTimeRankTable rankedClubs={[club]} weights={weights} />);

    const dashes = screen.getAllByText('-');
    expect(dashes.length).toBeGreaterThanOrEqual(6);
  });

  it('formats attendance in thousands', () => {
    const club = makeRankedClub({
      club: { ...makeRankedClub().club, averageAttendance: 47200 },
    });

    render(<AllTimeRankTable rankedClubs={[club]} weights={weights} />);

    expect(screen.getByText('47.2k')).toBeInTheDocument();
  });
});
