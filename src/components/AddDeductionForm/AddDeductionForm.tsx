import { useState, useMemo, useCallback } from 'react';
import {
  AbstractSpacer,
  AbstractText,
  Button,
  TextInput,
} from '@kapowaz/components';
import { TeamSelect } from '@kapowaz/football';

import type { PointDeduction, Team } from '../../types';

import * as styles from './AddDeductionForm.css';

export interface AddDeductionFormProps {
  /** All teams available for selection. */
  teams: Team[];
  /** Existing deductions (used to filter out already-deducted teams). */
  deductions: PointDeduction[];
  /** Callback fired when a new deduction is submitted. */
  onAdd: (teamId: number, amount: number) => void;
}

export const AddDeductionForm = ({
  teams,
  deductions,
  onAdd,
}: AddDeductionFormProps) => {
  const availableTeams = useMemo(() => {
    const deductedIds = new Set(deductions.map((d) => d.teamId));
    return teams
      .filter((t) => !deductedIds.has(t.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [teams, deductions]);

  const [newTeamId, setNewTeamId] = useState<number | ''>('');
  const [newAmount, setNewAmount] = useState('');

  const canAdd =
    newTeamId !== '' && newAmount !== '' && parseInt(newAmount, 10) > 0;

  const handleAdd = useCallback(() => {
    if (!canAdd || typeof newTeamId !== 'number') return;
    onAdd(newTeamId, parseInt(newAmount, 10));
    setNewTeamId('');
    setNewAmount('');
  }, [canAdd, newTeamId, newAmount, onAdd]);

  return (
    <AbstractSpacer spacing="zero zero lg">
      <AbstractText
        tagName="div"
        className={styles.sectionLabel}
        fontSize="sm"
        fontWeight="semibold"
        textTransform="uppercase"
        letterSpacing="wide"
      >
        Add Deduction
      </AbstractText>
      <div className={styles.addFormRow}>
        <div className={styles.teamSelectWrapper}>
          <TeamSelect
            teams={availableTeams}
            value={newTeamId}
            onChange={setNewTeamId}
            menuPlacement="top"
          />
        </div>
        <TextInput
          inputMode="numeric"
          pattern="[0-9]*"
          value={newAmount}
          onChange={(val) => setNewAmount(val.replace(/\D/g, ''))}
          className={styles.amountInput}
          textAlign="center"
          aria-label="Points to deduct"
        />
        <Button type="primary" onClick={handleAdd} isDisabled={!canAdd}>
          Add
        </Button>
      </div>
    </AbstractSpacer>
  );
};
