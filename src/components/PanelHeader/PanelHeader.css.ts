import { createVar, style } from '@vanilla-extract/css';
import {
  cssVariablesByColorMode,
  getDesignTokens,
} from '@kapowaz/design-tokens';

const { colors } = getDesignTokens();

const colorTextHeading = createVar('panel-header-text-heading');

cssVariablesByColorMode({
  light: {
    [colorTextHeading]: colors.gray[900],
  },
  dark: {
    [colorTextHeading]: colors.ink[300],
  },
});

export const panelHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '24px',
  flexShrink: 0,
  '@media': {
    'screen and (max-width: 680px)': {
      display: 'none',
    },
  },
});

export const panelTitle = style({
  fontStretch: '75%',
  textTransform: 'uppercase',
  color: colorTextHeading,
  margin: 0,
});
