import { style } from '@vanilla-extract/css';
import { space3, space6 } from '../../theme.css';

export const overlay = style({
  zIndex: 1000,
});

export const backdrop = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  '@media': {
    'screen and (max-width: 680px)': {
      padding: `0 ${space6}`,
    },
    'screen and (max-width: 550px)': {
      padding: `0 ${space3}`,
    },
  },
});
