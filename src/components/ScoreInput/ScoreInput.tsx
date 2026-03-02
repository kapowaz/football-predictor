import { useCallback, useEffect, useState } from 'react';
import * as styles from './ScoreInput.css';

interface ScoreInputProps {
  homeGoals: number | null;
  awayGoals: number | null;
  onChange: (homeGoals: number | null, awayGoals: number | null) => void;
}

export const ScoreInput = ({ homeGoals, awayGoals, onChange }: ScoreInputProps) => {
  const [localHome, setLocalHome] = useState<number | null>(homeGoals);
  const [localAway, setLocalAway] = useState<number | null>(awayGoals);

  useEffect(() => {
    setLocalHome(homeGoals);
  }, [homeGoals]);

  useEffect(() => {
    setLocalAway(awayGoals);
  }, [awayGoals]);

  const handleHomeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const parsed = value === '' ? null : Math.max(0, parseInt(value, 10) || 0);
      setLocalHome(parsed);
      onChange(parsed, localAway);
    },
    [localAway, onChange],
  );

  const handleAwayChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const parsed = value === '' ? null : Math.max(0, parseInt(value, 10) || 0);
      setLocalAway(parsed);
      onChange(localHome, parsed);
    },
    [localHome, onChange],
  );

  return (
    <div className={styles.container}>
      <input
        type="number"
        min="0"
        max="99"
        className={styles.input}
        value={localHome ?? ''}
        onChange={handleHomeChange}
        aria-label="Home team goals"
      />
      <span className={styles.separator}>vs</span>
      <input
        type="number"
        min="0"
        max="99"
        className={styles.input}
        value={localAway ?? ''}
        onChange={handleAwayChange}
        aria-label="Away team goals"
      />
    </div>
  );
};
