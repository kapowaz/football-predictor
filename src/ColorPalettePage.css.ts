import { style } from '@vanilla-extract/css';
import { fontFamily, space2, space4, space6 } from './theme.css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space6,
  padding: space6,
  overflowY: 'auto',
  height: '100%',
});

export const heading = style({
  fontFamily,
  fontSize: '24px',
  fontWeight: 700,
  margin: 0,
});

export const grid = style({
  display: 'grid',
  gap: '1px',
  overflowX: 'auto',
});

export const headerCell = style({
  fontFamily,
  fontSize: '11px',
  fontWeight: 600,
  textAlign: 'center',
  padding: space2,
  whiteSpace: 'nowrap',
});

export const hueLabel = style({
  fontFamily,
  fontSize: '12px',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  paddingRight: space4,
  whiteSpace: 'nowrap',
  textTransform: 'capitalize',
});

export const swatch = style({
  width: '100%',
  minWidth: '56px',
  aspectRatio: '1',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  padding: '4px',
  transition: 'transform 0.1s ease',
  ':hover': {
    transform: 'scale(1.15)',
    zIndex: 1,
  },
});

export const swatchLabel = style({
  fontFamily,
  fontSize: '9px',
  fontWeight: 500,
  lineHeight: 1,
  opacity: 0,
  transition: 'opacity 0.1s ease',
  selectors: {
    [`${swatch}:hover &`]: {
      opacity: 1,
    },
  },
});
