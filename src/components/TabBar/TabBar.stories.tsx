import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { TabBar } from './TabBar';

const meta = {
  title: 'Components/TabBar',
  component: TabBar,
  args: {
    activeTab: '',
    onTabChange: action('onTabChange'),
  },
  argTypes: {
    alwaysVisible: { control: 'boolean' },
  },
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tabs: [
      { id: 'standings', label: 'Standings' },
      { id: 'fixtures', label: 'Fixtures' },
    ],
    activeTab: 'standings',
    alwaysVisible: true,
  },
};

export const Interactive: Story = {
  args: {
    tabs: [
      { id: 'standings', label: 'Standings' },
      { id: 'fixtures', label: 'Fixtures' },
    ],
    alwaysVisible: true,
  },
  render: (args) => {
    const [activeTab, setActiveTab] = useState('standings');
    return <TabBar {...args} activeTab={activeTab} onTabChange={setActiveTab} />;
  },
};

export const ThreeTabs: Story = {
  args: {
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'details', label: 'Details' },
      { id: 'settings', label: 'Settings' },
    ],
    activeTab: 'overview',
    alwaysVisible: true,
  },
};
