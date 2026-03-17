import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ArrowDownFromDotIcon,
  BrainIcon,
  ChevronRightIcon,
  ImageDownIcon,
  KBoltIcon,
  MoonIcon,
  RoundedSquareBadgesIcon,
  ShareIcon,
  SparklesIcon,
  SparklineIcon,
  SunIcon,
  TrashIcon,
  TrendingDownIcon,
} from './index';

const icons = [
  { name: 'ArrowDownFromDotIcon', Component: ArrowDownFromDotIcon },
  { name: 'BrainIcon', Component: BrainIcon },
  { name: 'ChevronRightIcon', Component: ChevronRightIcon },
  { name: 'ImageDownIcon', Component: ImageDownIcon },
  { name: 'KBoltIcon', Component: KBoltIcon },
  { name: 'MoonIcon', Component: MoonIcon },
  { name: 'RoundedSquareBadgesIcon', Component: RoundedSquareBadgesIcon },
  { name: 'ShareIcon', Component: ShareIcon },
  { name: 'SparklesIcon', Component: SparklesIcon },
  { name: 'SparklineIcon', Component: SparklineIcon },
  { name: 'SunIcon', Component: SunIcon },
  { name: 'TrashIcon', Component: TrashIcon },
  { name: 'TrendingDownIcon', Component: TrendingDownIcon },
];

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
