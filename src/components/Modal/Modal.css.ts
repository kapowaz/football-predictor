import { createVar, style } from '@vanilla-extract/css';
import { cssVariablesByColorMode, getDesignTokens } from '@kapowaz/design-tokens';

const { colors, spacing, borderRadius, shadow } = getDesignTokens();

const colorBgBackdrop = createVar('modal-bg-backdrop');
const colorBgModal = createVar('modal-bg-modal');

cssVariablesByColorMode({
  light: {
    [colorBgBackdrop]: `color-mix(in oklch, ${colors.black}, transparent 50%)`,
    [colorBgModal]: colors.white,
  },
  dark: {
    [colorBgBackdrop]: `color-mix(in oklch, ${colors.black}, transparent 40%)`,
    [colorBgModal]: colors.ink[900],
  },
});

export const overlay = style({
  zIndex: 1,
});

export const backdrop = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: colorBgBackdrop,
  '@media': {
    'screen and (max-width: 680px)': {
      padding: `0 ${spacing.xl}`,
    },
    'screen and (max-width: 550px)': {
      padding: `0 ${spacing.md}`,
    },
  },
});

export const panel = style({
  backgroundColor: colorBgModal,
  borderRadius: borderRadius.lg,
  boxShadow: shadow.lg,
  padding: spacing.xxl,
  width: '90vw',
  position: 'relative',
  outline: 'none',
  '@media': {
    'screen and (max-width: 550px)': {
      padding: `${spacing.lg} ${spacing.md}`,
    },
  },
});
