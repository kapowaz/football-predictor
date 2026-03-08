import { useCallback } from 'react';
import type { PointDeduction, Team } from '../../types';
import { getCrest } from '../../assets/crests';
import { TrashIcon } from '../icons';
import * as styles from './DeductionsModal.css';

interface DeductionRowProps {
  deduction: PointDeduction;
  team: Team | undefined;
  onUpdate: (teamId: number, amount: number) => void;
  onRemove: (teamId: number) => void;
}

export const DeductionRow = ({
  deduction,
  team,
  onUpdate,
  onRemove,
}: DeductionRowProps) => {
  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const stripped = e.target.value.replace(/\D/g, '');
      const value = parseInt(stripped, 10);
      if (stripped === '') return;
      if (!isNaN(value) && value >= 0) {
        onUpdate(deduction.teamId, value);
      }
    },
    [deduction.teamId, onUpdate],
  );

  const teamLabel = team?.name ?? `Team ${deduction.teamId}`;

  return (
    <div className={styles.deductionRow}>
      <div className={styles.deductionRowTop}>
        {team && <img src={getCrest(team.crest)} alt={team.name} className={styles.crest} />}
        <span className={styles.teamName}>{teamLabel}</span>
        <div className={styles.deductionActions}>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={deduction.amount}
            onChange={handleAmountChange}
            className={styles.amountInput}
            aria-label={`Points deduction for ${teamLabel}`}
          />
          <button
            className={styles.deleteButton}
            onClick={() => onRemove(deduction.teamId)}
            aria-label={`Remove deduction for ${teamLabel}`}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
      {deduction.reason && (
        <span className={styles.deductionReasonText}>{deduction.reason}</span>
      )}
    </div>
  );
};
