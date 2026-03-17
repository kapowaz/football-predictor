import type { Meta, StoryObj } from '@storybook/react-vite';
import { StandingPosition } from './StandingPosition';
import type { ZoneDefinition } from '../../data/competitions';

const premierLeagueZones: ZoneDefinition[] = [
  { name: 'Champions', type: 'champions', startPosition: 1, endPosition: 1, emoji: '🏆', label: 'Champions' },
  { name: 'Champions League', type: 'championsLeague', startPosition: 2, endPosition: 5, emoji: '🏅', label: 'Champions League' },
  { name: 'Europa League', type: 'europaLeague', startPosition: 6, endPosition: 6, emoji: '🥈', label: 'Europa League' },
  { name: 'Conference League', type: 'conferenceLeague', startPosition: 7, endPosition: 7, emoji: '🥉', label: 'Conference League' },
  { name: 'Relegation', type: 'relegation', startPosition: 18, endPosition: 20, emoji: '⬇️', label: 'Relegated' },
];

const meta = {
  title: 'Components/StandingPosition',
  component: StandingPosition,
  argTypes: {
    position: { control: { type: 'number', min: 1, max: 20 } },
  },
} satisfies Meta<typeof StandingPosition>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Champions: Story = {
  args: { position: 1, zones: premierLeagueZones },
};

export const ChampionsLeague: Story = {
  args: { position: 3, zones: premierLeagueZones },
};

export const EuropaLeague: Story = {
  args: { position: 6, zones: premierLeagueZones },
};

export const ConferenceLeague: Story = {
  args: { position: 7, zones: premierLeagueZones },
};

export const MidTable: Story = {
  args: { position: 10, zones: premierLeagueZones },
};

export const Relegation: Story = {
  args: { position: 19, zones: premierLeagueZones },
};

export const AllPositions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {Array.from({ length: 20 }, (_, i) => (
        <StandingPosition key={i + 1} position={i + 1} zones={premierLeagueZones} />
      ))}
    </div>
  ),
};
