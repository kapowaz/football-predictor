import { useState } from 'react';
import * as styles from './ScoreInput.css';

interface ScoreInputProps {
  /** ID attribute for the home goals input, used to associate with an external label */
  homeInputId?: string;
  /** ID attribute for the away goals input, used to associate with an external label */
  awayInputId?: string;
  homeGoals: number | null;
  awayGoals: number | null;
  /** Text shown between the two score inputs */
  separatorText?: string;
  onChange: (homeGoals: number | null, awayGoals: number | null) => void;
}

const parseGoals = (value: string): number | null =>
  value === '' ? null : Math.max(0, parseInt(value, 10) || 0);

export const ScoreInput = ({
  homeInputId,
  awayInputId,
  homeGoals,
  awayGoals,
  separatorText = 'vs',
  onChange,
}: ScoreInputProps) => {
  const [localHome, setLocalHome] = useState(homeGoals);
  const [localAway, setLocalAway] = useState(awayGoals);
  const [prevHome, setPrevHome] = useState(homeGoals);
  const [prevAway, setPrevAway] = useState(awayGoals);

  if (homeGoals !== prevHome) {
    setPrevHome(homeGoals);
    setLocalHome(homeGoals);
  }
  if (awayGoals !== prevAway) {
    setPrevAway(awayGoals);
    setLocalAway(awayGoals);
  }

  return (
    <div className={styles.container}>
      <input
        id={homeInputId}
        type="number"
        min="0"
        max="99"
        className={styles.input}
        value={localHome ?? ''}
        onChange={(e) => {
          const parsed = parseGoals(e.target.value);
          setLocalHome(parsed);
          onChange(parsed, localAway);
        }}
        aria-label="Home team goals"
      />
      <span className={styles.separator}>{separatorText}</span>
      <input
        id={awayInputId}
        type="number"
        min="0"
        max="99"
        className={styles.input}
        value={localAway ?? ''}
        onChange={(e) => {
          const parsed = parseGoals(e.target.value);
          setLocalAway(parsed);
          onChange(localHome, parsed);
        }}
        aria-label="Away team goals"
      />
    </div>
  );
};
