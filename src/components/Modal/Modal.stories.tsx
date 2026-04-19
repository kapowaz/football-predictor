import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Button } from '@kapowaz/components';
import { Modal } from './Modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  args: {
    isOpen: false,
    onClose: action('onClose'),
    children: null,
  },
  argTypes: {
    isShakeOnOpen: { control: 'boolean' },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button type="primary" onClick={() => setIsOpen(true)}>
          Open Modal
        </Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div style={{ padding: 24 }}>
            <h2 style={{ margin: '0 0 12px' }}>Modal Title</h2>
            <p style={{ margin: '0 0 16px' }}>This is the modal content.</p>
            <Button type="danger" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </Modal>
      </>
    );
  },
};

export const WithShake: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button type="danger" onClick={() => setIsOpen(true)}>
          Open Shaking Modal
        </Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isShakeOnOpen>
          <div style={{ padding: 24 }}>
            <h2 style={{ margin: '0 0 12px' }}>Warning!</h2>
            <p style={{ margin: '0 0 16px' }}>This modal shakes on open.</p>
            <Button type="danger" onClick={() => setIsOpen(false)}>
              Dismiss
            </Button>
          </div>
        </Modal>
      </>
    );
  },
};
