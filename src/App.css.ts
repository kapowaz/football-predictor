import { style, globalStyle } from '@vanilla-extract/css';
import {
  colorBgPage,
  colorTextPrimary,
  colorTextHeading,
  colorTextSecondary,
  fontFamily,
  fontSizeLg,
  fontSizeSm,
  space2,
  space3,
  space4,
  space6,
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
  display: 'flex',
  flexDirection: 'column',
  height: '100dvh',
  padding: space6,
  overflow: 'hidden',
  '@media': {
    'screen and (max-width: 680px)': {
      padding: 0,
    },
  },
});

export const main = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(640px, 1fr) 1fr',
  gap: space6,
  maxWidth: maxWidthContent,
  width: '100%',
  margin: '0 auto',
  flex: 1,
  minHeight: 0,
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
  minHeight: 0,
  '@media': {
    'screen and (max-width: 680px)': {
      overflow: 'hidden',
    },
  },
});

export const panelGuttered = style([
  panel,
  {
    padding: `0 ${space2}`,
    '@media': {
      'screen and (min-width: 480px)': {
        padding: `0 ${space4}`,
      },
      'screen and (min-width: 680px)': {
        padding: 0,
      },
    },
  },
]);

export const panelHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '36px',
});

export const panelHeaderWithNotes = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: space3,
  '@media': {
    'screen and (max-width: 680px)': {
      padding: `0 ${space4}`,
    },
    'screen and (min-width: 680px)': {
      height: '36px',
    },
  },
});

export const panelHeaderDeductions = style({
  display: 'flex',
  alignItems: 'center',
  gap: space3,
  '@media': {
    'screen and (max-width: 680px)': {
      flex: 1,
      justifyContent: 'space-between',
      flexDirection: 'column-reverse',
    },
  },
});

export const panelHeaderActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: space3,
  '@media': {
    'screen and (max-width: 680px)': {
      flex: 1,
      justifyContent: 'center',
      display: 'flex',
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

export const hiddenOnMobile = style({
  '@media': {
    [mobileBreakpoint]: {
      display: 'none',
    },
  },
});

export const pageContent = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
});
