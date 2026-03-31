import { useRef, useState } from 'react';
import type { FocusEvent, ReactNode } from 'react';
import clsx from 'clsx';
import * as styles from './ScoreInput.css';

interface ScoreInputProps {
  /** ID attribute for the home goals input, used to associate with an external label */
  homeInputId?: string;
  /** ID attribute for the away goals input, used to associate with an external label */
  awayInputId?: string;
  homeGoals: number | null;
  awayGoals: number | null;
  /** Content shown between the two score inputs. */
  separatorText?: ReactNode;
  /** Whether the current values originate from live score data. */
  isLiveScore?: boolean;
  onChange: (homeGoals: number | null, awayGoals: number | null) => void;
}

const parseGoals = (value: string): number | null => {
  const digits = value.replace(/\D/g, '');
  if (digits === '') return null;
  return Math.min(99, parseInt(digits, 10));
};

const selectOnFocus = (e: FocusEvent<HTMLInputElement>) => {
  e.target.select();
};

export const ScoreInput = ({
  homeInputId,
  awayInputId,
  homeGoals,
  awayGoals,
  separatorText = 'vs',
  isLiveScore = false,
  onChange,
}: ScoreInputProps) => {
  const awayRef = useRef<HTMLInputElement>(null);
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
    <div className={clsx(styles.container, isLiveScore && styles.liveScoreContainer)}>
      <input
        id={homeInputId}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={2}
        className={clsx(styles.input, isLiveScore && styles.liveScoreInput)}
        value={localHome ?? ''}
        onFocus={selectOnFocus}
        onChange={(e) => {
          const parsed = parseGoals(e.target.value);
          setLocalHome(parsed);
          onChange(parsed, localAway);
          if (parsed !== null) {
            awayRef.current?.focus();
          }
        }}
        aria-label="Home team goals"
      />
      <span className={styles.separator}>
        {isLiveScore && <span className={styles.liveIndicator}>LIVE</span>}
        {separatorText}
      </span>
      <input
        ref={awayRef}
        id={awayInputId}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={2}
        className={clsx(styles.input, isLiveScore && styles.liveScoreInput)}
        value={localAway ?? ''}
        onFocus={selectOnFocus}
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
