import { style } from '@vanilla-extract/css';
import {
  colorTextSecondary,
  colorTextHover,
  colorTextActive,
  colorSuccess,
  colorDanger,
  colorNeutral,
  colorNeutralLight,
  fontSizeSm,
  space1,
  space2,
} from '../../theme.css';

export const dateHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: space2,
  fontFamily: 'inherit',
  fontSize: fontSizeSm,
  fontWeight: 600,
  color: colorTextSecondary,
  textTransform: 'uppercase',
  letterSpacing: '-0.02em',
  cursor: 'pointer',
  userSelect: 'none',
  background: 'none',
  border: 'none',
  padding: `${space1} 0`,
  width: '100%',
  textAlign: 'left',
  transition: 'color 0.2s ease-in-out',
  selectors: {
    '&:hover': {
      color: colorTextHover,
    },
  },
});

export const dateHeaderExpanded = style({
  color: colorTextActive,
  selectors: {
    '&:hover': {
      color: colorTextHover,
    },
  },
});

export const dateHeaderComplete = style({
  color: colorSuccess,
});

export const chevron = style({
  width: '16px',
  height: '16px',
  flexShrink: 0,
  transition: 'transform 0.2s ease, color 0.2s ease-in-out',
});

export const chevronExpanded = style({
  transform: 'rotate(90deg)',
});

export const fixtureIndicators = style({
  display: 'flex',
  alignItems: 'center',
  gap: space1,
  marginLeft: 'auto',
  paddingRight: space1,
});

export const fixtureCircle = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: colorNeutralLight,
  flexShrink: 0,
});

export const fixtureCircleHomeWin = style({
  backgroundColor: colorSuccess,
});

export const fixtureCircleAwayWin = style({
  backgroundColor: colorDanger,
});

export const fixtureCircleDraw = style({
  backgroundColor: colorNeutral,
});
