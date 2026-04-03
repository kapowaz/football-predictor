import { clsx } from 'clsx';
import * as styles from './ZoneThresholdLabel.css';
import type { ZoneThresholdLabelProps } from './types';

export const ZoneThresholdLabel = ({ zone, label, threshold }: ZoneThresholdLabelProps) => {
  return (
    <span className={clsx(styles.base, styles.variant[zone])}>
      <span className={styles.label}>{label}</span>{' '}
      <strong className={styles.threshold}>
        {'\u2265'} {threshold}
      </strong>{' '}
      pts
    </span>
  );
};
