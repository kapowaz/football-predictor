import { style, createContainer, createVar, fallbackVar } from '@vanilla-extract/css';
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
  colorTextStatFaded,
  colorTextStatStrong,
  colorBgZoneChampions,
  colorBgZoneChampionsAlt,
  colorBgZoneChampionsLeague,
  colorBgZoneChampionsLeagueAlt,
  colorBgZoneEuropaLeague,
  colorBgZoneEuropaLeagueAlt,
  colorBgZoneConferenceLeague,
  colorBgZoneConferenceLeagueAlt,
  colorTextZoneChampions,
  colorTextZoneChampionsAlt,
  colorTextZoneChampionsTertiary,
  colorTextZoneChampionsLeague,
  colorTextZoneChampionsLeagueAlt,
  colorTextZoneChampionsLeagueTertiary,
  colorTextZoneEuropaLeague,
  colorTextZoneEuropaLeagueAlt,
  colorTextZoneEuropaLeagueTertiary,
  colorTextZoneConferenceLeague,
  colorTextZoneConferenceLeagueAlt,
  colorTextZoneConferenceLeagueTertiary,
  colorPremierLeagueFg,
  colorPremierLeagueBg,
  fontFamily,
  fontFamilyDisplay,
  fontSizeXs,
  fontSizeSm,
  fontSizeBase,
  fontSizeLg,
  maxWidthContent,
  space1,
  space2,
  space3,
  space4,
  radiusLg,
  shadowMd,
} from '../../theme.css';

export const honourRecency = createVar();
export const zoneTextAlt = createVar();
export const zoneTextTertiary = createVar();

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
  '@media': {
    'screen and (max-width: 680px)': {
      borderRadius: 0,
    },
  },
});

export const table = style({
  width: '100%',
  maxWidth: maxWidthContent,
  borderCollapse: 'separate',
  borderSpacing: 0,
  fontSize: fontSizeBase,
  lineHeight: '24px',
  borderRadius: radiusLg,
  '@media': {
    'screen and (max-width: 680px)': {
      borderRadius: 0,
    },
  },
});

export const colScore = style({
  width: '96px',
});

export const colStat = style({
  width: '96px',
});

export const colAttendance = style({
  width: '96px',
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

export const zoneChampionsEven = style({
  backgroundColor: colorBgZoneChampions,
  vars: {
    [zoneTextAlt]: colorTextZoneChampionsAlt,
    [zoneTextTertiary]: colorTextZoneChampionsTertiary,
  },
});

export const zoneChampionsOdd = style({
  backgroundColor: colorBgZoneChampionsAlt,
  vars: {
    [zoneTextAlt]: colorTextZoneChampionsAlt,
    [zoneTextTertiary]: colorTextZoneChampionsTertiary,
  },
});

export const zoneChampionsLeagueEven = style({
  backgroundColor: colorBgZoneChampionsLeague,
  vars: {
    [zoneTextAlt]: colorTextZoneChampionsLeagueAlt,
    [zoneTextTertiary]: colorTextZoneChampionsLeagueTertiary,
  },
});

export const zoneChampionsLeagueOdd = style({
  backgroundColor: colorBgZoneChampionsLeagueAlt,
  vars: {
    [zoneTextAlt]: colorTextZoneChampionsLeagueAlt,
    [zoneTextTertiary]: colorTextZoneChampionsLeagueTertiary,
  },
});

export const zoneEuropaLeagueEven = style({
  backgroundColor: colorBgZoneEuropaLeague,
  vars: {
    [zoneTextAlt]: colorTextZoneEuropaLeagueAlt,
    [zoneTextTertiary]: colorTextZoneEuropaLeagueTertiary,
  },
});

export const zoneEuropaLeagueOdd = style({
  backgroundColor: colorBgZoneEuropaLeagueAlt,
  vars: {
    [zoneTextAlt]: colorTextZoneEuropaLeagueAlt,
    [zoneTextTertiary]: colorTextZoneEuropaLeagueTertiary,
  },
});

export const zoneConferenceLeagueEven = style({
  backgroundColor: colorBgZoneConferenceLeague,
  vars: {
    [zoneTextAlt]: colorTextZoneConferenceLeagueAlt,
    [zoneTextTertiary]: colorTextZoneConferenceLeagueTertiary,
  },
});

export const zoneConferenceLeagueOdd = style({
  backgroundColor: colorBgZoneConferenceLeagueAlt,
  vars: {
    [zoneTextAlt]: colorTextZoneConferenceLeagueAlt,
    [zoneTextTertiary]: colorTextZoneConferenceLeagueTertiary,
  },
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

export const positionChampions = style({
  color: colorTextZoneChampions,
});

export const positionChampionsLeague = style({
  color: colorTextZoneChampionsLeague,
});

export const positionEuropaLeague = style({
  color: colorTextZoneEuropaLeague,
});

export const positionConferenceLeague = style({
  color: colorTextZoneConferenceLeague,
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
  fontFamily: fontFamilyDisplay,
  fontStretch: '75%',
  fontWeight: 600,
  fontSize: fontSizeLg,
  textTransform: 'uppercase',
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
  color: `color-mix(in lch, ${colorTextStatStrong} ${fallbackVar(honourRecency, '100%')}, ${fallbackVar(zoneTextTertiary, colorTextStatFaded)})`,
});

export const statZero = style({
  color: fallbackVar(zoneTextTertiary, colorTextMuted),
});

export const leagueScore = style({
  fontFamily: fontFamily,
  fontVariantNumeric: 'tabular-nums',
  color: fallbackVar(zoneTextAlt, colorTextSecondary),
  fontSize: fontSizeXs,
});

export const attendanceValue = style({
  fontFamily: fontFamily,
  fontVariantNumeric: 'tabular-nums',
  fontSize: fontSizeSm,
});

export const popoverContent = style({
  padding: space2,
  display: 'flex',
  flexDirection: 'column',
  gap: space2,
});

export const popoverLabel = style({
  fontWeight: 600,
});

export const popoverYears = style({
  maxWidth: '240px',
  fontVariantNumeric: 'tabular-nums',
});

export const scoreBreakdownTable = style({
  borderCollapse: 'collapse',
  borderSpacing: 0,
  fontSize: fontSizeBase,
  fontVariantNumeric: 'tabular-nums',
});

export const scoreBreakdownLabel = style({
  fontWeight: 600,
  paddingRight: space3,
});

export const scoreBreakdownValue = style({
  textAlign: 'right',
  fontSize: fontSizeBase,
});
