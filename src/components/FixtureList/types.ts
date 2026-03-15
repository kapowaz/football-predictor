import type { Match, Team } from '../../types';

/** Determines how fixtures are grouped within a FixtureList. */
export type GroupBy = 'date' | 'team';

/** A single group of fixtures for rendering in a FixtureList. */
export interface FixtureGroupData {
  /** Unique key for this group (ISO date string for date groups, stringified team ID for team groups). */
  key: string;
  /** Human-readable label for the group header (e.g. "Monday 9 March" or "Arsenal"). */
  label: string;
  /** Matches belonging to this group. */
  matches: Match[];
  /** Whether every match in this group has a prediction or result. */
  allPredicted: boolean;
  /** The team this group represents; present only when groupBy is 'team'. */
  team?: Team;
}
