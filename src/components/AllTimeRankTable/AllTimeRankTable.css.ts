import { style, createContainer } from '@vanilla-extract/css';
import {
  colorBgSurface,
  colorBgRowEven,
  colorBgRowAlt,
  colorBgTableHead,
  colorTextTableHead,
  colorTextPrimary,
  colorTextPosition,
  colorTextSecondary,
  colorTextMuted,
  colorPremierLeagueFg,
  colorPremierLeagueBg,
  fontFamily,
  fontSizeXs,
  fontSizeSm,
  fontSizeBase,
  maxWidthContent,
  space1,
  space2,
  space3,
  space4,
  radiusLg,
  shadowMd,
} from '../../theme.css';

export const tableContainer = createContainer();

export const container = style({
  containerName: tableContainer,
  containerType: 'inline-size',
  isolation: 'isolate',
  backgroundColor: colorBgSurface,
  borderRadius: radiusLg,
  boxShadow: shadowMd,
  overflowX: 'auto',
  overflowY: 'auto',
  height: '100%',
  minHeight: 0,
});

export const table = style({
  width: '100%',
  maxWidth: maxWidthContent,
  borderCollapse: 'separate',
  borderSpacing: 0,
  fontSize: fontSizeBase,
  lineHeight: '24px',
  borderRadius: radiusLg,
});

export const colScore = style({
  width: '88px',
});

export const colStat = style({
  width: '72px',
});

export const colAttendance = style({
  width: '72px',
});

export const thead = style({
  backgroundColor: colorBgTableHead,
});

export const th = style({
  padding: `${space2} ${space1}`,
  textAlign: 'left',
  fontWeight: 600,
  color: colorTextTableHead,
  fontSize: fontSizeSm,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontVariantNumeric: 'tabular-nums',
  position: 'sticky',
  top: 0,
  zIndex: 2,
  backgroundColor: colorBgTableHead,
  '@container': {
    [`${tableContainer} (min-width: 480px)`]: {
      padding: space2,
    },
    [`${tableContainer} (min-width: 680px)`]: {
      padding: `${space3} ${space2}`,
    },
  },
});

export const thCenter = style({
  textAlign: 'center',
  whiteSpace: 'nowrap',
});

export const thIcon = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  color: colorTextTableHead,
});

export { colorPremierLeagueFg, colorPremierLeagueBg };

export const tr = style({});

export const rowEven = style({
  backgroundColor: colorBgRowEven,
});

export const rowOdd = style({
  backgroundColor: colorBgRowAlt,
});

export const td = style({
  padding: `${space3} ${space2}`,
  color: colorTextPrimary,
  fontVariantNumeric: 'tabular-nums',
  '@container': {
    [`${tableContainer} (max-width: 480px)`]: {
      padding: `${space2} ${space1}`,
    },
    [`${tableContainer} (max-width: 680px)`]: {
      padding: space2,
    },
  },
});

export const tdCenter = style({
  textAlign: 'center',
  whiteSpace: 'nowrap',
  fontFamily: fontFamily,
  fontVariantNumeric: 'tabular-nums',
});

export const stickyCell = style({
  position: 'sticky',
  left: 0,
  zIndex: 1,
  backgroundColor: 'inherit',
  WebkitMaskImage: 'linear-gradient(to right, black 90%, transparent 100%)',
  maskImage: 'linear-gradient(to right, black 90%, transparent 100%)',
});

export const stickyCellTh = style({
  position: 'sticky',
  left: 0,
  top: 0,
  zIndex: 3,
  backgroundColor: colorBgTableHead,
  paddingLeft: space3,
  WebkitMaskImage: 'unset',
  maskImage: 'unset',
});

export const position = style({
  fontFamily: fontFamily,
  fontWeight: 600,
  color: colorTextPosition,
  textAlign: 'center',
  fontVariantNumeric: 'tabular-nums',
  flexShrink: 0,
});

export const positionNumber = style({
  display: 'inline-block',
  minWidth: '22px',
});

export const teamCell = style({
  display: 'flex',
  alignItems: 'center',
  gap: space2,
  paddingRight: space4,
  minWidth: '180px',
  '@container': {
    [`${tableContainer} (max-width: 480px)`]: {
      minWidth: '140px',
    },
  },
});

export const crest = style({
  width: '20px',
  height: '20px',
  flexShrink: 0,
  objectFit: 'contain',
});

export const teamName = style({
  fontWeight: 600,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const scoreValue = style({
  fontWeight: 700,
  fontFamily: fontFamily,
  fontVariantNumeric: 'tabular-nums',
});

export const statValue = style({
  fontFamily: fontFamily,
  fontVariantNumeric: 'tabular-nums',
});

export const statZero = style({
  color: colorTextMuted,
});

export const leagueScore = style({
  fontFamily: fontFamily,
  fontVariantNumeric: 'tabular-nums',
  color: colorTextSecondary,
  fontSize: fontSizeXs,
});

export const attendanceValue = style({
  fontFamily: fontFamily,
  fontVariantNumeric: 'tabular-nums',
  fontSize: fontSizeSm,
});
