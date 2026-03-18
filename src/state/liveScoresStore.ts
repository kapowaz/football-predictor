import { create } from 'zustand';
import type { LiveScoresData } from '../types';

interface LiveScoresStoreState {
  /** Per-slug live score data, or null if not yet fetched / no data available. */
  scores: Record<string, LiveScoresData | null>;
  setScores: (slug: string, data: LiveScoresData) => void;
  clearScores: (slug: string) => void;
}

export const useLiveScoresStore = create<LiveScoresStoreState>((set) => ({
  scores: {},

  setScores: (slug, data) => {
    set((state) => ({
      scores: { ...state.scores, [slug]: data },
    }));
  },

  clearScores: (slug) => {
    set((state) => ({
      scores: { ...state.scores, [slug]: null },
    }));
  },
}));
