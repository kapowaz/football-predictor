import { style } from '@vanilla-extract/css';
import {
  colorBgBackdrop,
  colorBgModal,
  radiusLg,
  shadowLg,
  space3,
  space4,
  space6,
  space8,
} from '../../theme.css';

export const overlay = style({
  zIndex: 1,
});

export const backdrop = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: colorBgBackdrop,
  '@media': {
    'screen and (max-width: 680px)': {
      padding: `0 ${space6}`,
    },
    'screen and (max-width: 550px)': {
      padding: `0 ${space3}`,
    },
  },
});

export const panel = style({
  backgroundColor: colorBgModal,
  borderRadius: radiusLg,
  boxShadow: shadowLg,
  padding: space8,
  width: '90vw',
  position: 'relative',
  outline: 'none',
  '@media': {
    'screen and (max-width: 550px)': {
      padding: `${space4} ${space3}`,
    },
  },
});
