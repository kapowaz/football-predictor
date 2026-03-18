import { style } from '@vanilla-extract/css';
import {
  colorBgSurface,
  colorBorder,
  colorTextHeading,
  colorTextSecondary,
  colorFocus,
  fontFamily,
  fontSizeMd,
  space3,
  space4,
  maxWidthContent,
} from '../../theme.css';

const mobileBreakpoint = 'screen and (max-width: 1024px)';

export const tabBar = style({
  display: 'none',
  '@media': {
    [mobileBreakpoint]: {
      display: 'flex',
      width: '100%',
      maxWidth: maxWidthContent,
      margin: `0 auto ${space4}`,
      borderBottom: `2px solid ${colorBorder}`,
      position: 'sticky',
      left: 0,
    },
    'screen and (max-width: 680px)': {
      marginBottom: 0,
    },
  },
});

export const tabBarAlwaysVisible = style({
  display: 'flex',
  width: '100%',
  maxWidth: maxWidthContent,
  margin: '0 auto',
  borderBottom: `2px solid ${colorBorder}`,
});

export const tab = style({
  flex: 1,
  padding: `${space3} ${space4}`,
  fontFamily: fontFamily,
  fontSize: fontSizeMd,
  fontWeight: 600,
  color: colorTextSecondary,
  background: colorBgSurface,
  border: 'none',
  borderBottom: '2px solid transparent',
  marginBottom: '-2px',
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'color 0.2s, border-color 0.2s',
});

export const tabActive = style({
  color: colorTextHeading,
  borderBottomColor: colorFocus,
});
