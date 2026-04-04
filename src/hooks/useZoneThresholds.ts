import { useEffect, useRef, useState } from 'react';
import type { Match, PredictionsStore, TeamStanding } from '../types';
import type { ZoneDefinition } from '../data/competitions';
import type { ZoneThreshold } from '../utils/zoneThresholds';
import type { ZoneThresholdsResponse } from '../workers/zoneThresholds.worker';

let worker: Worker | null = null;
let nextRequestId = 0;

const getWorker = (): Worker => {
  if (!worker) {
    worker = new Worker(
      new URL('../workers/zoneThresholds.worker.ts', import.meta.url),
      { type: 'module' },
    );
  }
  return worker;
};

const EMPTY_THRESHOLDS: ZoneThreshold[] = [];

/**
 * Offloads zone-threshold computation to a Web Worker so the main thread
 * stays responsive while the Dinic max-flow binary search runs.
 */
export const useZoneThresholds = (
  standings: TeamStanding[],
  matches: Match[],
  predictions: PredictionsStore,
  zones: ZoneDefinition[],
): ZoneThreshold[] => {
  const [result, setResult] = useState<ZoneThreshold[]>(EMPTY_THRESHOLDS);
  const activeRequestId = useRef(-1);

  useEffect(() => {
    const id = ++nextRequestId;
    activeRequestId.current = id;

    const w = getWorker();

    const handler = (event: MessageEvent<ZoneThresholdsResponse>) => {
      if (event.data.requestId !== id) return;
      setResult(event.data.result);
    };

    w.addEventListener('message', handler);
    w.postMessage({ requestId: id, standings, matches, predictions, zones });

    return () => {
      w.removeEventListener('message', handler);
    };
  }, [standings, matches, predictions, zones]);

  return result;
};
