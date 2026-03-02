import { style } from '@vanilla-extract/css';
import {
  colorTextSecondary,
  colorSuccess,
  colorNeutral,
  colorNeutralLight,
  fontSizeSm,
  fontSizeBase,
  space1,
  space2,
  space4,
  space6,
  space12,
} from '../../theme.css';

export const container = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: space4,
  overflow: 'auto',
  maxHeight: 'calc(100vh - 140px)',
});

export const dateGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space2,
});

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
});

export const dateHeaderComplete = style({
  color: colorSuccess,
});

export const chevron = style({
  width: '16px',
  height: '16px',
  flexShrink: 0,
  transition: 'transform 0.2s ease',
});

export const chevronExpanded = style({
  transform: 'rotate(90deg)',
});

export const matchesWrapper = style({
  display: 'grid',
  gridTemplateRows: '0fr',
  opacity: 0,
  transition: 'grid-template-rows 0.25s ease-in-out, opacity 0.25s ease-in-out',
});

export const matchesWrapperExpanded = style({
  gridTemplateRows: '1fr',
  opacity: 1,
});

export const matchesList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space2,
  overflow: 'hidden',
  minHeight: 0,
});

export const fixtureIndicators = style({
  display: 'flex',
  alignItems: 'center',
  gap: space1,
  marginLeft: 'auto',
});

export const fixtureCircle = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: colorNeutralLight,
  flexShrink: 0,
});

export const fixtureCirclePredicted = style({
  backgroundColor: colorNeutral,
});

export const emptyState = style({
  textAlign: 'center',
  padding: `${space12} ${space6}`,
  color: colorTextSecondary,
  fontSize: fontSizeBase,
});
