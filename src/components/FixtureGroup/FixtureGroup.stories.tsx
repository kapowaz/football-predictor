import type { Meta, StoryObj } from '@storybook/react-vite';
import { FixtureGroup } from './FixtureGroup';
import type { Match, PredictionsStore } from '../../types';

const matches: Match[] = [
  { id: 1, homeTeamId: 1, awayTeamId: 2, utcDate: '2026-03-21T15:00:00Z', status: 'FINISHED', homeGoals: 2, awayGoals: 1 },
  { id: 2, homeTeamId: 3, awayTeamId: 4, utcDate: '2026-03-21T17:30:00Z', status: 'SCHEDULED', homeGoals: null, awayGoals: null },
  { id: 3, homeTeamId: 5, awayTeamId: 6, utcDate: '2026-03-21T20:00:00Z', status: 'SCHEDULED', homeGoals: null, awayGoals: null },
];

const predictions: PredictionsStore = {
  predictions: { '2': { homeGoals: 1, awayGoals: 0 } },
  lastModified: '2026-03-17T00:00:00Z',
};

const meta = {
  title: 'Components/FixtureGroup',
  component: FixtureGroup,
  argTypes: {
    isExpanded: { control: 'boolean' },
    allPredicted: { control: 'boolean' },
  },
} satisfies Meta<typeof FixtureGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {
  args: {
    label: 'Saturday 21 March',
    isExpanded: false,
    allPredicted: false,
    matches,
    predictions,
    onClick: () => {},
  },
};

export const Expanded: Story = {
  args: {
    label: 'Saturday 21 March',
    isExpanded: true,
    allPredicted: false,
    matches,
    predictions,
    onClick: () => {},
  },
};

export const AllPredicted: Story = {
  args: {
    label: 'Saturday 21 March',
    isExpanded: false,
    allPredicted: true,
    matches,
    predictions: {
      predictions: {
        '1': { homeGoals: 2, awayGoals: 1 },
        '2': { homeGoals: 1, awayGoals: 0 },
        '3': { homeGoals: 0, awayGoals: 2 },
      },
      lastModified: '2026-03-17T00:00:00Z',
    },
    onClick: () => {},
  },
};
