import { useState, useMemo, useCallback } from 'react';
import {
  useFloating,
  useDismiss,
  useRole,
  useInteractions,
  FloatingOverlay,
  FloatingFocusManager,
} from '@floating-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import type { PointDeduction, Team } from '../../types';
import { getCrest } from '../../assets/crests';
import * as styles from './DeductionsModal.css';

interface DeductionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deductions: PointDeduction[];
  teams: Team[];
  isCustomised: boolean;
  onUpdate: (teamId: number, amount: number, reason: string) => void;
  onAdd: (teamId: number, amount: number, reason: string) => void;
  onRemove: (teamId: number) => void;
  onReset: () => void;
}

function DeductionRow({
  deduction,
  team,
  onUpdate,
  onRemove,
}: {
  deduction: PointDeduction;
  team: Team | undefined;
  onUpdate: (teamId: number, amount: number, reason: string) => void;
  onRemove: (teamId: number) => void;
}) {
  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const stripped = e.target.value.replace(/\D/g, '');
      const value = parseInt(stripped, 10);
      if (stripped === '') return;
      if (!isNaN(value) && value >= 0) {
        onUpdate(deduction.teamId, value, deduction.reason);
      }
    },
    [deduction.teamId, deduction.reason, onUpdate],
  );

  const handleReasonChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(deduction.teamId, deduction.amount, e.target.value);
    },
    [deduction.teamId, deduction.amount, onUpdate],
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
      <input
        type="text"
        value={deduction.reason}
        onChange={handleReasonChange}
        className={styles.deductionReasonInput}
        aria-label={`Reason for ${teamLabel} deduction`}
      />
    </div>
  );
}

export function DeductionsModal({
  isOpen,
  onClose,
  deductions,
  teams,
  isCustomised,
  onUpdate,
  onAdd,
  onRemove,
  onReset,
}: DeductionsModalProps) {
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (!open) onClose();
    },
  });

  const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown' });
  const role = useRole(context, { role: 'dialog' });
  const { getFloatingProps } = useInteractions([dismiss, role]);

  const floatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      refs.setFloating(node);
    },
    [refs],
  );

  const teamsById = useMemo(() => new Map(teams.map((t) => [t.id, t])), [teams]);

  const availableTeams = useMemo(() => {
    const deductedIds = new Set(deductions.map((d) => d.teamId));
    return teams.filter((t) => !deductedIds.has(t.id)).sort((a, b) => a.name.localeCompare(b.name));
  }, [teams, deductions]);

  const [newTeamId, setNewTeamId] = useState<number | ''>('');
  const [newAmount, setNewAmount] = useState('');
  const [newReason, setNewReason] = useState('');

  const canAdd =
    newTeamId !== '' && newAmount !== '' && parseInt(newAmount, 10) > 0 && newReason.trim() !== '';

  const handleAdd = useCallback(() => {
    if (!canAdd || typeof newTeamId !== 'number') return;
    onAdd(newTeamId, parseInt(newAmount, 10), newReason.trim());
    setNewTeamId('');
    setNewAmount('');
    setNewReason('');
  }, [canAdd, newTeamId, newAmount, newReason, onAdd]);

  return (
    <AnimatePresence>
      {isOpen && (
        <FloatingOverlay lockScroll>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FloatingFocusManager context={context}>
              <motion.div
                ref={floatingRef}
                className={styles.modal}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                {...getFloatingProps()}
              >
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

                <div className={styles.sectionLabel}>Add Deduction</div>
                <div className={styles.addForm}>
                  <div className={styles.addFormRow}>
                    <select
                      className={styles.teamSelect}
                      value={newTeamId}
                      onChange={(e) => setNewTeamId(e.target.value ? Number(e.target.value) : '')}
                      aria-label="Select team"
                    >
                      <option value="">Select a team…</option>
                      {availableTeams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
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
                  </div>
                  <div className={styles.addFormRow}>
                    <input
                      type="text"
                      placeholder="Reason for deduction…"
                      value={newReason}
                      onChange={(e) => setNewReason(e.target.value)}
                      className={styles.reasonInput}
                      aria-label="Reason for deduction"
                    />
                    <button className={styles.addButton} onClick={handleAdd} disabled={!canAdd}>
                      Add Deduction
                    </button>
                  </div>
                </div>

                {isCustomised && (
                  <div className={styles.footer}>
                    <button className={styles.resetButton} onClick={onReset}>
                      Reset to Defaults
                    </button>
                  </div>
                )}
              </motion.div>
            </FloatingFocusManager>
          </motion.div>
        </FloatingOverlay>
      )}
    </AnimatePresence>
  );
}
