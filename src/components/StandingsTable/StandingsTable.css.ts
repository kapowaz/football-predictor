import { style, globalStyle } from '@vanilla-extract/css';
import {
  colorBgSurface,
  colorBgSurfaceHover,
  colorTextPrimary,
  colorTextSecondary,
  colorTextWhite,
  colorBorder,
  colorBorderLight,
  colorBorderMedium,
  colorSuccess,
  colorDanger,
  colorNeutral,
  fontSizeXs,
  fontSizeSm,
  fontSizeBase,
  fontSizeMd,
  space1,
  space2,
  space3,
  radiusMd,
  radiusLg,
  shadowSm,
} from '../../theme.css';

export const container = style({
  backgroundColor: colorBgSurface,
  borderRadius: radiusLg,
  boxShadow: shadowSm,
  overflow: 'hidden',
});

export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: fontSizeBase,
});

export const thead = style({
  backgroundColor: colorBgSurfaceHover,
});

export const th = style({
  padding: `${space3} ${space2}`,
  textAlign: 'left',
  fontWeight: 600,
  color: colorTextSecondary,
  fontSize: fontSizeSm,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontVariantNumeric: 'tabular-nums',
  borderBottom: `1px solid ${colorBorder}`,
});

export const thCenter = style([
  th,
  {
    textAlign: 'center',
  },
]);

export const tr = style({
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: colorBgSurfaceHover,
  },
});

export const td = style({
  padding: `${space3} ${space2}`,
  borderBottom: `1px solid ${colorBorderLight}`,
  color: colorTextPrimary,
  fontVariantNumeric: 'tabular-nums',
});

export const tdCenter = style([
  td,
  {
    textAlign: 'center',
  },
]);

export const tdRight = style([
  td,
  {
    textAlign: 'right',
  },
]);

export const position = style({
  fontWeight: 600,
  color: colorTextSecondary,
  width: '32px',
  textAlign: 'center',
  fontVariantNumeric: 'tabular-nums',
});

export const teamCell = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

export const crest = style({
  width: '24px',
  height: '24px',
  objectFit: 'contain',
});

export const teamName = style({
  fontWeight: 500,
});

export const points = style({
  fontWeight: 700,
  fontSize: fontSizeMd,
});

export const goalDiff = style({
  fontWeight: 500,
});

export const positive = style({
  color: colorSuccess,
});

export const negative = style({
  color: colorDanger,
});

export const zoneBoundary = style({});

globalStyle(`${zoneBoundary} td`, {
  borderBottomColor: colorBorderMedium,
});

export const formCell = style({
  display: 'flex',
  gap: space1,
  justifyContent: 'flex-end',
});

export const formBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '22px',
  height: '22px',
  borderRadius: radiusMd,
  fontSize: fontSizeXs,
  fontWeight: 700,
  color: colorTextWhite,
  lineHeight: 1,
});

export const formWin = style({
  backgroundColor: colorSuccess,
});

export const formDraw = style({
  backgroundColor: colorNeutral,
});

export const formLoss = style({
  backgroundColor: colorDanger,
});
