import { useMemo } from 'react';
import type { PointDeduction, Team } from '../../types';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { DeductionRow } from './DeductionRow';
import { AddDeductionForm } from './AddDeductionForm';
import * as styles from './DeductionsModal.css';

interface DeductionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deductions: PointDeduction[];
  teams: Team[];
  isCustomised: boolean;
  onUpdate: (teamId: number, amount: number) => void;
  onAdd: (teamId: number, amount: number) => void;
  onRemove: (teamId: number) => void;
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.modal}>
      <div className={styles.header}>
        <h2 className={styles.title}>Point Deductions</h2>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <div className={styles.sectionLabel}>Current Deductions</div>
      <div className={styles.deductionList}>
        {deductions.length === 0 && (
          <div className={styles.emptyState}>No point deductions applied.</div>
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

      <hr className={styles.divider} />

      <AddDeductionForm teams={teams} deductions={deductions} onAdd={onAdd} />

      {isCustomised && (
        <div className={styles.footer}>
          <Button variant="danger" onClick={onReset}>
            Reset to Defaults
          </Button>
        </div>
      )}
    </Modal>
  );
};
