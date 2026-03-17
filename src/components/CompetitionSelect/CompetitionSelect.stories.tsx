import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { CompetitionSelect } from './CompetitionSelect';
import type { CompetitionConfig } from '../../data/competitions';
import plLogo from '../../assets/premier-league-logo.svg';
import eflChampionshipLogo from '../../assets/efl-championship-logo.svg';
import eflLeagueOneLogo from '../../assets/efl-league-one-logo.svg';

const competitions: CompetitionConfig[] = [
  { slug: 'premier-league', name: 'Premier League', fullTitle: 'Premier League 2025/26', season: '2025/26', teamCount: 20, footballDataCode: 'PL', fotmobLeagueId: 47, logo: plLogo, zones: [] },
  { slug: 'efl-championship', name: 'EFL Championship', fullTitle: 'EFL Championship 2025/26', season: '2025/26', teamCount: 24, footballDataCode: 'ELC', fotmobLeagueId: 48, logo: eflChampionshipLogo, zones: [] },
  { slug: 'efl-league-one', name: 'EFL League One', fullTitle: 'EFL League One 2025/26', season: '2025/26', teamCount: 24, footballDataCode: 'EL1', fotmobLeagueId: 108, logo: eflLeagueOneLogo, zones: [] },
];

const meta = {
  title: 'Components/CompetitionSelect',
  component: CompetitionSelect,
  args: {
    competitions,
    value: 'premier-league',
    onChange: action('onChange'),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 300 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CompetitionSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    competitions,
    value: 'premier-league',
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('premier-league');
    return (
      <CompetitionSelect
        competitions={competitions}
        value={value}
        onChange={setValue}
      />
    );
  },
};
