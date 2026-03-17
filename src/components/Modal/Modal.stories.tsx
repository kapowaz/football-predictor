import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Modal } from './Modal';
import { Button } from '../Button';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  args: {
    isOpen: false,
    onClose: action('onClose'),
    children: null,
  },
  argTypes: {
    shakeOnOpen: { control: 'boolean' },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button variant="success" onClick={() => setIsOpen(true)}>
          Open Modal
        </Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div style={{ padding: 24 }}>
            <h2 style={{ margin: '0 0 12px' }}>Modal Title</h2>
            <p style={{ margin: '0 0 16px' }}>This is the modal content.</p>
            <Button variant="danger" onClick={() => setIsOpen(false)}>
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
        <Button variant="danger" onClick={() => setIsOpen(true)}>
          Open Shaking Modal
        </Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} shakeOnOpen>
          <div style={{ padding: 24 }}>
            <h2 style={{ margin: '0 0 12px' }}>Warning!</h2>
            <p style={{ margin: '0 0 16px' }}>This modal shakes on open.</p>
            <Button variant="danger" onClick={() => setIsOpen(false)}>
              Dismiss
            </Button>
          </div>
        </Modal>
      </>
    );
  },
};
