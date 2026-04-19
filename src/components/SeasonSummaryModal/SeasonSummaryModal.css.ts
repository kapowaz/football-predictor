import { createVar, style, keyframes } from '@vanilla-extract/css';
import {
  cssVariablesByColorMode,
  getDesignTokens,
} from '@kapowaz/design-tokens';

const { colors, spacing } = getDesignTokens();

const colorTextHeading = createVar('season-summary-text-heading');
const colorTextPrimary = createVar('season-summary-text-primary');
const colorSuccess = createVar('season-summary-success');
const colorDanger = createVar('season-summary-danger');
const colorFocus = createVar('season-summary-focus');
const colorTextZoneChampions = createVar('season-summary-text-zone-champions');
const colorTextZoneChampionsLeague = createVar('season-summary-text-zone-cl');
const colorTextZoneEuropaLeague = createVar('season-summary-text-zone-el');
const colorTextZoneConferenceLeague = createVar('season-summary-text-zone-ecl');

cssVariablesByColorMode({
  light: {
    [colorTextHeading]: colors.gray[900],
    [colorTextPrimary]: colors.gray[800],
    [colorSuccess]: colors.green[600],
    [colorDanger]: colors.red[600],
    [colorFocus]: colors.blue[500],
    [colorTextZoneChampions]: colors.green[800],
    [colorTextZoneChampionsLeague]: colors.teal[900],
    [colorTextZoneEuropaLeague]: colors.cyan[900],
    [colorTextZoneConferenceLeague]: colors.sky[800],
  },
  dark: {
    [colorTextHeading]: colors.ink[300],
    [colorTextPrimary]: colors.ink[200],
    [colorSuccess]: colors.green[400],
    [colorDanger]: colors.red[400],
    [colorFocus]: colors.blue[500],
    [colorTextZoneChampions]: colors.green[300],
    [colorTextZoneChampionsLeague]: colors.teal[300],
    [colorTextZoneEuropaLeague]: colors.cyan[300],
    [colorTextZoneConferenceLeague]: colors.sky[300],
  },
});

export const modalHeading = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing.sm,
});

export const championHeading = style({
  color: colorTextHeading,
  textAlign: 'center',
  margin: `0 0 ${spacing.xl}`,
  lineHeight: 1.3,
});

export const competitionLogo = style({
  width: '24px',
  height: '24px',
  objectFit: 'contain',
  flexShrink: 0,
});

const shimmer = keyframes({
  '0%': { backgroundPosition: '200% center' },
  '100%': { backgroundPosition: '-200% center' },
});

export const championName = style({
  background:
    'linear-gradient(90deg, #d4af37, #f5d76e, #d4af37, #f5d76e, #d4af37)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${shimmer} 4s linear infinite`,
});

export const section = style({
  marginBottom: spacing.lg,
  selectors: {
    '&:last-child': {
      marginBottom: 0,
    },
  },
});

export const sectionLabel = style({
  marginBottom: spacing.sm,
});

export const promotedLabel = style([sectionLabel, { color: colorSuccess }]);

export const playoffsLabel = style([sectionLabel, { color: colorFocus }]);

export const relegatedLabel = style([sectionLabel, { color: colorDanger }]);

export const championsLabel = style([
  sectionLabel,
  { color: colorTextZoneChampions },
]);

export const championsLeagueLabel = style([
  sectionLabel,
  { color: colorTextZoneChampionsLeague },
]);

export const europaLeagueLabel = style([
  sectionLabel,
  { color: colorTextZoneEuropaLeague },
]);

export const conferenceLeagueLabel = style([
  sectionLabel,
  { color: colorTextZoneConferenceLeague },
]);

export const teamList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.sm,
});

export const teamListGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: spacing.sm,
  '@media': {
    '(max-width: 400px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const teamRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: spacing.md,
  color: colorTextPrimary,
});

export const badge = style({
  width: '24px',
  height: '24px',
  objectFit: 'contain',
  flexShrink: 0,
});

export const teamName = style({});
