import { style } from '@vanilla-extract/css';
import {
  colorBgSurface,
  colorBgRowAlt,
  colorBgTableHeader,
  colorBgZonePromotion,
  colorBgZonePromotionAlt,
  colorBgZonePlayoff,
  colorBgZonePlayoffAlt,
  colorBgZoneRelegation,
  colorBgZoneRelegationAlt,
  colorTextPrimary,
  colorTextSecondary,
  colorTextWhite,
  colorTextZonePromotion,
  colorTextZonePlayoff,
  colorTextZoneRelegation,
  colorNeutralLight,
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
  shadowMd,
} from '../../theme.css';

export const container = style({
  backgroundColor: colorBgSurface,
  borderRadius: radiusLg,
  boxShadow: shadowMd,
  overflow: 'hidden',
});

export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: fontSizeBase,
});

export const thead = style({
  backgroundColor: colorNeutralLight,
});

export const th = style({
  padding: `${space3} ${space2}`,
  textAlign: 'left',
  fontWeight: 600,
  color: colorBgTableHeader,
  fontSize: fontSizeSm,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontVariantNumeric: 'tabular-nums',
});

export const thCenter = style([
  th,
  {
    textAlign: 'center',
  },
]);

export const tr = style({});

export const td = style({
  padding: `${space3} ${space2}`,
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

export const positionPromotion = style({
  color: colorTextZonePromotion,
});

export const positionPlayoff = style({
  color: colorTextZonePlayoff,
});

export const positionRelegation = style({
  color: colorTextZoneRelegation,
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

export const rowEven = style({
  backgroundColor: colorBgSurface,
});

export const rowOdd = style({
  backgroundColor: colorBgRowAlt,
});

export const zonePromotionEven = style({
  backgroundColor: colorBgZonePromotion,
});

export const zonePromotionOdd = style({
  backgroundColor: colorBgZonePromotionAlt,
});

export const zonePlayoffEven = style({
  backgroundColor: colorBgZonePlayoff,
});

export const zonePlayoffOdd = style({
  backgroundColor: colorBgZonePlayoffAlt,
});

export const zoneRelegationEven = style({
  backgroundColor: colorBgZoneRelegation,
});

export const zoneRelegationOdd = style({
  backgroundColor: colorBgZoneRelegationAlt,
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
  cursor: 'help',
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
