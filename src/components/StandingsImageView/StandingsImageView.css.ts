import { createVar, fallbackVar, style } from '@vanilla-extract/css';
import {
  cssVariablesByColorMode,
  customTokensByColorMode,
  getDesignTokens,
} from '@kapowaz/design-tokens';
import { standingsTableTokens } from '@kapowaz/football';

const { colors, spacing } = getDesignTokens();

// The image is 1.91:1 and wider than the 820px layout, so widen the stats and
// form columns proportionally instead of leaving the extra width to the team
// column. Widths don't change with colour mode.
const tableColumnWidths = {
  [standingsTableTokens.renderStatColumnWidth]: '6%',
  [standingsTableTokens.renderFormColumnWidth]: '16%',
};

/** customTokens for the StandingsTable inside the image. */
export const standingsTableTokensOverride = customTokensByColorMode({
  light: tableColumnWidths,
  dark: tableColumnWidths,
});

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

/** Set by StandingsImagePair once both halves are measured. */
export const imageWidth = createVar('standings-image-width');
export const imageHeight = createVar('standings-image-height');

// 820px is the natural layout width the halves are measured at.
export const outerWrapper = style({
  width: fallbackVar(imageWidth, '820px'),
  height: fallbackVar(imageHeight, 'auto'),
});

// The background lives here, not on innerWrapper, so the padding that evens
// out the two halves' heights is page-coloured too.
export const captureSurface = style({
  width: '100%',
  height: '100%',
  minWidth: 0,
  backgroundColor: colorBgPage,
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
