import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkline } from './Sparkline';

const meta = {
  title: 'Components/Sparkline',
  component: Sparkline,
  argTypes: {
    trend: {
      control: 'select',
      options: ['positive', 'negative', 'stable'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: 32, width: 200 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Positive: Story = {
  args: {
    data: [15, 12, 10, 8, 6, 5, 4, 3],
    domain: [0, 21],
    trend: 'positive',
  },
};

export const Negative: Story = {
  args: {
    data: [3, 5, 7, 9, 12, 14, 16, 18],
    domain: [0, 21],
    trend: 'negative',
  },
};

export const Stable: Story = {
  args: {
    data: [10, 11, 10, 9, 10, 11, 10, 10],
    domain: [0, 21],
    trend: 'stable',
  },
};
