import { useState, useMemo, useCallback } from 'react';
import type { PointDeduction, Team } from '../../types';
import { Button } from '../Button';
import { TeamSelect } from '../TeamSelect';
import * as styles from './DeductionsModal.css';

interface AddDeductionFormProps {
  teams: Team[];
  deductions: PointDeduction[];
  onAdd: (teamId: number, amount: number) => void;
}

export const AddDeductionForm = ({ teams, deductions, onAdd }: AddDeductionFormProps) => {
  const availableTeams = useMemo(() => {
    const deductedIds = new Set(deductions.map((d) => d.teamId));
    return teams.filter((t) => !deductedIds.has(t.id)).sort((a, b) => a.name.localeCompare(b.name));
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
    <>
      <div className={styles.sectionLabel}>Add Deduction</div>
      <div className={styles.addFormRow}>
        <div className={styles.teamSelectWrapper}>
          <TeamSelect
            teams={availableTeams}
            value={newTeamId}
            onChange={setNewTeamId}
          />
        </div>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={newAmount}
          onChange={(e) => {
            const stripped = e.target.value.replace(/\D/g, '');
            setNewAmount(stripped);
          }}
          className={styles.amountInput}
          aria-label="Points to deduct"
        />
        <Button variant="success" onClick={handleAdd} disabled={!canAdd}>
          Add
        </Button>
      </div>
    </>
  );
};
