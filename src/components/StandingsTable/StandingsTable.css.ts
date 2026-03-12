import { style, createContainer } from '@vanilla-extract/css';
import {
  colorBgSurface,
  colorBgRowEven,
  colorBgRowAlt,
  colorTextTableHead,
  colorBgZonePromotion,
  colorBgZonePromotionAlt,
  colorBgZonePlayoff,
  colorBgZonePlayoffAlt,
  colorBgZoneRelegation,
  colorBgZoneRelegationAlt,
  colorBgZoneChampions,
  colorBgZoneChampionsAlt,
  colorBgZoneChampionsLeague,
  colorBgZoneChampionsLeagueAlt,
  colorBgZoneEuropaLeague,
  colorBgZoneEuropaLeagueAlt,
  colorBgZoneConferenceLeague,
  colorBgZoneConferenceLeagueAlt,
  colorTextPrimary,
  colorTextPosition,
  colorTextGdPositive,
  colorTextGdNegative,
  colorResultWin,
  colorResultDraw,
  colorResultLoss,
  colorResultWinText,
  colorResultDrawText,
  colorResultLossText,
  colorResultWinHover,
  colorResultDrawHover,
  colorResultLossHover,
  colorResultWinTextHover,
  colorResultDrawTextHover,
  colorResultLossTextHover,
  colorTextZonePromotion,
  colorTextZonePlayoff,
  colorTextZoneRelegation,
  colorTextZoneChampions,
  colorTextZoneChampionsLeague,
  colorTextZoneEuropaLeague,
  colorTextZoneConferenceLeague,
  colorBgTableHead,
  fontFamilyMono,
  fontSizeXs,
  fontSizeSm,
  fontSizeBase,
  fontSizeMd,
  fontSizeLg,
  space1,
  space2,
  space3,
  space4,
  radiusMd,
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
  minHeight: 0,
});

export const containerNoBorderRadius = style({
  borderRadius: 0,
});

export const containerTopPartial = style({
  borderRadius: `${radiusLg} ${radiusLg} 0 0`,
});

export const containerBottomPartial = style({
  borderRadius: `0 0 ${radiusLg} ${radiusLg}`,
});

export const containerNoVerticalScroll = style({
  overflowY: 'visible',
});

export const table = style({
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
  fontSize: fontSizeBase,
  lineHeight: '24px',
  borderRadius: radiusLg,
});

export const tableLarge = style({
  fontSize: fontSizeLg,
});

export const tableRenderLayoutFixed = style({
  tableLayout: 'fixed',
});

export const tableNoBorderRadius = style({
  borderRadius: 0,
});

export const tableTopPartial = style({
  borderRadius: `${radiusLg} ${radiusLg} 0 0`,
});

export const tableBottomPartial = style({
  borderRadius: `0 0 ${radiusLg} ${radiusLg}`,
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
  '@media': {
    'screen and (min-width: 480px)': {
      padding: space2,
    },
    'screen and (min-width: 680px)': {
      padding: `${space3} ${space2}`,
    },
  },
});

export const thLarge = style({
  fontSize: fontSizeMd,
});

export const thCenter = style([
  th,
  {
    textAlign: 'center',
    width: '1%',
    whiteSpace: 'nowrap',
    '@container': {
      [`${tableContainer} (min-width: 768px)`]: {
        padding: space3,
      },
      [`${tableContainer} (min-width: 850px)`]: {
        padding: `${space3} ${space4}`,
      },
    },
  },
]);

export const thStats = style({
  width: '6.5%',
});

export const tr = style({});

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

export const cellRenderNoHorizontalPadding = style({
  paddingLeft: 0,
  paddingRight: 0,
  '@media': {
    'screen and (min-width: 480px)': {
      paddingLeft: 0,
      paddingRight: 0,
    },
    'screen and (min-width: 680px)': {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  '@container': {
    [`${tableContainer} (max-width: 480px)`]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    [`${tableContainer} (max-width: 680px)`]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    [`${tableContainer} (min-width: 768px)`]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    [`${tableContainer} (min-width: 850px)`]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
});

export const tdCenter = style([
  td,
  {
    textAlign: 'center',
    whiteSpace: 'nowrap',
    fontFamily: fontFamilyMono,
    '@container': {
      [`${tableContainer} (min-width: 768px)`]: {
        padding: space3,
      },
      [`${tableContainer} (min-width: 850px)`]: {
        padding: `${space3} ${space4}`,
      },
    },
  },
]);

export const tdRight = style([
  td,
  {
    textAlign: 'right',
  },
]);

export const stickyCell = style({
  position: 'sticky',
  left: 0,
  zIndex: 1,
  backgroundColor: 'inherit',
});

export const stickyCellTh = style([
  stickyCell,
  {
    position: 'sticky',
    left: 0,
    top: 0,
    zIndex: 3,
    backgroundColor: colorBgTableHead,
    '@container': {
      [`${tableContainer} (max-width: 480px)`]: {
        paddingLeft: '40px',
      },
    },
  },
]);

export const cellRenderNoHorizontalPaddingStrong = style({
  paddingLeft: 0,
  paddingRight: 0,
  '@media': {
    'screen and (min-width: 480px)': {
      paddingLeft: 0,
      paddingRight: 0,
    },
    'screen and (min-width: 680px)': {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  '@container': {
    [`${tableContainer} (max-width: 480px)`]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    [`${tableContainer} (max-width: 680px)`]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    [`${tableContainer} (min-width: 768px)`]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    [`${tableContainer} (min-width: 850px)`]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
});

export const cellRenderNoRightPaddingStrong = style({
  paddingRight: 0,
  '@media': {
    'screen and (min-width: 480px)': {
      paddingRight: 0,
    },
    'screen and (min-width: 680px)': {
      paddingRight: 0,
    },
  },
  '@container': {
    [`${tableContainer} (max-width: 480px)`]: {
      paddingRight: 0,
    },
    [`${tableContainer} (max-width: 680px)`]: {
      paddingRight: 0,
    },
    [`${tableContainer} (min-width: 768px)`]: {
      paddingRight: 0,
    },
    [`${tableContainer} (min-width: 850px)`]: {
      paddingRight: 0,
    },
  },
});

export const position = style({
  fontFamily: fontFamilyMono,
  fontWeight: 600,
  color: colorTextPosition,
  textAlign: 'center',
  fontVariantNumeric: 'tabular-nums',
});

export const positionNumber = style({
  display: 'inline-block',
  minWidth: '24px',
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
});

export const crest = style({
  width: '24px',
  height: '24px',
  objectFit: 'contain',
});

export const teamName = style({
  fontWeight: 500,
});

export const teamNameRender = style({
  display: 'inline-block',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const teamShortName = style({
  '@container': {
    [`${tableContainer} (max-width: 479px)`]: {
      display: 'none',
    },
  },
});

export const teamTla = style({
  display: 'none',
  '@container': {
    [`${tableContainer} (max-width: 479px)`]: {
      display: 'inline',
    },
  },
});

export const colStat = style({
  width: '48px',
});

export const colForm = style({
  width: '168px',
});

export const points = style({
  fontWeight: 700,
  fontSize: fontSizeMd,
});

export const pointsLarge = style({
  fontSize: fontSizeLg,
});

export const goalDiff = style({
  fontWeight: 500,
});

export const positive = style({
  color: colorTextGdPositive,
});

export const negative = style({
  color: colorTextGdNegative,
});

export const rowEven = style({
  backgroundColor: colorBgRowEven,
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

export const zoneChampionsEven = style({
  backgroundColor: colorBgZoneChampions,
});

export const zoneChampionsOdd = style({
  backgroundColor: colorBgZoneChampionsAlt,
});

export const zoneChampionsLeagueEven = style({
  backgroundColor: colorBgZoneChampionsLeague,
});

export const zoneChampionsLeagueOdd = style({
  backgroundColor: colorBgZoneChampionsLeagueAlt,
});

export const zoneEuropaLeagueEven = style({
  backgroundColor: colorBgZoneEuropaLeague,
});

export const zoneEuropaLeagueOdd = style({
  backgroundColor: colorBgZoneEuropaLeagueAlt,
});

export const zoneConferenceLeagueEven = style({
  backgroundColor: colorBgZoneConferenceLeague,
});

export const zoneConferenceLeagueOdd = style({
  backgroundColor: colorBgZoneConferenceLeagueAlt,
});

export const formCell = style({
  display: 'flex',
  gap: space1,
  justifyContent: 'flex-end',
  whiteSpace: 'nowrap',
});

const formBadgeBase = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '22px',
  height: '22px',
  borderRadius: radiusMd,
  fontSize: fontSizeXs,
  fontWeight: 700,
  lineHeight: 1,
} as const;

export const formBadge = style({
  ...formBadgeBase,
  cursor: 'help',
});

export const formBadgeButton = style({
  ...formBadgeBase,
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  transition: 'background-color 0.15s ease, color 0.15s ease',
});

export const formWin = style({
  backgroundColor: colorResultWin,
  color: colorResultWinText,
});

export const formDraw = style({
  backgroundColor: colorResultDraw,
  color: colorResultDrawText,
});

export const formLoss = style({
  backgroundColor: colorResultLoss,
  color: colorResultLossText,
});

export const formWinButton = style({
  backgroundColor: colorResultWin,
  color: colorResultWinText,
  selectors: {
    '&:hover': {
      backgroundColor: colorResultWinHover,
      color: colorResultWinTextHover,
    },
  },
});

export const formDrawButton = style({
  backgroundColor: colorResultDraw,
  color: colorResultDrawText,
  selectors: {
    '&:hover': {
      backgroundColor: colorResultDrawHover,
      color: colorResultDrawTextHover,
    },
  },
});

export const formLossButton = style({
  backgroundColor: colorResultLoss,
  color: colorResultLossText,
  selectors: {
    '&:hover': {
      backgroundColor: colorResultLossHover,
      color: colorResultLossTextHover,
    },
  },
});
