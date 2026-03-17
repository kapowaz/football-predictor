import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { NavBar } from './NavBar';
import { Button } from '../Button';
import { ImageDownIcon, ArrowDownFromDotIcon, SparklesIcon } from '../icons';
import { allCompetitions } from '../../data/competitions';

const competitions = allCompetitions();
const activeSlug = 'premier-league';

const navBarActions = (
  <>
    <Button variant="success" iconOnly compact aria-label="Save Image">
      <ImageDownIcon size={16} />
    </Button>
    <Button variant="danger" iconOnly compact aria-label="Deductions">
      <ArrowDownFromDotIcon size={16} />
    </Button>
    <Button variant="success" iconOnly compact aria-label="AI Predictions">
      <SparklesIcon size={16} />
    </Button>
  </>
);

const meta = {
  title: 'Components/NavBar',
  component: NavBar,
  decorators: [
    (Story, { parameters }) => (
      <MemoryRouter initialEntries={[parameters.initialPath ?? `/${activeSlug}/`]}>
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
    actions: navBarActions,
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
          actions={navBarActions}
        />
      </MemoryRouter>
    );
  },
};
