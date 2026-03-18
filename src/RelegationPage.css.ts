import { style } from '@vanilla-extract/css';
import { colorTextHeading, fontSizeLg } from './theme.css';

export const panelHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '36px',
  '@media': {
    'screen and (max-width: 680px)': {
      display: 'none',
    },
  },
});

export const panelTitle = style({
  fontSize: fontSizeLg,
  fontWeight: 600,
  color: colorTextHeading,
  margin: 0,
});
