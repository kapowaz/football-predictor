import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { allCompetitions } from '../../data/competitions';
import { NavBar } from './NavBar';

const competitions = allCompetitions();
const activeSlug = 'premier-league';

const noop = () => {};

const meta = {
  title: 'Components/NavBar',
  component: NavBar,
  decorators: [
    (Story, { parameters }) => (
      <MemoryRouter
        initialEntries={[parameters.initialPath ?? `/${activeSlug}/`]}
      >
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    competitions,
    activeSlug,
    onCompetitionChange: () => {},
    colorMode: 'light',
    onColorModeToggle: () => {},
  },
  argTypes: {
    colorMode: {
      control: 'inline-radio',
      options: ['light', 'dark'],
    },
  },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompetitionActive: Story = {
  parameters: {
    initialPath: `/${activeSlug}/`,
  },
};

export const RunInActive: Story = {
  parameters: {
    initialPath: `/run-in/${activeSlug}/`,
  },
};

export const RelegationActive: Story = {
  parameters: {
    initialPath: `/relegation/${activeSlug}/`,
  },
};

export const WithActions: Story = {
  args: {
    onSaveImageClick: noop,
    onDeductionsClick: noop,
    onAIPredictionsClick: noop,
    onResetPredictionsClick: noop,
  },
  parameters: {
    initialPath: `/${activeSlug}/`,
  },
};

export const Interactive: Story = {
  render: () => {
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    return (
      <MemoryRouter initialEntries={[`/${activeSlug}/`]}>
        <NavBar
          competitions={competitions}
          activeSlug={activeSlug}
          onCompetitionChange={() => {}}
          colorMode={mode}
          onColorModeToggle={setMode}
          onSaveImageClick={noop}
          onDeductionsClick={noop}
          onAIPredictionsClick={noop}
          onResetPredictionsClick={noop}
        />
      </MemoryRouter>
    );
  },
};
