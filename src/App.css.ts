import { style, globalStyle } from '@vanilla-extract/css';
import {
  colorBgPage,
  colorBgSurface,
  colorTextPrimary,
  colorTextHeading,
  colorTextSecondary,
  colorBorder,
  colorFocus,
  fontFamily,
  fontSizeXxl,
  fontSizeXl,
  fontSizeLg,
  fontSizeMd,
  fontSizeSm,
  space3,
  space4,
  space6,
  space8,
  maxWidthContent,
} from './theme.css';

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
});

globalStyle('body', {
  margin: 0,
  fontFamily: fontFamily,
  backgroundColor: colorBgPage,
  color: colorTextPrimary,
  lineHeight: 1.5,
});

export const app = style({
  minHeight: '100vh',
  padding: space6,
  '@media': {
    'screen and (max-width: 680px)': {
      padding: 0,
    },
  },
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: space3,
  maxWidth: maxWidthContent,
  margin: `0 auto ${space8}`,
  '@media': {
    'screen and (max-width: 680px)': {
      padding: `${space6} ${space4} 0`,
    },
  },
});

export const logo = style({
  height: '36px',
  width: 'auto',
});

export const title = style({
  fontSize: fontSizeXxl,
  fontWeight: 700,
  color: colorTextHeading,
  margin: 0,
  '@media': {
    'screen and (max-width: 680px)': {
      fontSize: fontSizeXl,
    },
  },
});

export const main = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: space8,
  maxWidth: maxWidthContent,
  margin: '0 auto',
  '@media': {
    'screen and (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space4,
});

export const panelGuttered = style([
  panel,
  {
    '@media': {
      'screen and (max-width: 680px)': {
        padding: `0 ${space4}`,
      },
    },
  },
]);

export const panelHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '32px',
});

export const panelHeaderWithNotes = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '32px',
  gap: space3,
  '@media': {
    'screen and (max-width: 680px)': {
      padding: `0 ${space4}`,
    },
  },
});

export const panelHeaderRight = style({
  display: 'flex',
  alignItems: 'center',
  gap: space3,
  '@media': {
    'screen and (max-width: 680px)': {
      flex: 1,
      justifyContent: 'space-between',
    },
  },
});

export const deductionNotes = style({
  display: 'flex',
  gap: space3,
  fontSize: fontSizeSm,
  color: colorTextSecondary,
});

export const deductionNote = style({
  cursor: 'help',
});

export const panelTitle = style({
  fontSize: fontSizeLg,
  fontWeight: 600,
  color: colorTextHeading,
  margin: 0,
  '@media': {
    'screen and (max-width: 680px)': {
      display: 'none',
    },
  },
});

export const deductionsButtonIcon = style({
  width: '14px',
  height: '14px',
});

const mobileBreakpoint = 'screen and (max-width: 1024px)';

export const tabBar = style({
  display: 'none',
  '@media': {
    [mobileBreakpoint]: {
      display: 'flex',
      maxWidth: maxWidthContent,
      margin: `0 auto ${space4}`,
      borderBottom: `2px solid ${colorBorder}`,
      position: 'sticky',
      left: 0,
    },
  },
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

export const hiddenOnMobile = style({
  '@media': {
    [mobileBreakpoint]: {
      display: 'none',
    },
  },
});
