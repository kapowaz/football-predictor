import { createVar, globalStyle } from '@vanilla-extract/css';
import { getDesignTokens } from '@kapowaz/design-tokens';

const { colors } = getDesignTokens();

export const colorBgPage = createVar();

export const colorTextPrimary = createVar();
export const colorTextHeading = createVar();
export const colorTextSecondary = createVar();
export const colorTextMuted = createVar();
export const colorTextHover = createVar();

export const colorLoadingProgress = createVar();

export const fontSizeXs = createVar();
export const fontSizeSm = createVar();
export const fontSizeLg = createVar();
export const fontSizeXl = createVar();
export const fontSizeXxl = createVar();

export const space1 = createVar();
export const space2 = createVar();
export const space3 = createVar();
export const space4 = createVar();
export const space6 = createVar();

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
    [fontSizeXs]: '11px',
    [fontSizeSm]: '12px',
    [fontSizeLg]: '18px',
    [fontSizeXl]: '22px',
    [fontSizeXxl]: '28px',

    [space1]: '4px',
    [space2]: '8px',
    [space3]: '12px',
    [space4]: '16px',
    [space6]: '24px',

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
