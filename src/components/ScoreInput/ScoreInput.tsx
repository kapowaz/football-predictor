import { useCallback } from 'react';
import * as styles from './ScoreInput.css';

interface ScoreInputProps {
  homeGoals: number | null;
  awayGoals: number | null;
  onChange: (homeGoals: number | null, awayGoals: number | null) => void;
}

export function ScoreInput({ homeGoals, awayGoals, onChange }: ScoreInputProps) {
  const handleHomeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const parsed = value === '' ? null : Math.max(0, parseInt(value, 10) || 0);
      onChange(parsed, awayGoals);
    },
    [awayGoals, onChange]
  );

  const handleAwayChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const parsed = value === '' ? null : Math.max(0, parseInt(value, 10) || 0);
      onChange(homeGoals, parsed);
    },
    [homeGoals, onChange]
  );

  return (
    <div className={styles.container}>
      <input
        type="number"
        min="0"
        max="99"
        className={styles.input}
        value={homeGoals ?? ''}
        onChange={handleHomeChange}
        placeholder="-"
        aria-label="Home team goals"
      />
      <span className={styles.separator}>-</span>
      <input
        type="number"
        min="0"
        max="99"
        className={styles.input}
        value={awayGoals ?? ''}
        onChange={handleAwayChange}
        placeholder="-"
        aria-label="Away team goals"
      />
    </div>
  );
}
