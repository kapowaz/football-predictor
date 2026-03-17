import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { ColorModeToggle } from './ColorModeToggle';

const meta = {
  title: 'Components/ColorModeToggle',
  component: ColorModeToggle,
  args: {
    colorMode: 'light',
    onColorModeToggle: action('onColorModeToggle'),
  },
  argTypes: {
    colorMode: {
      control: 'inline-radio',
      options: ['light', 'dark'],
    },
  },
} satisfies Meta<typeof ColorModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: {
    colorMode: 'light',
  },
};

export const Dark: Story = {
  args: {
    colorMode: 'dark',
  },
};

export const Interactive: Story = {
  render: () => {
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    return <ColorModeToggle colorMode={mode} onColorModeToggle={setMode} />;
  },
};
