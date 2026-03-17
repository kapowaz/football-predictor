import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { SparklesIcon, ImageDownIcon, ArrowDownFromDotIcon } from '../icons';

const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['danger', 'success'],
    },
    disabled: { control: 'boolean' },
    compact: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Save Changes',
  },
};

export const SuccessWithIcon: Story = {
  args: {
    variant: 'success',
    children: (
      <>
        <ImageDownIcon />
        Save Image
      </>
    ),
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete Item',
  },
};

export const DangerWithIcon: Story = {
  args: {
    variant: 'danger',
    children: (
      <>
        <ArrowDownFromDotIcon />
        Deductions
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    variant: 'success',
    children: 'Disabled Button',
    disabled: true,
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'success',
    iconOnly: true,
    'aria-label': 'AI Predictions',
    children: <SparklesIcon size={18} />,
  },
};

export const Compact: Story = {
  args: {
    variant: 'success',
    iconOnly: true,
    compact: true,
    'aria-label': 'AI Predictions',
    children: <SparklesIcon size={16} />,
  },
};

export const CompactDanger: Story = {
  args: {
    variant: 'danger',
    iconOnly: true,
    compact: true,
    'aria-label': 'Deductions',
    children: <ArrowDownFromDotIcon size={16} />,
  },
};
