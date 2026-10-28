import { createVar, style } from '@vanilla-extract/css';
import {
  cssVariablesByColorMode,
  getDesignTokens,
} from '@kapowaz/design-tokens';

const { spacing } = getDesignTokens();

// Shows the text logo drawn for the current colour mode's background.
const lightLogoDisplay = createVar('app-heading-light-logo-display');
const darkLogoDisplay = createVar('app-heading-dark-logo-display');

cssVariablesByColorMode({
  light: {
    [lightLogoDisplay]: 'block',
    [darkLogoDisplay]: 'none',
  },
  dark: {
    [lightLogoDisplay]: 'none',
    [darkLogoDisplay]: 'block',
  },
});

// minWidth lets the heading give up width to the header controls on narrow
// screens, where the logo then scales down instead of pushing them off-screen.
export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: spacing.sm,
  minWidth: 0,
});

export const mark = style({
  height: '32px',
  width: '32px',
});

export const title = style({
  margin: 0,
  minWidth: 0,
  lineHeight: 0,
});

const logo = style({
  height: '48px',
  width: 'auto',
  maxWidth: '100%',
  objectFit: 'contain',
  objectPosition: 'left center',
});

export const logoLight = style([logo, { display: lightLogoDisplay }]);

export const logoDark = style([logo, { display: darkLogoDisplay }]);

export const extraContent = style({
  flex: 1,
});
