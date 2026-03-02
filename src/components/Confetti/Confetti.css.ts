import { style } from '@vanilla-extract/css';

export const confetti = style({
  position: 'fixed',
  height: '100%',
  width: '100%',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 1,
});
