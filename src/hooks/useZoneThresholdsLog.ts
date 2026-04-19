import { useEffect, useRef } from 'react';

import type { ZoneThreshold } from '../utils/zoneThresholds';
import { formatZoneThresholds } from '../utils/zoneThresholds';

/**
 * Logs zone thresholds to the console, deduplicating by output string
 * so repeated renders with identical data only produce a single entry.
 */
export const useZoneThresholdsLog = (
  competitionName: string,
  thresholds: ZoneThreshold[],
): void => {
  const lastOutput = useRef('');

  useEffect(() => {
    if (thresholds.length === 0) return;
    const output = formatZoneThresholds(competitionName, thresholds);
    if (output !== lastOutput.current) {
      lastOutput.current = output;
      console.log(output);
    }
  }, [competitionName, thresholds]);
};
