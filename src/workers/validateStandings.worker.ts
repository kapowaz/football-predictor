import type { Team, Match, PointDeduction, ApiStandingsData } from '../types';
import { calculateStandings } from '../utils/standings';
import { validateStandings } from '../utils/validateStandings';

export interface ValidateStandingsRequest {
  requestId: number;
  teams: Team[];
  matches: Match[];
  defaultDeductions: PointDeduction[];
  apiStandings: ApiStandingsData;
}

export interface ValidateStandingsResponse {
  requestId: number;
  logs: { level: 'log' | 'warn'; args: string[] }[];
}

self.addEventListener(
  'message',
  (event: MessageEvent<ValidateStandingsRequest>) => {
    const { requestId, teams, matches, defaultDeductions, apiStandings } =
      event.data;

    // Capture console output
    const logs: ValidateStandingsResponse['logs'] = [];
    const origLog = console.log;
    const origWarn = console.warn;
    console.log = (...args: unknown[]) =>
      logs.push({ level: 'log', args: args.map(String) });
    console.warn = (...args: unknown[]) =>
      logs.push({ level: 'warn', args: args.map(String) });

    try {
      const emptyPredictions = { predictions: {}, lastModified: '' };
      const calculated = calculateStandings(
        teams,
        matches,
        emptyPredictions,
        defaultDeductions,
      );
      validateStandings(calculated, apiStandings);
    } finally {
      console.log = origLog;
      console.warn = origWarn;
    }

    const response: ValidateStandingsResponse = { requestId, logs };
    self.postMessage(response);
  },
);
