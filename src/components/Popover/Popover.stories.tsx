import React, { useRef, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from './Popover';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Should the Popover be controlled as open?',
    },
    placement: {
      control: 'text',
      description: 'Placement of the Popover relative to the trigger content',
    },

    isInteractive: {
      control: 'boolean',
      description:
        'Should the Popover stay around long enough to allow interacting with the contents, e.g. selecting text?',
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: undefined,
    placement: 'top',
    trigger: <button>Hover me</button>,
    children: <div style={{ padding: '4px' }}>Hello&nbsp;World</div>,
  },
};

export const WithContentProp: Story = {
  args: {
    isOpen: undefined,
    placement: 'top',
    children: <button>Hover me</button>,
    content: <div style={{ padding: '4px' }}>Hello&nbsp;World</div>,
  },
};

export const LengthyDelay: Story = {
  args: {
    isOpen: undefined,
    placement: 'top',
    trigger: <button>Hover me</button>,
    children: <div style={{ padding: '4px' }}>Hello&nbsp;World</div>,
    hideDelay: 2000,
  },
};

const virtualElementStyle: CSSProperties = {
  padding: '8px 16px',
  fontSize: '12px',
  fontWeight: 'bold',
};

const WithVirtualElementRender = () => {
  const reference = useRef<HTMLDivElement>(null);

  return (
    <div style={{ display: 'inline-flex', gap: '4px' }}>
      <div style={virtualElementStyle} ref={reference}>
        Popover will appear here
      </div>
      <Popover placement="top" trigger={<button>Hover me</button>} virtualElement={reference}>
        <div style={{ padding: '4px' }}>Hello&nbsp;World</div>
      </Popover>
    </div>
  );
};

export const WithVirtualElement: Story = {
  render: () => <WithVirtualElementRender />,
  args: {
    isOpen: undefined,
    placement: 'top',
    trigger: <></>,
    children: <></>,
  },
};

const ControlledWithVirtualElementRender = () => {
  const reference = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <div style={{ display: 'inline-flex', gap: '4px' }}>
      <div style={virtualElementStyle} ref={reference}>
        Popover will appear here
      </div>
      <button onClick={() => setOpen(!isOpen)}>{isOpen ? 'Hide' : 'Show'} Popover</button>
      <Popover placement="top" virtualElement={reference} isOpen={isOpen}>
        <div style={{ padding: '4px' }}>Hello&nbsp;World</div>
      </Popover>
    </div>
  );
};

export const ControlledWithVirtualElement: Story = {
  render: () => <ControlledWithVirtualElementRender />,
  args: {
    isOpen: undefined,
    placement: 'top',
    trigger: <></>,
    children: <></>,
  },
};
