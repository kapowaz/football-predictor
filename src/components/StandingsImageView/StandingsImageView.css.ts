import { createVar, style } from '@vanilla-extract/css';
import {
  cssVariablesByColorMode,
  getDesignTokens,
} from '@kapowaz/design-tokens';

const { colors, spacing } = getDesignTokens();

const colorBgPage = createVar('standings-image-bg-page');
const colorTextHeading = createVar('standings-image-text-heading');
const colorTextSecondary = createVar('standings-image-text-secondary');
const colorIconFaded = createVar('standings-image-icon-faded');

cssVariablesByColorMode({
  light: {
    [colorBgPage]: colors.gray[100],
    [colorTextHeading]: colors.gray[900],
    [colorTextSecondary]: colors.gray[500],
    [colorIconFaded]: colors.neutral[300],
  },
  dark: {
    [colorBgPage]: colors.ink[950],
    [colorTextHeading]: colors.ink[300],
    [colorTextSecondary]: colors.ink[500],
    [colorIconFaded]: colors.ink[800],
  },
});

export const hiddenCaptureRoot = style({
  position: 'fixed',
  left: '-10000px',
  top: 0,
  pointerEvents: 'none',
  zIndex: -1,
});

export const outerWrapper = style({
  width: '820px',
});

export const captureSurface = style({
  width: '100%',
  minWidth: 0,
});

export const innerWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.lg,
  padding: spacing.lg,
  backgroundColor: colorBgPage,
});

export const innerWrapperTop = style({
  paddingBottom: 0,
});

export const innerWrapperBottom = style({
  paddingTop: 0,
});

export const headingExtraContent = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'center',
});

export const competitionLabel = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing.sm,
  color: colorTextHeading,
});

export const competitionLogo = style({
  width: '24px',
  height: '24px',
  objectFit: 'contain',
  flexShrink: 0,
});

export const deductionNotes = style({
  display: 'flex',
  gap: spacing.md,
  color: colorTextSecondary,
});

export const deductionNote = style({
  cursor: 'help',
});

export const footerContainer = style({
  display: 'flex',
  alignItems: 'flex-start',
  height: 'calc(45px + 48px)',
});

export const footer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  width: '100%',
  gap: spacing.lg,
  color: colorTextSecondary,
});

export const footerIcon = style({
  flexShrink: 0,
});

export const footerIconContainer = style({
  color: colorIconFaded,
});

export const footerBold = style({
  fontWeight: 500,
});
