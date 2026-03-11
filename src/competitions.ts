import eflChampionshipLogo from './assets/efl-championship-logo.svg';
import eflLeagueOneLogo from './assets/efl-league-one-logo.svg';
import eflLeagueTwoLogo from './assets/efl-league-two-logo.svg';
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

/**
 * Slugs of competitions that have data available and should be shown in the UI.
 * Edit src/enabled-competitions.json to control which competitions are active.
 */
import ENABLED_COMPETITION_SLUGS from './enabled-competitions.json';
export { ENABLED_COMPETITION_SLUGS };

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
    logo: eflChampionshipLogo,
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
  'efl-league-one': {
    slug: 'efl-league-one',
    name: 'EFL League One',
    fullTitle: 'EFL League One 2025/26 Predictions',
    season: '2025/26',
    teamCount: 24,
    footballDataCode: 'EL1',
    fotmobLeagueId: 108,
    logo: eflLeagueOneLogo,
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
        startPosition: 21,
        endPosition: 24,
        emoji: '⬇️',
        label: 'Relegated',
      },
    ],
  },
  'efl-league-two': {
    slug: 'efl-league-two',
    name: 'EFL League Two',
    fullTitle: 'EFL League Two 2025/26 Predictions',
    season: '2025/26',
    teamCount: 24,
    footballDataCode: 'EL2',
    fotmobLeagueId: 109,
    logo: eflLeagueTwoLogo,
    zones: [
      {
        name: 'Promotion',
        type: 'promotion',
        startPosition: 1,
        endPosition: 3,
        emoji: '⬆️',
        label: 'Promoted',
      },
      {
        name: 'Playoffs',
        type: 'playoff',
        startPosition: 4,
        endPosition: 7,
        emoji: '🔀',
        label: 'Playoffs',
      },
      {
        name: 'Relegation',
        type: 'relegation',
        startPosition: 23,
        endPosition: 24,
        emoji: '⬇️',
        label: 'Relegated',
      },
    ],
  },
};

export const DEFAULT_COMPETITION = 'premier-league';
export const LEGACY_COMPETITION = 'efl-championship';

export const getCompetition = (slug: string): CompetitionConfig | undefined => {
  if (!ENABLED_COMPETITION_SLUGS.includes(slug)) return undefined;
  return COMPETITIONS[slug];
};

export const allCompetitions = (): CompetitionConfig[] =>
  ENABLED_COMPETITION_SLUGS.map((slug) => COMPETITIONS[slug]).filter(Boolean);
