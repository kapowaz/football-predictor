import { createVar, style } from '@vanilla-extract/css';
import {
  cssVariablesByColorMode,
  getDesignTokens,
} from '@kapowaz/design-tokens';

const { colors, spacing, borderRadius } = getDesignTokens();

const colorBgOverlayPanel = createVar('navbar-bg-overlay-panel');
const colorBgSurfaceHover = createVar('navbar-bg-surface-hover');
const colorFocus = createVar('navbar-focus');
const colorTextHeading = createVar('navbar-text-heading');
const colorTextSecondary = createVar('navbar-text-secondary');

cssVariablesByColorMode({
  light: {
    [colorBgOverlayPanel]: `color-mix(in oklch, ${colors.gray[50]}, transparent 30%)`,
    [colorBgSurfaceHover]: colors.gray[50],
    [colorFocus]: colors.blue[500],
    [colorTextHeading]: colors.gray[900],
    [colorTextSecondary]: colors.gray[500],
  },
  dark: {
    [colorBgOverlayPanel]: `color-mix(in oklch, ${colors.ink[950]}, transparent 30%)`,
    [colorBgSurfaceHover]: colors.ink[950],
    [colorFocus]: colors.blue[500],
    [colorTextHeading]: colors.ink[300],
    [colorTextSecondary]: colors.ink[500],
  },
});

const desktopBreakpoint = 'screen and (min-width: 1025px)';

export const navBarWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '1400px',
  margin: `0 auto ${spacing.xxl}`,
  '@media': {
    'screen and (max-width: 680px)': {
      padding: `${spacing.xxl} ${spacing.lg} 0`,
    },
  },
});

export const navBar = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: spacing.sm,
});

export const navBarHeader = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  gap: spacing.sm,
});

export const desktopTabBar = style({
  display: 'none',
  '@media': {
    [desktopBreakpoint]: {
      display: 'flex',
    },
  },
});

export const controls = style({
  display: 'flex',
  alignItems: 'center',
  marginLeft: 'auto',
  gap: spacing.sm,
});

export const competitionSelectWrapper = style({
  minWidth: '220px',
  '@media': {
    'screen and (max-width: 480px)': {
      display: 'none',
    },
  },
});

export const menuButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  color: colorTextSecondary,
  cursor: 'pointer',
  padding: '3px',
  lineHeight: 1,
  borderRadius: borderRadius.md,
  flexShrink: 0,
  width: '24px',
  height: '24px',
  transition: 'color 0.2s',
  ':hover': {
    color: colorTextHeading,
  },
  '@media': {
    [desktopBreakpoint]: {
      display: 'none',
    },
  },
});

export const desktopColorModeToggle = style({
  display: 'none',
  '@media': {
    [desktopBreakpoint]: {
      display: 'flex',
    },
  },
});

export const desktopActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: spacing.sm,
});

export const overlayBackdrop = style({
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.4)',
  zIndex: 200,
});

export const overlayPanel = style({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  width: '100vw',
  maxWidth: '480px',
  background: colorBgOverlayPanel,
  backdropFilter: 'blur(12px)',
  zIndex: 201,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
});

export const overlayHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: spacing.sm,
  padding: `${spacing.md} ${spacing.lg}`,
});

export const overlayCloseButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  color: colorTextSecondary,
  cursor: 'pointer',
  padding: '3px',
  lineHeight: 1,
  borderRadius: borderRadius.md,
  width: '24px',
  height: '24px',
  transition: 'color 0.2s',
  ':hover': {
    color: colorTextHeading,
  },
});

export const overlayNavItems = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
});

export const overlayNavItem = style({
  display: 'block',
  padding: `${spacing.md} ${spacing.lg}`,
  color: colorTextSecondary,
  textDecoration: 'none',
  transition: 'background 0.15s, color 0.15s',
  ':hover': {
    background: colorBgSurfaceHover,
    color: colorTextHeading,
  },
});

export const overlayNavItemActive = style({
  color: colorFocus,
});

export const overlayActions = style({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.sm,
  padding: `${spacing.md} ${spacing.lg}`,
  marginTop: 'auto',
});

export const overlayCompetitionSelect = style({
  display: 'none',
  padding: `0 ${spacing.lg} ${spacing.lg}`,
  '@media': {
    'screen and (max-width: 480px)': {
      display: 'block',
    },
  },
});
