import { style } from '@vanilla-extract/css';
import {
  colorTextSecondary,
  colorSuccess,
  colorBorder,
  fontSizeSm,
  fontSizeBase,
  space2,
  space3,
  space6,
  space12,
} from '../../theme.css';

export const container = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: space6,
  overflow: 'auto',
  maxHeight: 'calc(100vh - 140px)',
});

export const dateGroup = style({
  display: 'flex',
  flexDirection: 'column',
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
  borderBottomStyle: 'solid',
  borderBottomWidth: '1px',
  borderBottomColor: colorBorder,
  padding: `0 0 ${space2} 0`,
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

export const matchesList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space2,
  paddingTop: space3,
});

export const emptyState = style({
  textAlign: 'center',
  padding: `${space12} ${space6}`,
  color: colorTextSecondary,
  fontSize: fontSizeBase,
});
