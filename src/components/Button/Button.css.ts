import { style, styleVariants } from '@vanilla-extract/css';
import {
  colorDanger,
  colorDangerBg,
  colorDangerBgHover,
  colorDangerBorder,
  colorDangerBorderHover,
  colorSuccess,
  colorSuccessBg,
  colorSuccessBgHover,
  colorSuccessBorder,
  colorSuccessBorderHover,
  fontFamily,
  fontSizeSm,
  space1,
  space2,
  radiusLg,
  radiusMd,
} from '../../theme.css';

const base = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space1,
  minHeight: '36px',
  padding: space2,
  fontFamily: fontFamily,
  fontSize: fontSizeSm,
  lineHeight: 1,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '-0.02em',
  borderRadius: radiusLg,
  cursor: 'pointer',
  transition: 'background-color 0.2s, border-color 0.2s, opacity 0.2s',
  ':disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
});

export const iconOnly = style({
  width: '36px',
  height: '36px',
  padding: 0,
  justifyContent: 'center',
});

export const compact = style({
  width: '24px',
  height: '24px',
  minHeight: 'unset',
  padding: 0,
  gap: 0,
  justifyContent: 'center',
  borderRadius: radiusMd,
});

export const variant = styleVariants({
  danger: [
    base,
    {
      color: colorDanger,
      backgroundColor: colorDangerBg,
      border: `2px solid ${colorDangerBorder}`,
      selectors: {
        '&:hover:not(:disabled)': {
          backgroundColor: colorDangerBgHover,
          borderColor: colorDangerBorderHover,
        },
      },
    },
  ],
  success: [
    base,
    {
      color: colorSuccess,
      backgroundColor: colorSuccessBg,
      border: `2px solid ${colorSuccessBorder}`,
      selectors: {
        '&:hover:not(:disabled)': {
          backgroundColor: colorSuccessBgHover,
          borderColor: colorSuccessBorderHover,
        },
      },
    },
  ],
});
