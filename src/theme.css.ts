import { createVar, globalStyle } from '@vanilla-extract/css';
import { getDesignTokens } from '@kapowaz/design-tokens';

const { colors } = getDesignTokens();

const FONT_FAMILY_UI =
  "'Rubik Variable', 'Rubik', system-ui, -apple-system, 'BlinkMacSystemFont', 'Segoe UI', sans-serif";

export const colorBgPage = createVar();

export const colorTextPrimary = createVar();
export const colorTextHeading = createVar();
export const colorTextSecondary = createVar();
export const colorTextMuted = createVar();
export const colorTextHover = createVar();

export const colorLoadingProgress = createVar();

export const maxWidthContent = createVar();

const lightColorVars = {
  [colorBgPage]: colors.gray[100],
  [colorTextPrimary]: colors.gray[800],
  [colorTextHeading]: colors.gray[900],
  [colorTextSecondary]: colors.gray[500],
  [colorTextMuted]: colors.neutral[500],
  [colorTextHover]: colors.gray[700],
  [colorLoadingProgress]: colors.blue[600],
};

globalStyle(':root', {
  vars: {
    ...lightColorVars,
    [maxWidthContent]: '1400px',
  },
});

const darkVars = {
  [colorBgPage]: colors.ink[950],
  [colorTextPrimary]: colors.ink[200],
  [colorTextHeading]: colors.ink[300],
  [colorTextSecondary]: colors.ink[500],
  [colorTextMuted]: colors.ink[600],
  [colorTextHover]: colors.ink[300],
  [colorLoadingProgress]: colors.blue[400],
};

globalStyle(':root', {
  '@media': {
    '(prefers-color-scheme: dark)': {
      vars: darkVars,
    },
  },
});

globalStyle(':root[data-color-mode="light"]', {
  vars: lightColorVars,
});

globalStyle(':root[data-color-mode="dark"]', {
  vars: darkVars,
});

// Override the design-tokens UI font family with Rubik.
// Uses the raw CSS property name since --font-family-ui is defined by the
// design-tokens package, not by a local createVar().
globalStyle(':root', {
  '--font-family-ui': FONT_FAMILY_UI,
} as Record<string, string>);
