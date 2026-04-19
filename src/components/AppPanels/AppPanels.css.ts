import { style } from '@vanilla-extract/css';
import { getDesignTokens } from '@kapowaz/design-tokens';
import { colorLoadingProgress } from '../../theme.css';

const { spacing } = getDesignTokens();

export const main = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(640px, 1fr) minmax(360px, 1fr)',
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

const mobileBreakpoint = 'screen and (max-width: 1024px)';

export const mobileTabBar = style({
  display: 'none',
  '@media': {
    [mobileBreakpoint]: {
      display: 'flex',
      width: '100%',
      maxWidth: '1400px',
      margin: `0 auto ${spacing.lg}`,
      position: 'sticky',
      left: 0,
    },
    'screen and (max-width: 680px)': {
      marginBottom: 0,
    },
  },
});

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

export const loadingArea = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  color: colorLoadingProgress,
});
