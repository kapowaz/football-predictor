import { useMemo } from 'react';
import { AbstractText, Modal } from '@kapowaz/components';
import type { ModalAction } from '@kapowaz/components';
import type { PointDeduction, Team } from '../../types';
import { DeductionRow } from '../DeductionRow';
import { AddDeductionForm } from '../AddDeductionForm';
import * as styles from './DeductionsModal.css';

interface DeductionsModalProps {
  /** Whether the modal is currently open. */
  isOpen: boolean;
  /** Callback fired when the modal is closed. */
  onClose: () => void;
  /** Current list of point deductions. */
  deductions: PointDeduction[];
  /** All teams in the competition. */
  teams: Team[];
  /** Whether the deductions have been customised from their defaults. */
  isCustomised: boolean;
  /** Callback fired when a deduction amount is changed. */
  onUpdate: (teamId: number, amount: number) => void;
  /** Callback fired when a new deduction is added. */
  onAdd: (teamId: number, amount: number) => void;
  /** Callback fired when a deduction is removed. */
  onRemove: (teamId: number) => void;
  /** Callback fired when deductions are reset to defaults. */
  onReset: () => void;
}

export const DeductionsModal = ({
  isOpen,
  onClose,
  deductions,
  teams,
  isCustomised,
  onUpdate,
  onAdd,
  onRemove,
  onReset,
}: DeductionsModalProps) => {
  const teamsById = useMemo(() => new Map(teams.map((t) => [t.id, t])), [teams]);

  const actions: ModalAction[] = [
    ...(isCustomised
      ? [{ type: 'danger' as const, label: 'Reset to Defaults', onClick: onReset }]
      : []),
    { type: 'primary' as const, label: 'Done', onClick: onClose },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Point Deductions"
      heading="Point Deductions"
      actions={actions}
      footerContent={<AddDeductionForm teams={teams} deductions={deductions} onAdd={onAdd} />}
    >
      <div className={styles.modalBody}>
        <AbstractText
          tagName="div"
          className={styles.sectionLabel}
          fontSize="sm"
          fontWeight="semibold"
          textTransform="uppercase"
          letterSpacing="wide"
        >
          Current Deductions
        </AbstractText>
        <div className={styles.deductionList}>
          {deductions.length === 0 && (
            <AbstractText tagName="div" className={styles.emptyState} fontSize="md">
              No point deductions applied.
            </AbstractText>
          )}
          {deductions.map((d) => (
            <DeductionRow
              key={d.teamId}
              deduction={d}
              team={teamsById.get(d.teamId)}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};
