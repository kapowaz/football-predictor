import { style } from '@vanilla-extract/css';
import { colorTextHeading, fontSizeLg, space3 } from './theme.css';

export const panelHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '36px',
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
