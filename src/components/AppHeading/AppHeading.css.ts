import { createVar, style } from '@vanilla-extract/css';
import {
  cssVariablesByColorMode,
  getDesignTokens,
} from '@kapowaz/design-tokens';

const { colors, spacing, typography } = getDesignTokens();

const colorTextHeading = createVar('app-heading-text-heading');

cssVariablesByColorMode({
  light: {
    [colorTextHeading]: colors.gray[900],
  },
  dark: {
    [colorTextHeading]: colors.ink[300],
  },
});

export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: spacing.sm,
});

export const logo = style({
  height: '32px',
  width: '32px',
});

export const title = style({
  fontFamily: typography.fontFamily.ui,
  fontStretch: '75%',
  textTransform: 'uppercase',
  color: colorTextHeading,
  margin: 0,
  whiteSpace: 'nowrap',
});

export const extraContent = style({
  flex: 1,
});
