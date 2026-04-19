import { useCallback, useEffect, useRef } from 'react';

import { useLiveScoresStore } from '../state/liveScoresStore';
import type { LiveScore, LiveScoresData } from '../types';

const POLL_INTERVAL_MS = 60_000;

interface UseLiveScoresResult {
  /** Live scores keyed by match ID string, or null if unavailable. */
  liveScores: Record<string, LiveScore> | null;
  /** ISO timestamp of the last successful fetch. */
  lastUpdated: string | null;
  /** Whether any live (non-FINISHED) matches exist in the data. */
  hasLiveMatches: boolean;
}

const fetchLiveScores = async (
  slug: string,
): Promise<LiveScoresData | null> => {
  const url = new URL(
    `${import.meta.env.BASE_URL}live-scores/${slug}.json`,
    window.location.origin,
  );
  url.searchParams.set('t', String(Date.now()));

  try {
    const response = await fetch(url.toString());
    if (!response.ok) return null;
    return (await response.json()) as LiveScoresData;
  } catch {
    return null;
  }
};

export const useLiveScores = (slug: string): UseLiveScoresResult => {
  const data = useLiveScoresStore((state) => state.scores[slug] ?? null);
  const setScores = useLiveScoresStore((state) => state.setScores);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const poll = useCallback(async () => {
    const result = await fetchLiveScores(slug);
    if (result) {
      setScores(slug, result);
    }
  }, [slug, setScores]);

  useEffect(() => {
    poll();

    const startPolling = () => {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
    };

    const stopPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        poll();
        startPolling();
      } else {
        stopPolling();
      }
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [poll]);

  const liveScores = data?.scores ?? null;
  const lastUpdated = data?.lastUpdated ?? null;
  const hasLiveMatches = liveScores
    ? Object.values(liveScores).some((s) => s.status !== 'FINISHED')
    : false;

  return { liveScores, lastUpdated, hasLiveMatches };
};
