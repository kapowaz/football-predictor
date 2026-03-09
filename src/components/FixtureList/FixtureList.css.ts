import { style } from '@vanilla-extract/css';
import {
  colorTextSecondary,
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
  flex: 1,
  minHeight: 0,
});

export const dateGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space2,
});

export const fixturesWrapper = style({
  display: 'grid',
  gridTemplateRows: '0fr',
  opacity: 0,
  pointerEvents: 'none',
  transition: 'grid-template-rows 0.25s ease-in-out, opacity 0.25s ease-in-out',
});

export const fixturesWrapperExpanded = style({
  gridTemplateRows: '1fr',
  opacity: 1,
  pointerEvents: 'auto',
});

export const fixturesList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space2,
  overflow: 'hidden',
  minHeight: 0,
  padding: space1,
});

export const emptyState = style({
  textAlign: 'center',
  padding: `${space12} ${space6}`,
  color: colorTextSecondary,
  fontSize: fontSizeBase,
});
