import { style } from '@vanilla-extract/css';
import {
  colorBgSurface,
  colorTextPrimary,
  colorTextSecondary,
  fontSizeBase,
  fontSizeSm,
  space3,
  space4,
  radiusLg,
  shadowSm,
} from '../../theme.css';

export const card = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  padding: space3,
  backgroundColor: colorBgSurface,
  borderRadius: radiusLg,
  boxShadow: shadowSm,
  gap: space4,
  '@media': {
    '(min-width: 680px)': {
      padding: space4,
    },
  },
});

export const team = style({
  display: 'flex',
  alignItems: 'center',
  gap: space3,
  flex: 1,
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
    '@media': {
      '(min-width: 680px)': {
        display: 'block',
      },
    },
  },
]);

export const teamTla = style([
  teamNameBase,
  {
    display: 'block',
    '@media': {
      '(min-width: 680px)': {
        display: 'none',
      },
    },
  },
]);

export const kickoff = style({
  fontSize: fontSizeSm,
  color: colorTextSecondary,
  marginTop: '2px',
});

export const scoreSection = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});
