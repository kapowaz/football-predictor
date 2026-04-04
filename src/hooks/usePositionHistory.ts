import { useEffect, useRef, useState } from 'react';
import type { Team, Match, PredictionsStore, PointDeduction, VariantRulesMode } from '../types';
import type { PositionHistoryResponse } from '../workers/positionHistory.worker';

let worker: Worker | null = null;
let nextRequestId = 0;

const getWorker = (): Worker => {
  if (!worker) {
    worker = new Worker(
      new URL('../workers/positionHistory.worker.ts', import.meta.url),
      { type: 'module' },
    );
  }
  return worker;
};

const EMPTY_MAP = new Map<number, number[]>();

/**
 * Offloads position history computation to a Web Worker so the main thread
 * stays responsive while iterating through all rounds.
 */
export const usePositionHistory = (
  teams: Team[],
  matches: Match[],
  predictions: PredictionsStore,
  deductions: PointDeduction[],
  variantRules: VariantRulesMode = false,
): Map<number, number[]> => {
  const [result, setResult] = useState<Map<number, number[]>>(EMPTY_MAP);
  const activeRequestId = useRef(-1);

  useEffect(() => {
    const id = ++nextRequestId;
    activeRequestId.current = id;

    const w = getWorker();

    const handler = (event: MessageEvent<PositionHistoryResponse>) => {
      if (event.data.requestId !== id) return;
      const map = new Map<number, number[]>();
      for (const [teamId, positions] of Object.entries(event.data.result)) {
        map.set(Number(teamId), positions);
      }
      setResult(map);
    };

    w.addEventListener('message', handler);
    w.postMessage({ requestId: id, teams, matches, predictions, deductions, variantRules });

    return () => {
      w.removeEventListener('message', handler);
    };
  }, [teams, matches, predictions, deductions, variantRules]);

  return result;
};
