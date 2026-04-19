import { style } from '@vanilla-extract/css';
import { getDesignTokens } from '@kapowaz/design-tokens';

import {
  colorTextHeading,
  colorTextHover,
  colorTextMuted,
  colorTextSecondary,
  maxWidthContent,
} from '../../theme.css';

const { spacing, typography } = getDesignTokens();
const { fontSize } = typography;

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  maxWidth: maxWidthContent,
  width: '100%',
  margin: '0 auto',
  gap: spacing.lg,
  overflow: 'hidden',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  gap: spacing.md,
  '@media': {
    'screen and (max-width: 680px)': {
      padding: `${spacing.md} ${spacing.lg}`,
    },
  },
});

export const headerLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: spacing.md,
});

export const title = style({
  fontFamily: typography.fontFamily.ui,
  fontSize: fontSize.ui.xl,
  fontWeight: 700,
  color: colorTextHeading,
  margin: 0,
  '@media': {
    'screen and (min-width: 680px)': {
      fontSize: fontSize.ui.xxl,
    },
  },
});

export const descriptionBlock = style({
  flexShrink: 0,
  '@media': {
    'screen and (max-width: 680px)': {
      padding: `0 ${spacing.lg}`,
    },
  },
});

export const descriptionToggle = style({
  display: 'flex',
  alignItems: 'center',
  gap: spacing.sm,
  fontFamily: 'inherit',
  fontSize: fontSize.ui.sm,
  fontWeight: 600,
  color: colorTextSecondary,
  cursor: 'pointer',
  userSelect: 'none',
  background: 'none',
  border: 'none',
  padding: `${spacing.xs} 0`,
  textAlign: 'left',
  transition: 'color 0.2s ease-in-out',
  selectors: {
    '&:hover': {
      color: colorTextHover,
    },
  },
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

export const descriptionContent = style({
  display: 'grid',
  gridTemplateRows: '0fr',
  opacity: 0,
  transition: 'grid-template-rows 0.25s ease-in-out, opacity 0.25s ease-in-out',
});

export const descriptionContentExpanded = style({
  gridTemplateRows: '1fr',
  opacity: 1,
});

export const descriptionInner = style({
  overflow: 'hidden',
  minHeight: 0,
});

export const description = style({
  color: colorTextSecondary,
  fontSize: fontSize.ui.sm,
  lineHeight: 1.6,
  margin: `${spacing.sm} 0 0`,
});

export const componentList = style({
  color: colorTextSecondary,
  fontSize: fontSize.ui.sm,
  lineHeight: 1.6,
  margin: `${spacing.sm} 0 0`,
  paddingLeft: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.xs,
});

export const formula = style({
  display: 'block',
  fontFamily:
    'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace',
  fontSize: fontSize.ui.xs,
  color: colorTextMuted,
  marginTop: spacing.xs,
});

export const tableWrapper = style({
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
  '@media': {
    'screen and (max-width: 680px)': {
      padding: `0 0 ${spacing.xxl}`,
    },
  },
});

export const loading = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});
