import { createVar, style, styleVariants } from '@vanilla-extract/css';
import {
  cssVariablesByColorMode,
  getDesignTokens,
} from '@kapowaz/design-tokens';

const { spacing } = getDesignTokens();

// Shows the lockup drawn for the current colour mode's background.
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

export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: spacing.sm,
});

export const mark = style({
  height: '32px',
  width: '32px',
});

export const title = style({
  margin: 0,
  lineHeight: 0,
});

const logoHeights = {
  default: '32px',
  full: '48px',
};

const logo = style({
  width: 'auto',
});

export const logoLight = styleVariants(logoHeights, (height) => [
  logo,
  { display: lightLogoDisplay, height },
]);

export const logoDark = styleVariants(logoHeights, (height) => [
  logo,
  { display: darkLogoDisplay, height },
]);

export const extraContent = style({
  flex: 1,
});
