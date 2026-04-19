import { useCallback } from 'react';
import { AbstractText, IconButton, TextInput } from '@kapowaz/components';
import { getClubBadge } from '@kapowaz/football-badges';
import { Trash2 } from '@kapowaz/icons';

import type { PointDeduction, Team } from '../../types';

import * as styles from './DeductionRow.css';

export interface DeductionRowProps {
  /** The point deduction data for this row. */
  deduction: PointDeduction;
  /** The team associated with this deduction, if resolved. */
  team: Team | undefined;
  /** Callback fired when the deduction amount changes. */
  onUpdate: (teamId: number, amount: number) => void;
  /** Callback fired when this deduction is removed. */
  onRemove: (teamId: number) => void;
}

export const DeductionRow = ({
  deduction,
  team,
  onUpdate,
  onRemove,
}: DeductionRowProps) => {
  const handleAmountChange = useCallback(
    (val: string) => {
      const stripped = val.replace(/\D/g, '');
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
        {team && (
          <img
            src={getClubBadge(team.badge)}
            alt={team.name}
            className={styles.badge}
          />
        )}
        <AbstractText
          tagName="span"
          className={styles.teamName}
          fontSize="md"
          fontWeight="medium"
        >
          {teamLabel}
        </AbstractText>
        <div className={styles.deductionActions}>
          <TextInput
            inputMode="numeric"
            pattern="[0-9]*"
            value={String(deduction.amount)}
            onChange={handleAmountChange}
            className={styles.amountInput}
            textAlign="center"
            aria-label={`Points deduction for ${teamLabel}`}
          />
          <IconButton
            icon={Trash2}
            variant="danger"
            onClick={() => onRemove(deduction.teamId)}
            label={`Remove deduction for ${teamLabel}`}
          />
        </div>
      </div>
      {deduction.reason && (
        <AbstractText
          tagName="span"
          className={styles.deductionReasonText}
          fontSize="sm"
        >
          {deduction.reason}
        </AbstractText>
      )}
    </div>
  );
};
