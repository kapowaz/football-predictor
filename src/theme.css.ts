import { createVar, globalStyle } from '@vanilla-extract/css';
import * as tailwind from './tailwind.css';

export const colorBgPage = createVar();
export const colorBgSurface = createVar();
export const colorBgSurfaceHover = createVar();

export const colorTextPrimary = createVar();
export const colorTextHeading = createVar();
export const colorTextSecondary = createVar();
export const colorTextMuted = createVar();
export const colorTextFaint = createVar();
export const colorTextHover = createVar();
export const colorTextActive = createVar();
export const colorTextWhite = createVar();

export const colorBorder = createVar();
export const colorBorderLight = createVar();
export const colorBorderMedium = createVar();
export const colorBorderInput = createVar();

export const colorSuccess = createVar();
export const colorDanger = createVar();
export const colorDangerBg = createVar();
export const colorDangerBgHover = createVar();
export const colorDangerBorder = createVar();
export const colorDangerBorderHover = createVar();
export const colorSuccessBg = createVar();
export const colorSuccessBgHover = createVar();
export const colorSuccessBorder = createVar();
export const colorSuccessBorderHover = createVar();
export const colorNeutralLight = createVar();
export const colorNeutral = createVar();
export const colorBgZonePromotion = createVar();
export const colorBgZonePromotionAlt = createVar();
export const colorBgZonePlayoff = createVar();
export const colorBgZonePlayoffAlt = createVar();
export const colorBgZoneRelegation = createVar();
export const colorBgZoneRelegationAlt = createVar();
export const colorTextZonePromotion = createVar();
export const colorTextZonePlayoff = createVar();
export const colorTextZoneRelegation = createVar();
export const colorBgZoneChampions = createVar();
export const colorBgZoneChampionsAlt = createVar();
export const colorTextZoneChampions = createVar();
export const colorBgZoneChampionsLeague = createVar();
export const colorBgZoneChampionsLeagueAlt = createVar();
export const colorTextZoneChampionsLeague = createVar();
export const colorBgZoneEuropaLeague = createVar();
export const colorBgZoneEuropaLeagueAlt = createVar();
export const colorTextZoneEuropaLeague = createVar();
export const colorBgZoneConferenceLeague = createVar();
export const colorBgZoneConferenceLeagueAlt = createVar();
export const colorTextZoneConferenceLeague = createVar();
export const colorBgModal = createVar();
export const colorBgBackdrop = createVar();
export const colorBgFixtureCard = createVar();
export const colorBgFixtureCardHighlight = createVar();
export const colorBgRowEven = createVar();
export const colorBgRowAlt = createVar();
export const colorBgTableHead = createVar();
export const colorTextTableHead = createVar();

export const colorTextPosition = createVar();
export const colorTextGdPositive = createVar();
export const colorTextGdNegative = createVar();
export const colorResultWin = createVar();
export const colorResultDraw = createVar();
export const colorResultLoss = createVar();
export const colorResultWinText = createVar();
export const colorResultDrawText = createVar();
export const colorResultLossText = createVar();
export const colorResultWinHover = createVar();
export const colorResultDrawHover = createVar();
export const colorResultLossHover = createVar();
export const colorResultWinTextHover = createVar();
export const colorResultDrawTextHover = createVar();
export const colorResultLossTextHover = createVar();

export const colorFocus = createVar();
export const colorFocusRing = createVar();

export const fontFamily = createVar();
export const fontFamilyMono = createVar();

export const fontSizeXs = createVar();
export const fontSizeSm = createVar();
export const fontSizeBase = createVar();
export const fontSizeMd = createVar();
export const fontSizeLg = createVar();
export const fontSizeXl = createVar();
export const fontSizeXxl = createVar();

export const space1 = createVar();
export const space2 = createVar();
export const space3 = createVar();
export const space4 = createVar();
export const space6 = createVar();
export const space8 = createVar();
export const space12 = createVar();

export const radiusSm = createVar();
export const radiusMd = createVar();
export const radiusLg = createVar();

export const shadowSm = createVar();
export const shadowMd = createVar();
export const shadowLg = createVar();

export const maxWidthContent = createVar();

globalStyle(':root', {
  vars: {
    ...tailwind.palette,
    [colorBgPage]: tailwind.gray[100],
    [colorBgSurface]: tailwind.white,
    [colorBgSurfaceHover]: tailwind.gray[50],

    [colorTextPrimary]: tailwind.gray[800],
    [colorTextHeading]: tailwind.gray[900],
    [colorTextSecondary]: tailwind.gray[500],
    [colorTextMuted]: tailwind.neutral[500],
    [colorTextFaint]: tailwind.neutral[100],
    [colorTextHover]: tailwind.gray[700],
    [colorTextActive]: tailwind.gray[600],
    [colorTextWhite]: tailwind.white,

    [colorBorder]: tailwind.gray[200],
    [colorBorderLight]: tailwind.gray[100],
    [colorBorderMedium]: tailwind.gray[400],
    [colorBorderInput]: tailwind.neutral[200],

    [colorSuccess]: tailwind.green[600],
    [colorDanger]: tailwind.red[600],
    [colorDangerBg]: tailwind.red[50],
    [colorDangerBgHover]: tailwind.red[100],
    [colorDangerBorder]: tailwind.red[200],
    [colorDangerBorderHover]: tailwind.red[400],
    [colorSuccessBg]: tailwind.green[50],
    [colorSuccessBgHover]: tailwind.green[100],
    [colorSuccessBorder]: tailwind.green[200],
    [colorSuccessBorderHover]: tailwind.green[600],
    [colorNeutralLight]: tailwind.slate[300],
    [colorNeutral]: tailwind.gray[400],

    [colorBgTableHead]: tailwind.slate[200],
    [colorTextTableHead]: tailwind.slate[500],

    [colorBgRowEven]: tailwind.white,
    [colorBgRowAlt]: tailwind.gray[100],
    [colorTextPosition]: tailwind.gray[500],

    [colorBgZonePromotion]: tailwind.green[100],
    [colorBgZonePromotionAlt]: tailwind.green[200],
    [colorTextZonePromotion]: tailwind.green[800],

    [colorBgZonePlayoff]: tailwind.teal[100],
    [colorBgZonePlayoffAlt]: tailwind.teal[200],
    [colorTextZonePlayoff]: tailwind.teal[800],

    [colorBgZoneRelegation]: tailwind.rose[100],
    [colorBgZoneRelegationAlt]: tailwind.rose[200],
    [colorTextZoneRelegation]: tailwind.rose[800],

    [colorBgZoneChampions]: tailwind.green[100],
    [colorBgZoneChampionsAlt]: tailwind.green[200],
    [colorTextZoneChampions]: tailwind.green[800],

    [colorBgZoneChampionsLeague]: tailwind.teal[100],
    [colorBgZoneChampionsLeagueAlt]: tailwind.teal[200],
    [colorTextZoneChampionsLeague]: tailwind.teal[900],

    [colorBgZoneEuropaLeague]: tailwind.cyan[100],
    [colorBgZoneEuropaLeagueAlt]: tailwind.cyan[200],
    [colorTextZoneEuropaLeague]: tailwind.cyan[900],

    [colorBgZoneConferenceLeague]: tailwind.sky[100],
    [colorBgZoneConferenceLeagueAlt]: tailwind.sky[200],
    [colorTextZoneConferenceLeague]: tailwind.sky[800],

    [colorBgModal]: tailwind.white,
    [colorBgBackdrop]: `color-mix(in oklch, ${tailwind.black}, transparent 50%)`,
    [colorBgFixtureCard]: tailwind.white,
    [colorBgFixtureCardHighlight]: tailwind.gray[100],

    [colorTextGdPositive]: tailwind.green[600],
    [colorTextGdNegative]: tailwind.red[600],

    [colorResultWin]: tailwind.green[600],
    [colorResultWinHover]: tailwind.green[700],
    [colorResultWinText]: tailwind.green[100],
    [colorResultWinTextHover]: tailwind.green[200],

    [colorResultDraw]: tailwind.amber[500],
    [colorResultDrawHover]: tailwind.amber[600],
    [colorResultDrawText]: tailwind.amber[100],
    [colorResultDrawTextHover]: tailwind.amber[200],

    [colorResultLoss]: tailwind.red[600],
    [colorResultLossHover]: tailwind.red[700],
    [colorResultLossText]: tailwind.red[100],
    [colorResultLossTextHover]: tailwind.red[200],

    [colorFocus]: tailwind.blue[500],
    [colorFocusRing]: `color-mix(in oklch, ${tailwind.blue[500]}, transparent 80%)`,

    [fontFamily]:
      'Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    [fontFamilyMono]:
      '"Geist Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',

    [fontSizeXs]: '11px',
    [fontSizeSm]: '12px',
    [fontSizeBase]: '14px',
    [fontSizeMd]: '15px',
    [fontSizeLg]: '18px',
    [fontSizeXl]: '22px',
    [fontSizeXxl]: '28px',

    [space1]: '4px',
    [space2]: '8px',
    [space3]: '12px',
    [space4]: '16px',
    [space6]: '24px',
    [space8]: '32px',
    [space12]: '48px',

    [radiusSm]: '3px',
    [radiusMd]: '4px',
    [radiusLg]: '6px',

    [shadowSm]: `0 1px 3px color-mix(in oklch, ${tailwind.black}, transparent 90%)`,
    [shadowMd]: `0 2px 6px color-mix(in oklch, ${tailwind.black}, transparent 90%)`,
    [shadowLg]: `0 1px 3px color-mix(in oklch, ${tailwind.black}, transparent 90%), 0 20px 60px color-mix(in oklch, ${tailwind.black}, transparent 85%)`,

    [maxWidthContent]: '1400px',
  },
});

const darkVars = {
  [colorBgPage]: tailwind.slate[950],
  [colorBgSurface]: tailwind.black,
  [colorBgSurfaceHover]: tailwind.slate[950],

  [colorTextPrimary]: tailwind.slate[200],
  [colorTextHeading]: tailwind.slate[300],
  [colorTextSecondary]: tailwind.slate[500],
  [colorTextMuted]: tailwind.slate[600],
  [colorTextFaint]: tailwind.slate[900],
  [colorTextHover]: tailwind.slate[300],
  [colorTextActive]: tailwind.slate[400],

  [colorBorder]: tailwind.slate[800],
  [colorBorderLight]: tailwind.slate[900],
  [colorBorderMedium]: tailwind.slate[600],
  [colorBorderInput]: tailwind.slate[800],

  [colorSuccess]: tailwind.green[400],
  [colorDanger]: tailwind.red[400],
  [colorDangerBg]: tailwind.red[950],
  [colorDangerBgHover]: tailwind.red[900],
  [colorDangerBorder]: tailwind.red[800],
  [colorDangerBorderHover]: tailwind.red[400],
  [colorSuccessBg]: tailwind.green[950],
  [colorSuccessBgHover]: tailwind.green[900],
  [colorSuccessBorder]: tailwind.green[800],
  [colorSuccessBorderHover]: tailwind.green[400],
  [colorNeutralLight]: tailwind.slate[700],
  [colorNeutral]: tailwind.slate[600],

  [colorBgTableHead]: tailwind.slate[800],
  [colorTextTableHead]: tailwind.slate[500],

  [colorBgRowEven]: tailwind.slate[900],
  [colorBgRowAlt]: tailwind.slate[925],
  [colorTextPosition]: tailwind.slate[400],

  [colorBgZonePromotion]: tailwind.green[925],
  [colorBgZonePromotionAlt]: tailwind.green[950],
  [colorTextZonePromotion]: tailwind.green[200],

  [colorBgZonePlayoff]: tailwind.teal[925],
  [colorBgZonePlayoffAlt]: tailwind.teal[950],
  [colorTextZonePlayoff]: tailwind.teal[200],

  [colorBgZoneRelegation]: tailwind.rose[925],
  [colorBgZoneRelegationAlt]: tailwind.rose[950],
  [colorTextZoneRelegation]: tailwind.rose[200],

  [colorBgZoneChampions]: tailwind.green[925],
  [colorBgZoneChampionsAlt]: tailwind.green[950],
  [colorTextZoneChampions]: tailwind.green[300],

  [colorBgZoneChampionsLeague]: tailwind.teal[925],
  [colorBgZoneChampionsLeagueAlt]: tailwind.teal[950],
  [colorTextZoneChampionsLeague]: tailwind.teal[300],

  [colorBgZoneEuropaLeague]: tailwind.cyan[925],
  [colorBgZoneEuropaLeagueAlt]: tailwind.cyan[950],
  [colorTextZoneEuropaLeague]: tailwind.cyan[300],

  [colorBgZoneConferenceLeague]: tailwind.sky[925],
  [colorBgZoneConferenceLeagueAlt]: tailwind.sky[950],
  [colorTextZoneConferenceLeague]: tailwind.sky[300],

  [colorBgModal]: tailwind.slate[925],
  [colorBgBackdrop]: `color-mix(in oklch, ${tailwind.black}, transparent 40%)`,
  [colorBgFixtureCard]: tailwind.slate[900],
  [colorBgFixtureCardHighlight]: tailwind.slate[800],

  [colorTextGdPositive]: tailwind.green[300],
  [colorTextGdNegative]: tailwind.red[300],

  [colorResultWin]: tailwind.green[500],
  [colorResultWinHover]: tailwind.green[600],
  [colorResultWinText]: tailwind.green[800],
  [colorResultWinTextHover]: tailwind.green[900],

  [colorResultDraw]: tailwind.amber[300],
  [colorResultDrawHover]: tailwind.amber[400],
  [colorResultDrawText]: tailwind.amber[700],
  [colorResultDrawTextHover]: tailwind.amber[800],

  [colorResultLoss]: tailwind.rose[400],
  [colorResultLossHover]: tailwind.rose[500],
  [colorResultLossText]: tailwind.rose[800],
  [colorResultLossTextHover]: tailwind.rose[900],

  [colorFocusRing]: `color-mix(in oklch, ${tailwind.blue[500]}, transparent 70%)`,

  [shadowSm]: `0 1px 3px color-mix(in oklch, ${tailwind.black}, transparent 70%)`,
  [shadowMd]: `0 2px 6px color-mix(in oklch, ${tailwind.black}, transparent 70%)`,
  [shadowLg]: `0 1px 3px color-mix(in oklch, ${tailwind.black}, transparent 70%), 0 20px 60px color-mix(in oklch, ${tailwind.black}, transparent 30%)`,
};

globalStyle(':root:not([data-theme="light"])', {
  '@media': {
    '(prefers-color-scheme: dark)': {
      vars: darkVars,
    },
  },
});

globalStyle(':root[data-theme="dark"]', {
  vars: darkVars,
});
