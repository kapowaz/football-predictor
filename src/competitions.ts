import eflLogo from './assets/efl-championship-logo.svg';
import plLogo from './assets/premier-league-logo.svg';

export type ZoneType =
  | 'champions'
  | 'promotion'
  | 'playoff'
  | 'championsLeague'
  | 'europaLeague'
  | 'conferenceLeague'
  | 'relegation';

export interface ZoneDefinition {
  name: string;
  type: ZoneType;
  startPosition: number;
  endPosition: number;
  emoji: string;
  label: string;
}

export interface CompetitionConfig {
  slug: string;
  name: string;
  fullTitle: string;
  season: string;
  teamCount: number;
  footballDataCode: string;
  fotmobLeagueId: number;
  logo: string;
  zones: ZoneDefinition[];
}

export const COMPETITIONS: Record<string, CompetitionConfig> = {
  'premier-league': {
    slug: 'premier-league',
    name: 'Premier League',
    fullTitle: 'Premier League 2025/26 Predictions',
    season: '2025/26',
    teamCount: 20,
    footballDataCode: 'PL',
    fotmobLeagueId: 47,
    logo: plLogo,
    zones: [
      {
        name: 'Champions',
        type: 'champions',
        startPosition: 1,
        endPosition: 1,
        emoji: '🏆',
        label: 'Champions',
      },
      {
        name: 'Champions League',
        type: 'championsLeague',
        startPosition: 2,
        endPosition: 5,
        emoji: '🏅',
        label: 'Champions League',
      },
      {
        name: 'Europa League',
        type: 'europaLeague',
        startPosition: 6,
        endPosition: 6,
        emoji: '🥈',
        label: 'Europa League',
      },
      {
        name: 'Conference League',
        type: 'conferenceLeague',
        startPosition: 7,
        endPosition: 7,
        emoji: '🥉',
        label: 'Conference League',
      },
      {
        name: 'Relegation',
        type: 'relegation',
        startPosition: 18,
        endPosition: 20,
        emoji: '⬇️',
        label: 'Relegated',
      },
    ],
  },
  'efl-championship': {
    slug: 'efl-championship',
    name: 'EFL Championship',
    fullTitle: 'EFL Championship 2025/26 Predictions',
    season: '2025/26',
    teamCount: 24,
    footballDataCode: 'ELC',
    fotmobLeagueId: 48,
    logo: eflLogo,
    zones: [
      {
        name: 'Promotion',
        type: 'promotion',
        startPosition: 1,
        endPosition: 2,
        emoji: '⬆️',
        label: 'Promoted',
      },
      {
        name: 'Playoffs',
        type: 'playoff',
        startPosition: 3,
        endPosition: 6,
        emoji: '🔀',
        label: 'Playoffs',
      },
      {
        name: 'Relegation',
        type: 'relegation',
        startPosition: 22,
        endPosition: 24,
        emoji: '⬇️',
        label: 'Relegated',
      },
    ],
  },
};

export const DEFAULT_COMPETITION = 'premier-league';
export const LEGACY_COMPETITION = 'efl-championship';

export const getCompetition = (slug: string): CompetitionConfig | undefined => COMPETITIONS[slug];

export const allCompetitions = (): CompetitionConfig[] => Object.values(COMPETITIONS);
