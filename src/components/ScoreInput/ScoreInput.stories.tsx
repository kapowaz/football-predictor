import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScoreInput } from './ScoreInput';

const meta = {
  title: 'Components/ScoreInput',
  component: ScoreInput,
} satisfies Meta<typeof ScoreInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    homeGoals: null,
    awayGoals: null,
  },
};

export const WithScore: Story = {
  args: {
    homeGoals: 2,
    awayGoals: 1,
  },
};

export const Interactive: Story = {
  render: () => {
    const [home, setHome] = useState<number | null>(null);
    const [away, setAway] = useState<number | null>(null);
    return (
      <ScoreInput
        homeGoals={home}
        awayGoals={away}
        onChange={(h, a) => {
          setHome(h);
          setAway(a);
        }}
      />
    );
  },
};

export const CustomSeparator: Story = {
  args: {
    homeGoals: 3,
    awayGoals: 3,
    separatorText: '—',
  },
};
