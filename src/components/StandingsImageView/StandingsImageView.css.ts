import { style } from '@vanilla-extract/css';

export const hiddenCaptureRoot = style({
  position: 'fixed',
  left: '-10000px',
  top: 0,
  pointerEvents: 'none',
  zIndex: -1,
});

export const captureSurface = style({
  width: '100%',
  minWidth: 0,
});
