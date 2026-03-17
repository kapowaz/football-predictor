import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { DeductionsModal } from './DeductionsModal';
import { Button } from '../Button';
import type { Team, PointDeduction } from '../../types';

const teams: Team[] = [
  { id: 1, fotmobId: 100, name: 'Arsenal', shortName: 'Arsenal', tla: 'ARS', crest: 'arsenal' },
  { id: 2, fotmobId: 200, name: 'Chelsea', shortName: 'Chelsea', tla: 'CHE', crest: 'chelsea' },
  { id: 3, fotmobId: 300, name: 'Manchester United', shortName: 'Man United', tla: 'MUN', crest: 'manchester-united' },
];

const deductions: PointDeduction[] = [
  { teamId: 1, amount: 6, reason: 'Financial irregularity' },
  { teamId: 3, amount: 3, reason: 'Registration breach' },
];

const meta = {
  title: 'Components/DeductionsModal',
  component: DeductionsModal,
  args: {
    isOpen: false,
    onClose: action('onClose'),
    deductions: [],
    teams,
    isCustomised: false,
    onUpdate: action('onUpdate'),
    onAdd: action('onAdd'),
    onRemove: action('onRemove'),
    onReset: action('onReset'),
  },
} satisfies Meta<typeof DeductionsModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setIsOpen(true)}>
          Open Deductions
        </Button>
        <DeductionsModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          deductions={deductions}
          teams={teams}
          isCustomised
          onUpdate={() => {}}
          onAdd={() => {}}
          onRemove={() => {}}
          onReset={() => {}}
        />
      </>
    );
  },
};

export const Empty: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setIsOpen(true)}>
          Open Deductions
        </Button>
        <DeductionsModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          deductions={[]}
          teams={teams}
          isCustomised={false}
          onUpdate={() => {}}
          onAdd={() => {}}
          onRemove={() => {}}
          onReset={() => {}}
        />
      </>
    );
  },
};
