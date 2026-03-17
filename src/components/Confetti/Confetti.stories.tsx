import type { Meta, StoryObj } from '@storybook/react-vite';
import { Confetti } from './Confetti';

const meta = {
  title: 'Components/Confetti',
  component: Confetti,
  argTypes: {
    isLooping: { control: 'boolean' },
    particleDensity: { control: { type: 'number', min: 1, max: 50 } },
    gravity: { control: { type: 'number', min: 0.1, max: 5, step: 0.1 } },
    fadeThreshold: { control: { type: 'number', min: 0, max: 1, step: 0.1 } },
    size: { control: { type: 'number', min: 1, max: 20 } },
  },
} satisfies Meta<typeof Confetti>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isLooping: true,
    particleDensity: 10,
  },
};

export const Dense: Story = {
  args: {
    isLooping: true,
    particleDensity: 30,
    size: 8,
  },
};

export const SlowFall: Story = {
  args: {
    isLooping: true,
    particleDensity: 10,
    gravity: 0.3,
  },
};
