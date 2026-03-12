import { style, globalStyle } from '@vanilla-extract/css';
import { colorBgPage, colorTextPrimary, fontFamily, space6 } from './theme.css';

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
