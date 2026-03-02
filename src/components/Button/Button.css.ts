import { style, styleVariants } from '@vanilla-extract/css';
import {
  colorBgSurface,
  colorBgSurfaceHover,
  colorDanger,
  colorDangerBg,
  colorDangerBgHover,
  colorDangerBorder,
  colorSuccess,
  fontFamily,
  fontSizeSm,
  space1,
  space2,
  space4,
  radiusSm,
} from '../../theme.css';

const base = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space1,
  padding: `${space2} ${space4}`,
  fontFamily: fontFamily,
  fontSize: fontSizeSm,
  lineHeight: 1,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '-0.02em',
  borderRadius: radiusSm,
  cursor: 'pointer',
  transition: 'background-color 0.2s, opacity 0.2s',
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
      border: `1px solid ${colorDangerBorder}`,
      ':hover': {
        backgroundColor: colorDangerBgHover,
      },
    },
  ],
  success: [
    base,
    {
      color: colorSuccess,
      backgroundColor: colorBgSurface,
      border: `1px solid ${colorSuccess}`,
      ':hover': {
        backgroundColor: colorBgSurfaceHover,
      },
    },
  ],
});
