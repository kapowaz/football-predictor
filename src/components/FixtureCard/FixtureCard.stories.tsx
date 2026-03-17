import type { Meta, StoryObj } from '@storybook/react-vite';
import { FixtureCard } from './FixtureCard';
import type { ZoneDefinition } from '../../data/competitions';

const zones: ZoneDefinition[] = [
  { name: 'Promotion', type: 'promotion', startPosition: 1, endPosition: 2, emoji: '⬆️', label: 'Promoted' },
  { name: 'Playoffs', type: 'playoff', startPosition: 3, endPosition: 6, emoji: '🔀', label: 'Playoffs' },
  { name: 'Relegation', type: 'relegation', startPosition: 22, endPosition: 24, emoji: '⬇️', label: 'Relegated' },
];

const homeTeam = { id: 1, fotmobId: 100, name: 'Arsenal', shortName: 'Arsenal', tla: 'ARS', crest: 'arsenal' };
const awayTeam = { id: 2, fotmobId: 200, name: 'Chelsea', shortName: 'Chelsea', tla: 'CHE', crest: 'chelsea' };

const meta = {
  title: 'Components/FixtureCard',
  component: FixtureCard,
} satisfies Meta<typeof FixtureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scheduled: Story = {
  args: {
    match: { id: 1, homeTeamId: 1, awayTeamId: 2, utcDate: '2026-03-21T15:00:00Z', status: 'SCHEDULED', homeGoals: null, awayGoals: null },
    status: 'SCHEDULED',
    homeTeam,
    awayTeam,
    homePosition: 3,
    awayPosition: 8,
    zones,
    result: null,
    onPredictionChange: () => {},
    onPredictionRemove: () => {},
  },
};

export const WithPrediction: Story = {
  args: {
    match: { id: 2, homeTeamId: 1, awayTeamId: 2, utcDate: '2026-03-21T15:00:00Z', status: 'SCHEDULED', homeGoals: null, awayGoals: null },
    status: 'SCHEDULED',
    homeTeam,
    awayTeam,
    homePosition: 1,
    awayPosition: 5,
    zones,
    result: { homeGoals: 2, awayGoals: 1 },
    onPredictionChange: () => {},
    onPredictionRemove: () => {},
  },
};

export const Finished: Story = {
  args: {
    match: { id: 3, homeTeamId: 1, awayTeamId: 2, utcDate: '2026-03-14T15:00:00Z', status: 'FINISHED', homeGoals: 3, awayGoals: 0 },
    status: 'FINISHED',
    homeTeam,
    awayTeam,
    homePosition: 2,
    awayPosition: 18,
    zones,
    result: { homeGoals: 3, awayGoals: 0 },
  },
};
