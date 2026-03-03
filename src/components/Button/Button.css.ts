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
} from '../../theme.css';

const base = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space1,
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
