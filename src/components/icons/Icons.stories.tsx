import type { ReactElement } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { IconProps } from './types';
import * as IconExports from './index';

type IconComponent = (props: IconProps) => ReactElement;

const icons = Object.entries(IconExports)
  .filter((entry): entry is [string, IconComponent] => typeof entry[1] === 'function')
  .map(([name, Component]) => ({ name, Component }))
  .sort((a, b) => a.name.localeCompare(b.name));

const IconGrid = ({ size }: { size: number }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: 24,
    }}
  >
    {icons.map(({ name, Component }) => (
      <div
        key={name}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          padding: 16,
          borderRadius: 8,
          border: '1px solid #e0e0e0',
        }}
      >
        <Component size={size} />
        <span style={{ fontSize: 11, textAlign: 'center', wordBreak: 'break-all' }}>
          {name}
        </span>
      </div>
    ))}
  </div>
);

const meta = {
  title: 'Components/Icons',
  component: IconGrid,
  argTypes: {
    size: { control: { type: 'number', min: 12, max: 64, step: 2 } },
  },
} satisfies Meta<typeof IconGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIcons: Story = {
  args: {
    size: 24,
  },
};

export const LargeIcons: Story = {
  args: {
    size: 48,
  },
};

export const SmallIcons: Story = {
  args: {
    size: 16,
  },
};
