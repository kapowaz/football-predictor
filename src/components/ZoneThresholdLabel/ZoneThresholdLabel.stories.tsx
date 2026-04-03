import type { Meta, StoryObj } from '@storybook/react-vite';
import { ZoneThresholdLabel } from './ZoneThresholdLabel';

const meta = {
  title: 'Components/ZoneThresholdLabel',
  component: ZoneThresholdLabel,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    zone: {
      control: 'select',
      options: [
        'champions',
        'promotion',
        'playoff',
        'championsLeague',
        'europaLeague',
        'conferenceLeague',
        'relegation',
      ],
    },
    threshold: { control: { type: 'number', min: 0, max: 120 } },
    label: { control: 'text' },
  },
} satisfies Meta<typeof ZoneThresholdLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Champions: Story = {
  args: { zone: 'champions', label: 'Champions', threshold: 89 },
};

export const Promotion: Story = {
  args: { zone: 'promotion', label: 'Promotion', threshold: 82 },
};

export const Playoff: Story = {
  args: { zone: 'playoff', label: 'Playoffs', threshold: 71 },
};

export const ChampionsLeague: Story = {
  args: { zone: 'championsLeague', label: 'Champions League', threshold: 74 },
};

export const EuropaLeague: Story = {
  args: { zone: 'europaLeague', label: 'Europa League', threshold: 65 },
};

export const ConferenceLeague: Story = {
  args: { zone: 'conferenceLeague', label: 'Conference League', threshold: 61 },
};

export const Relegation: Story = {
  args: { zone: 'relegation', label: 'Relegation', threshold: 35 },
};

export const AllZones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
      <ZoneThresholdLabel zone="champions" label="Champions" threshold={89} />
      <ZoneThresholdLabel zone="championsLeague" label="Champions League" threshold={74} />
      <ZoneThresholdLabel zone="europaLeague" label="Europa League" threshold={65} />
      <ZoneThresholdLabel zone="conferenceLeague" label="Conference League" threshold={61} />
      <ZoneThresholdLabel zone="promotion" label="Promotion" threshold={82} />
      <ZoneThresholdLabel zone="playoff" label="Playoffs" threshold={71} />
      <ZoneThresholdLabel zone="relegation" label="Relegation" threshold={35} />
    </div>
  ),
};
