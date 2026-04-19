import { createVar, style } from '@vanilla-extract/css';
import {
  cssVariablesByColorMode,
  getDesignTokens,
} from '@kapowaz/design-tokens';

const { colors, spacing } = getDesignTokens();

const colorTextSecondary = createVar('fixture-list-text-secondary');

cssVariablesByColorMode({
  light: {
    [colorTextSecondary]: colors.gray[500],
  },
  dark: {
    [colorTextSecondary]: colors.ink[500],
  },
});

export const container = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
  overflow: 'auto',
  flex: 1,
  minHeight: 0,
});

export const dateGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.sm,
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
  gap: spacing.sm,
  overflow: 'hidden',
  minHeight: 0,
  padding: spacing.xs,
});

export const emptyState = style({
  textAlign: 'center',
  padding: `${spacing.xxl} ${spacing.lg}`,
  color: colorTextSecondary,
});
