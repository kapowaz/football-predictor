import { describe, it, expect } from 'vitest';
import type { Team, Match, PredictionsStore, PointDeduction } from '../types';
import { calculateStandings } from './standings';

const teamA: Team = { id: 1, fotmobId: 1, name: 'Alpha', shortName: 'Alpha', tla: 'ALP', crest: 'alpha' };
const teamB: Team = { id: 2, fotmobId: 2, name: 'Bravo', shortName: 'Bravo', tla: 'BRA', crest: 'bravo' };
const teamC: Team = { id: 3, fotmobId: 3, name: 'Charlie', shortName: 'Charlie', tla: 'CHA', crest: 'charlie' };

const teams = [teamA, teamB, teamC];
const emptyPredictions: PredictionsStore = { predictions: {}, lastModified: '' };

const finishedMatch = (
  id: number,
  homeTeamId: number,
  awayTeamId: number,
  homeGoals: number,
  awayGoals: number,
): Match => ({
  id,
  homeTeamId,
  awayTeamId,
  utcDate: '2025-01-01T15:00:00Z',
  status: 'FINISHED',
  homeGoals,
  awayGoals,
});

describe('calculateStandings', () => {
  describe('standard rules', () => {
    it('awards 3 points for a win regardless of margin', () => {
      const matches: Match[] = [
        finishedMatch(1, 1, 2, 3, 0),
        finishedMatch(2, 1, 3, 1, 0),
      ];

      const standings = calculateStandings(teams, matches, emptyPredictions);
      const alpha = standings.find((s) => s.team.id === 1)!;

      expect(alpha.won).toBe(2);
      expect(alpha.bonus).toBe(0);
      expect(alpha.points).toBe(6);
    });

    it('produces W form result for all wins', () => {
      const matches: Match[] = [
        finishedMatch(1, 1, 2, 3, 0),
        finishedMatch(2, 1, 3, 1, 0),
      ];

      const standings = calculateStandings(teams, matches, emptyPredictions);
      const alpha = standings.find((s) => s.team.id === 1)!;

      expect(alpha.form.every((e) => e.result === 'W')).toBe(true);
    });
  });

  describe('variant rules', () => {
    it('awards 3 points for a win by 2+ goals', () => {
      const matches: Match[] = [finishedMatch(1, 1, 2, 3, 1)];

      const standings = calculateStandings(teams, matches, emptyPredictions, [], 'new-rules');
      const alpha = standings.find((s) => s.team.id === 1)!;

      expect(alpha.won).toBe(1);
      expect(alpha.bonus).toBe(1);
      expect(alpha.points).toBe(3);
    });

    it('awards 2 points for a win by exactly 1 goal', () => {
      const matches: Match[] = [finishedMatch(1, 1, 2, 1, 0)];

      const standings = calculateStandings(teams, matches, emptyPredictions, [], 'new-rules');
      const alpha = standings.find((s) => s.team.id === 1)!;

      expect(alpha.won).toBe(1);
      expect(alpha.bonus).toBe(0);
      expect(alpha.points).toBe(2);
    });

    it('awards 1 point for a draw', () => {
      const matches: Match[] = [finishedMatch(1, 1, 2, 1, 1)];

      const standings = calculateStandings(teams, matches, emptyPredictions, [], 'new-rules');
      const alpha = standings.find((s) => s.team.id === 1)!;

      expect(alpha.drawn).toBe(1);
      expect(alpha.points).toBe(1);
    });

    it('awards 0 points for a loss', () => {
      const matches: Match[] = [finishedMatch(1, 1, 2, 0, 3)];

      const standings = calculateStandings(teams, matches, emptyPredictions, [], 'new-rules');
      const alpha = standings.find((s) => s.team.id === 1)!;

      expect(alpha.lost).toBe(1);
      expect(alpha.points).toBe(0);
    });

    it('produces B form result for 2+ goal wins', () => {
      const matches: Match[] = [finishedMatch(1, 1, 2, 4, 1)];

      const standings = calculateStandings(teams, matches, emptyPredictions, [], 'new-rules');
      const alpha = standings.find((s) => s.team.id === 1)!;

      expect(alpha.form[0].result).toBe('B');
    });

    it('produces W form result for 1-goal wins', () => {
      const matches: Match[] = [finishedMatch(1, 1, 2, 2, 1)];

      const standings = calculateStandings(teams, matches, emptyPredictions, [], 'new-rules');
      const alpha = standings.find((s) => s.team.id === 1)!;

      expect(alpha.form[0].result).toBe('W');
    });

    it('applies bonus correctly for the away team', () => {
      const matches: Match[] = [finishedMatch(1, 1, 2, 0, 3)];

      const standings = calculateStandings(teams, matches, emptyPredictions, [], 'new-rules');
      const bravo = standings.find((s) => s.team.id === 2)!;

      expect(bravo.won).toBe(1);
      expect(bravo.bonus).toBe(1);
      expect(bravo.points).toBe(3);
      expect(bravo.form[0].result).toBe('B');
    });

    it('gives away team only 2 points for a 1-goal win', () => {
      const matches: Match[] = [finishedMatch(1, 1, 2, 0, 1)];

      const standings = calculateStandings(teams, matches, emptyPredictions, [], 'new-rules');
      const bravo = standings.find((s) => s.team.id === 2)!;

      expect(bravo.won).toBe(1);
      expect(bravo.bonus).toBe(0);
      expect(bravo.points).toBe(2);
      expect(bravo.form[0].result).toBe('W');
    });

    it('sorts by points under variant rules', () => {
      const matches: Match[] = [
        finishedMatch(1, 1, 2, 3, 0),
        finishedMatch(2, 3, 2, 1, 0),
      ];

      const standings = calculateStandings(teams, matches, emptyPredictions, [], 'new-rules');

      expect(standings[0].team.id).toBe(1);
      expect(standings[0].points).toBe(3);
      expect(standings[1].team.id).toBe(3);
      expect(standings[1].points).toBe(2);
    });

    it('correctly handles deductions with variant rules', () => {
      const matches: Match[] = [finishedMatch(1, 1, 2, 3, 0)];
      const deductions: PointDeduction[] = [{ teamId: 1, amount: 2 }];

      const standings = calculateStandings(teams, matches, emptyPredictions, deductions, 'new-rules');
      const alpha = standings.find((s) => s.team.id === 1)!;

      expect(alpha.points).toBe(1);
      expect(alpha.deduction).toBe(2);
    });

    it('correctly handles predictions under variant rules', () => {
      const matches: Match[] = [
        {
          id: 1,
          homeTeamId: 1,
          awayTeamId: 2,
          utcDate: '2025-04-10T15:00:00Z',
          status: 'SCHEDULED',
          homeGoals: null,
          awayGoals: null,
        },
      ];
      const predictions: PredictionsStore = {
        predictions: { '1': { homeGoals: 4, awayGoals: 0 } },
        lastModified: '',
      };

      const standings = calculateStandings(teams, matches, predictions, [], 'new-rules');
      const alpha = standings.find((s) => s.team.id === 1)!;

      expect(alpha.bonus).toBe(1);
      expect(alpha.points).toBe(3);
      expect(alpha.form[0].result).toBe('B');
      expect(alpha.form[0].isPrediction).toBe(true);
    });
  });
});
