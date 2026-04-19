import type {
  RankedClub,
  ScoringWeights,
} from '../../data/all-time-rank/types';

export interface AllTimeRankTableProps {
  /** Ranked clubs to display, pre-sorted by composite score. */
  rankedClubs: RankedClub[];
  /** Current scoring weights (used for display context). */
  weights: ScoringWeights;
}
