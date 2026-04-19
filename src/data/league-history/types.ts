import type { ZoneType } from '../competitions';

/** A zone within a historical division (e.g. promotion, relegation, playoffs). */
export interface HistoricalZone {
  /** The semantic type of this zone, shared with current-season CompetitionConfig. */
  type: ZoneType;
  /** Human-readable description for data review (e.g. "Promoted", "Relegated"). */
  label: string;
  /** First league position included in this zone (1-based). */
  startPosition: number;
  /** Last league position included in this zone (1-based). */
  endPosition: number;
}

/** A single division within a season (e.g. "First Division", "Third Division North"). */
export interface HistoricalDivision {
  /** Tier level 1-4, matching per-club data keys (tier1-tier4). */
  tier: 1 | 2 | 3 | 4;
  /** The competition name at the time (e.g. "First Division", "Premier League"). */
  name: string;
  /** Number of teams in this division for the season. */
  teamCount: number;
  /** Promotion, relegation, and playoff zones for this division. */
  zones: HistoricalZone[];
  /** Club badge slugs in final league position order. */
  teams: string[];
}

/** A complete snapshot of the English league pyramid for one season. */
export interface HistoricalSeason {
  /** End year of the season (e.g. 1889 for 1888-89), matching per-club convention. */
  year: number;
  /** Human-readable season label (e.g. "1888-89"). */
  season: string;
  /** The year of the next season, accounting for war-year gaps. */
  nextYear: number;
  /** All divisions active in this season (1-5 entries depending on era). */
  divisions: HistoricalDivision[];
}
