import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TeamSelect } from './TeamSelect';
import type { Team } from '../../types';

const teams: Team[] = [
  { id: 1, fotmobId: 100, name: 'Arsenal', shortName: 'Arsenal', tla: 'ARS', crest: 'arsenal' },
  { id: 2, fotmobId: 200, name: 'Chelsea', shortName: 'Chelsea', tla: 'CHE', crest: 'chelsea' },
  { id: 3, fotmobId: 300, name: 'Liverpool', shortName: 'Liverpool', tla: 'LIV', crest: 'liverpool' },
  { id: 4, fotmobId: 400, name: 'Manchester City', shortName: 'Man City', tla: 'MCI', crest: 'manchester-city' },
  { id: 5, fotmobId: 500, name: 'Manchester United', shortName: 'Man United', tla: 'MUN', crest: 'manchester-united' },
  { id: 6, fotmobId: 600, name: 'Tottenham Hotspur', shortName: 'Spurs', tla: 'TOT', crest: 'tottenham-hotspur' },
];

const meta = {
  title: 'Components/TeamSelect',
  component: TeamSelect,
  argTypes: {
    menuPlacement: {
      control: 'select',
      options: ['auto', 'bottom', 'top'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 300 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TeamSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    teams,
    value: '',
  },
};

export const WithSelection: Story = {
  args: {
    teams,
    value: 3,
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState<number | ''>('');
    return <TeamSelect teams={teams} value={value} onChange={setValue} />;
  },
};
