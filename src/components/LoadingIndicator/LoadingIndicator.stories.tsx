import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingIndicator } from './LoadingIndicator';

const meta = {
  title: 'Components/LoadingIndicator',
  component: LoadingIndicator,
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'],
    },
    duration: { control: { type: 'number', min: 200, max: 5000, step: 100 } },
    isInverted: { control: 'boolean' },
    customColor: { control: 'color' },
  },
} satisfies Meta<typeof LoadingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'xxxl',
  },
};

export const CustomColor: Story = {
  args: {
    size: 'xl',
    customColor: '#e040fb',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'] as const).map((size) => (
        <LoadingIndicator key={size} size={size} />
      ))}
    </div>
  ),
};
