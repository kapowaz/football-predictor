import { style, globalStyle } from '@vanilla-extract/css';
import { getDesignTokens } from '@kapowaz/design-tokens';

import {
  colorBgPage,
  colorLoadingProgress,
  colorTextPrimary,
} from './theme.css';

const { spacing, typography } = getDesignTokens();

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
});

globalStyle('body', {
  margin: 0,
  fontFamily: typography.fontFamily.ui,
  backgroundColor: colorBgPage,
  color: colorTextPrimary,
  lineHeight: 1.5,
});

export const app = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100dvh',
  padding: spacing.xxl,
  overflow: 'hidden',
  '@media': {
    'screen and (max-width: 680px)': {
      padding: 0,
    },
  },
});

export const suspenseFallback = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100dvh',
  color: colorLoadingProgress,
});

export const routeFallback = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  color: colorLoadingProgress,
});
