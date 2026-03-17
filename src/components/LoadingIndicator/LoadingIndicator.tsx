import type { CSSProperties } from 'react';
import * as styles from './LoadingIndicator.css';
import { LOADING_INDICATOR_SIZES, LOADING_INDICATOR_STROKE_WIDTHS } from './types';
import type { LoadingIndicatorProps } from './types';

/** Extract the raw `--custom-property` name from Vanilla Extract's `var(--…)` wrapper. */
const animationDurationProperty = styles.animationDuration.slice(4, -1);

export const LoadingIndicator = ({
  size: _size = 'md',
  duration = 1000,
  isInverted = false,
  customColor,
}: LoadingIndicatorProps) => {
  const size = LOADING_INDICATOR_SIZES[_size];
  const strokeWidth = LOADING_INDICATOR_STROKE_WIDTHS[_size];
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressArcLength = circumference / 4;
  const backgroundArcLength = (circumference * 3) / 4;

  const variant = isInverted || customColor ? 'inverted' : 'default';
  const strokeOverride = customColor ? { stroke: customColor } : undefined;

  return (
    <div className={styles.container}>
      <svg
        width={size}
        height={size}
        className={styles.svg}
        style={{ [animationDurationProperty]: `${duration}ms` } as CSSProperties}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={styles.backgroundCircle[variant]}
          strokeWidth={strokeWidth}
          strokeDasharray={`${backgroundArcLength} ${circumference}`}
          style={strokeOverride}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={styles.progressCircle[variant]}
          strokeWidth={strokeWidth}
          strokeDasharray={`${progressArcLength} ${circumference}`}
          transform={`rotate(270 ${size / 2} ${size / 2})`}
          style={strokeOverride}
        />
      </svg>
    </div>
  );
};
