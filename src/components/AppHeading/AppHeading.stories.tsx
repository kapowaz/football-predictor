import type { Meta, StoryObj } from '@storybook/react-vite';

import { AppHeading } from './AppHeading';

const meta = {
  title: 'Components/AppHeading',
  component: AppHeading,
  argTypes: {
    isFullRender: { control: 'boolean' },
    isTitleHidden: { control: 'boolean' },
  },
} satisfies Meta<typeof AppHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FullRender: Story = {
  args: {
    isFullRender: true,
  },
};

export const WithExtraContent: Story = {
  args: {
    isFullRender: true,
    extraContent: (
      <span style={{ fontSize: 14, opacity: 0.7 }}>Premier League 2025/26</span>
    ),
  },
};
