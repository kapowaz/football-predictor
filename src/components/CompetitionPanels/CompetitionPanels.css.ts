import { createVar, style } from '@vanilla-extract/css';
import { cssVariablesByColorMode, getDesignTokens } from '@kapowaz/design-tokens';

const { colors, spacing } = getDesignTokens();

const colorTextSecondary = createVar('competition-panels-text-secondary');

cssVariablesByColorMode({
  light: {
    [colorTextSecondary]: colors.gray[500],
  },
  dark: {
    [colorTextSecondary]: colors.ink[500],
  },
});

export const main = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(640px, 1fr) 1fr',
  gap: spacing.lg,
  maxWidth: '1400px',
  width: '100%',
  margin: '0 auto',
  flex: 1,
  minHeight: 0,
  '@media': {
    'screen and (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
  minHeight: 0,
  '@media': {
    'screen and (max-width: 680px)': {
      overflow: 'hidden',
    },
  },
});

export const panelGuttered = style([
  panel,
  {
    padding: `0 ${spacing.sm}`,
    '@media': {
      'screen and (min-width: 480px)': {
        padding: `0 ${spacing.md}`,
      },
      'screen and (min-width: 680px)': {
        padding: 0,
      },
    },
  },
]);

export const deductionNotes = style({
  display: 'flex',
  gap: spacing.sm,
  padding: `${spacing.md} 0`,
  color: colorTextSecondary,
  '@media': {
    'screen and (max-width: 680px)': {
      padding: spacing.md,
    },
  },
});

export const deductionNote = style({
  cursor: 'help',
});

const mobileBreakpoint = 'screen and (max-width: 1024px)';

export const hiddenOnMobile = style({
  '@media': {
    [mobileBreakpoint]: {
      display: 'none',
    },
  },
});

export const pageContent = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
});
