import { style, createContainer, createVar, fallbackVar } from '@vanilla-extract/css';
import { cssVariablesByColorMode, getDesignTokens } from '@kapowaz/design-tokens';

const { colors, spacing, borderRadius, shadow, typography } = getDesignTokens();

// --- Local CSS variables (color-mode-dependent) ---

const colorBgSurface = createVar('all-time-rank-bg-surface');
const colorBgRowEven = createVar('all-time-rank-bg-row-even');
const colorBgRowAlt = createVar('all-time-rank-bg-row-alt');
const colorBgTableHead = createVar('all-time-rank-bg-table-head');
const colorTextTableHead = createVar('all-time-rank-text-table-head');
const colorTextPrimary = createVar('all-time-rank-text-primary');
const colorTextPosition = createVar('all-time-rank-text-position');
const colorTextSecondary = createVar('all-time-rank-text-secondary');
const colorTextMuted = createVar('all-time-rank-text-muted');
const colorTextStatFaded = createVar('all-time-rank-text-stat-faded');
const colorTextStatStrong = createVar('all-time-rank-text-stat-strong');

const colorBgZoneChampions = createVar('all-time-rank-bg-zone-champions');
const colorBgZoneChampionsAlt = createVar('all-time-rank-bg-zone-champions-alt');
const colorBgZoneChampionsLeague = createVar('all-time-rank-bg-zone-cl');
const colorBgZoneChampionsLeagueAlt = createVar('all-time-rank-bg-zone-cl-alt');
const colorBgZoneEuropaLeague = createVar('all-time-rank-bg-zone-el');
const colorBgZoneEuropaLeagueAlt = createVar('all-time-rank-bg-zone-el-alt');
const colorBgZoneConferenceLeague = createVar('all-time-rank-bg-zone-ecl');
const colorBgZoneConferenceLeagueAlt = createVar('all-time-rank-bg-zone-ecl-alt');

const colorTextZoneChampions = createVar('all-time-rank-text-zone-champions');
const colorTextZoneChampionsAlt = createVar('all-time-rank-text-zone-champions-alt');
const colorTextZoneChampionsTertiary = createVar('all-time-rank-text-zone-champions-tertiary');
const colorTextZoneChampionsLeague = createVar('all-time-rank-text-zone-cl');
const colorTextZoneChampionsLeagueAlt = createVar('all-time-rank-text-zone-cl-alt');
const colorTextZoneChampionsLeagueTertiary = createVar('all-time-rank-text-zone-cl-tertiary');
const colorTextZoneEuropaLeague = createVar('all-time-rank-text-zone-el');
const colorTextZoneEuropaLeagueAlt = createVar('all-time-rank-text-zone-el-alt');
const colorTextZoneEuropaLeagueTertiary = createVar('all-time-rank-text-zone-el-tertiary');
const colorTextZoneConferenceLeague = createVar('all-time-rank-text-zone-ecl');
const colorTextZoneConferenceLeagueAlt = createVar('all-time-rank-text-zone-ecl-alt');
const colorTextZoneConferenceLeagueTertiary = createVar('all-time-rank-text-zone-ecl-tertiary');

export const colorPremierLeagueFg = createVar('all-time-rank-pl-fg');
export const colorPremierLeagueBg = createVar('all-time-rank-pl-bg');

cssVariablesByColorMode({
  light: {
    [colorBgSurface]: colors.white,
    [colorBgRowEven]: colors.white,
    [colorBgRowAlt]: colors.gray[100],
    [colorBgTableHead]: colors.slate[200],
    [colorTextTableHead]: colors.slate[500],
    [colorTextPrimary]: colors.gray[800],
    [colorTextPosition]: colors.gray[500],
    [colorTextSecondary]: colors.gray[500],
    [colorTextMuted]: colors.neutral[500],
    [colorTextStatFaded]: colors.gray[300],
    [colorTextStatStrong]: colors.black,

    [colorBgZoneChampions]: colors.green[100],
    [colorBgZoneChampionsAlt]: colors.green[200],
    [colorBgZoneChampionsLeague]: colors.teal[100],
    [colorBgZoneChampionsLeagueAlt]: colors.teal[200],
    [colorBgZoneEuropaLeague]: colors.cyan[100],
    [colorBgZoneEuropaLeagueAlt]: colors.cyan[200],
    [colorBgZoneConferenceLeague]: colors.sky[100],
    [colorBgZoneConferenceLeagueAlt]: colors.sky[200],

    [colorTextZoneChampions]: colors.green[800],
    [colorTextZoneChampionsAlt]: colors.green[700],
    [colorTextZoneChampionsTertiary]: colors.green[500],
    [colorTextZoneChampionsLeague]: colors.teal[900],
    [colorTextZoneChampionsLeagueAlt]: colors.teal[700],
    [colorTextZoneChampionsLeagueTertiary]: colors.teal[500],
    [colorTextZoneEuropaLeague]: colors.cyan[900],
    [colorTextZoneEuropaLeagueAlt]: colors.cyan[700],
    [colorTextZoneEuropaLeagueTertiary]: colors.cyan[500],
    [colorTextZoneConferenceLeague]: colors.sky[800],
    [colorTextZoneConferenceLeagueAlt]: colors.sky[600],
    [colorTextZoneConferenceLeagueTertiary]: colors.sky[400],

    [colorPremierLeagueFg]: colors.slate[500],
    [colorPremierLeagueBg]: colors.slate[200],
  },
  dark: {
    [colorBgSurface]: colors.black,
    [colorBgRowEven]: colors.slate[900],
    [colorBgRowAlt]: colors.slate[925],
    [colorBgTableHead]: colors.slate[800],
    [colorTextTableHead]: colors.slate[500],
    [colorTextPrimary]: colors.slate[200],
    [colorTextPosition]: colors.slate[400],
    [colorTextSecondary]: colors.slate[500],
    [colorTextMuted]: colors.slate[600],
    [colorTextStatFaded]: colors.slate[700],
    [colorTextStatStrong]: colors.white,

    [colorBgZoneChampions]: colors.green[925],
    [colorBgZoneChampionsAlt]: colors.green[950],
    [colorBgZoneChampionsLeague]: colors.teal[925],
    [colorBgZoneChampionsLeagueAlt]: colors.teal[950],
    [colorBgZoneEuropaLeague]: colors.cyan[925],
    [colorBgZoneEuropaLeagueAlt]: colors.cyan[950],
    [colorBgZoneConferenceLeague]: colors.sky[925],
    [colorBgZoneConferenceLeagueAlt]: colors.sky[950],

    [colorTextZoneChampions]: colors.green[300],
    [colorTextZoneChampionsAlt]: colors.green[400],
    [colorTextZoneChampionsTertiary]: colors.green[600],
    [colorTextZoneChampionsLeague]: colors.teal[300],
    [colorTextZoneChampionsLeagueAlt]: colors.teal[500],
    [colorTextZoneChampionsLeagueTertiary]: colors.teal[700],
    [colorTextZoneEuropaLeague]: colors.cyan[300],
    [colorTextZoneEuropaLeagueAlt]: colors.cyan[500],
    [colorTextZoneEuropaLeagueTertiary]: colors.cyan[700],
    [colorTextZoneConferenceLeague]: colors.sky[300],
    [colorTextZoneConferenceLeagueAlt]: colors.sky[500],
    [colorTextZoneConferenceLeagueTertiary]: colors.sky[700],

    [colorPremierLeagueFg]: colors.slate[800],
    [colorPremierLeagueBg]: colors.slate[500],
  },
});

// --- Exported vars for inline-var usage in TSX ---

export const honourRecency = createVar();
export const zoneTextAlt = createVar();
export const zoneTextTertiary = createVar();

export const tableContainer = createContainer();

export const container = style({
  containerName: tableContainer,
  containerType: 'inline-size',
  isolation: 'isolate',
  backgroundColor: colorBgSurface,
  borderRadius: borderRadius.lg,
  boxShadow: shadow.md,
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
  maxWidth: '1400px',
  borderCollapse: 'separate',
  borderSpacing: 0,
  lineHeight: '24px',
  borderRadius: borderRadius.lg,
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
  padding: `${spacing.sm} ${spacing.xs}`,
  textAlign: 'left',
  color: colorTextTableHead,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontVariantNumeric: 'tabular-nums',
  position: 'sticky',
  top: 0,
  zIndex: 2,
  backgroundColor: colorBgTableHead,
  '@container': {
    [`${tableContainer} (min-width: 480px)`]: {
      padding: spacing.sm,
    },
    [`${tableContainer} (min-width: 680px)`]: {
      padding: `${spacing.md} ${spacing.sm}`,
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
  padding: `${spacing.md} ${spacing.sm}`,
  color: colorTextPrimary,
  fontFamily: typography.fontFamily.monospace,
  fontVariantNumeric: 'tabular-nums',
  '@container': {
    [`${tableContainer} (max-width: 480px)`]: {
      padding: `${spacing.sm} ${spacing.xs}`,
    },
    [`${tableContainer} (max-width: 680px)`]: {
      padding: spacing.sm,
    },
  },
});

export const tdCenter = style({
  textAlign: 'center',
  whiteSpace: 'nowrap',
  fontFamily: typography.fontFamily.monospace,
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
  paddingLeft: spacing.md,
  WebkitMaskImage: 'unset',
  maskImage: 'unset',
});

export const position = style({
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
  gap: spacing.sm,
  paddingRight: spacing.lg,
  minWidth: '180px',
  '@container': {
    [`${tableContainer} (max-width: 480px)`]: {
      minWidth: '140px',
    },
  },
});

export const badge = style({
  width: '20px',
  height: '20px',
  flexShrink: 0,
  objectFit: 'contain',
});

export const teamName = style({
  fontFamily: typography.fontFamily.monospace,
  fontWeight: 600,
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const scoreValue = style({
  fontVariantNumeric: 'tabular-nums',
});

export const statValue = style({
  fontVariantNumeric: 'tabular-nums',
  color: `color-mix(in lch, ${colorTextStatStrong} ${fallbackVar(honourRecency, '100%')}, ${fallbackVar(zoneTextTertiary, colorTextStatFaded)})`,
});

export const statZero = style({
  color: fallbackVar(zoneTextTertiary, colorTextMuted),
});

export const leagueScore = style({
  fontVariantNumeric: 'tabular-nums',
  color: fallbackVar(zoneTextAlt, colorTextSecondary),
});

export const attendanceValue = style({
  fontVariantNumeric: 'tabular-nums',
});

export const popoverContent = style({
  padding: spacing.sm,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.sm,
});

export const popoverLabel = style({});

export const popoverYears = style({
  maxWidth: '240px',
  fontSize: '11px',
  fontVariantNumeric: 'tabular-nums',
});

export const scoreBreakdownTable = style({
  borderCollapse: 'collapse',
  borderSpacing: 0,
  fontVariantNumeric: 'tabular-nums',
});

export const scoreBreakdownLabel = style({
  paddingRight: spacing.md,
});

export const scoreBreakdownValue = style({
  textAlign: 'right',
});
