import { keyframes, style } from '@vanilla-extract/css';
import {
  colorBgFixtureCard,
  colorBgFixtureCardHighlight,
  colorTextPrimary,
  fontFamilyMono,
  fontSizeBase,
  space3,
  space4,
  radiusLg,
  shadowSm,
} from '../../theme.css';

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: space3,
  backgroundColor: colorBgFixtureCard,
  borderRadius: radiusLg,
  boxShadow: shadowSm,
  gap: '4px',
  containerType: 'inline-size',
  '@media': {
    '(min-width: 680px)': {
      padding: space4,
    },
  },
});

export const fixtureRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  gap: space3,
});

export const team = style({
  display: 'flex',
  alignItems: 'center',
  gap: space3,
  flex: 1,
});

export const teamInteractive = style({
  cursor: 'pointer',
});

export const homeTeam = style([
  team,
  {
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
]);

export const awayTeam = style([
  team,
  {
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
]);

export const crest = style({
  width: '24px',
  height: '24px',
  objectFit: 'contain',
  '@media': {
    '(min-width: 680px)': {
      width: '32px',
      height: '32px',
    },
  },
});

const teamNameBase = style({
  fontSize: fontSizeBase,
  fontWeight: 500,
  color: colorTextPrimary,
});

export const teamName = style([
  teamNameBase,
  {
    display: 'none',
    '@container': {
      '(min-width: 400px)': {
        display: 'block',
      },
    },
  },
]);

export const teamTla = style([
  teamNameBase,
  {
    display: 'block',
    '@container': {
      '(min-width: 400px)': {
        display: 'none',
      },
    },
  },
]);

export const finalScore = style({
  width: '112px',
  display: 'flex',
  justifyContent: 'center',
  textAlign: 'center',
  fontFamily: fontFamilyMono,
  fontSize: fontSizeBase,
  fontWeight: 700,
  color: colorTextPrimary,
});

const flashHighlight = keyframes({
  '0%': { backgroundColor: colorBgFixtureCard },
  '16.67%': { backgroundColor: colorBgFixtureCardHighlight },
  '33.33%': { backgroundColor: colorBgFixtureCard },
  '50%': { backgroundColor: colorBgFixtureCardHighlight },
  '66.67%': { backgroundColor: colorBgFixtureCard },
  '83.33%': { backgroundColor: colorBgFixtureCardHighlight },
  '100%': { backgroundColor: colorBgFixtureCard },
});

export const cardHighlighted = style({
  animation: `${flashHighlight} 1.4s ease-in-out`,
});
