import { style } from '@vanilla-extract/css';
import {
  colorTextHeading,
  colorTextSecondary,
  fontFamilyDisplay,
  fontSizeSm,
  fontSizeXl,
  maxWidthContent,
  space2,
  space3,
  space4,
  space6,
} from '../../theme.css';

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

export const panelHeaderDeductionsButtons = style({
  display: 'flex',
  alignItems: 'center',
  gap: space3,
  '@media': {
    'screen and (max-width: 680px)': {
      justifyContent: 'center',
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
  fontFamily: fontFamilyDisplay,
  fontStretch: '75%',
  fontSize: fontSizeXl,
  fontWeight: 600,
  textTransform: 'uppercase',
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
