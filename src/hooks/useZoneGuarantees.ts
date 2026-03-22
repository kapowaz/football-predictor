import { useEffect, useRef, useState } from 'react';
import type { Match, PredictionsStore, TeamStanding } from '../types';
import type { ZoneDefinition } from '../data/competitions';
import type { ZoneGuaranteesResponse } from '../workers/zoneGuarantees.worker';

let worker: Worker | null = null;
let nextRequestId = 0;

const getWorker = (): Worker => {
  if (!worker) {
    worker = new Worker(
      new URL('../workers/zoneGuarantees.worker.ts', import.meta.url),
      { type: 'module' },
    );
  }
  return worker;
};

const EMPTY_MAP = new Map<number, boolean>();

/**
 * Offloads zone-guarantee computation to a Web Worker so the main thread
 * stays responsive while the Dinic max-flow algorithm runs.
 */
export const useZoneGuarantees = (
  standings: TeamStanding[],
  matches: Match[],
  predictions: PredictionsStore,
  zones: ZoneDefinition[],
): Map<number, boolean> => {
  const [result, setResult] = useState<Map<number, boolean>>(EMPTY_MAP);
  const activeRequestId = useRef(-1);

  useEffect(() => {
    const id = ++nextRequestId;
    activeRequestId.current = id;

    const w = getWorker();

    const handler = (event: MessageEvent<ZoneGuaranteesResponse>) => {
      if (event.data.requestId !== id) return;
      const map = new Map<number, boolean>();
      for (const [teamId, guaranteed] of Object.entries(event.data.result)) {
        map.set(Number(teamId), guaranteed);
      }
      setResult(map);
    };

    w.addEventListener('message', handler);
    w.postMessage({ requestId: id, standings, matches, predictions, zones });

    return () => {
      w.removeEventListener('message', handler);
    };
  }, [standings, matches, predictions, zones]);

  return result;
};
