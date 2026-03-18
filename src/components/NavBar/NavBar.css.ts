import { style } from '@vanilla-extract/css';
import {
  colorBgOverlayPanel,
  colorBgSurfaceHover,
  colorFocus,
  colorTextHeading,
  colorTextSecondary,
  fontFamily,
  fontSizeMd,
  fontSizeLg,
  maxWidthContent,
  radiusMd,
  space2,
  space3,
  space4,
  space6,
} from '../../theme.css';

const desktopBreakpoint = 'screen and (min-width: 1025px)';

export const navBar = style({
  display: 'flex',
  alignItems: 'stretch',
  gap: space2,
  width: '100%',
  maxWidth: maxWidthContent,
  margin: `0 auto ${space6}`,
  '@media': {
    'screen and (max-width: 680px)': {
      padding: `${space6} ${space4} 0`,
    },
  },
});

export const navTabs = style({
  display: 'none',
  '@media': {
    [desktopBreakpoint]: {
      display: 'flex',
      flex: 1,
      alignSelf: 'stretch',
    },
  },
});

export const navTab = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: `${space2} ${space3}`,
  fontFamily: fontFamily,
  fontSize: fontSizeMd,
  fontWeight: 600,
  color: colorTextSecondary,
  textDecoration: 'none',
  borderBottom: '2px solid transparent',
  marginBottom: '-2px',
  transition: 'color 0.2s, border-color 0.2s',
  whiteSpace: 'nowrap',
  ':hover': {
    color: colorTextHeading,
  },
});

export const navTabActive = style({
  color: colorTextHeading,
  borderBottomColor: colorFocus,
});

export const controls = style({
  display: 'flex',
  alignItems: 'center',
  marginLeft: 'auto',
  gap: space2,
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
  borderRadius: radiusMd,
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

const compactActionsBreakpoint = 'screen and (min-width: 1025px) and (max-width: 1220px)';

export const desktopActions = style({
  display: 'none',
  '@media': {
    [desktopBreakpoint]: {
      display: 'flex',
      alignItems: 'center',
      gap: space2,
      marginLeft: 'auto',
    },
  },
});

export const desktopActionLabel = style({
  '@media': {
    [compactActionsBreakpoint]: {
      display: 'none',
    },
  },
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
  gap: space2,
  padding: `${space3} ${space4}`,
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
  borderRadius: radiusMd,
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
  padding: `${space3} ${space4}`,
  fontFamily: fontFamily,
  fontSize: fontSizeLg,
  fontWeight: 600,
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
  gap: space2,
  padding: `${space3} ${space4}`,
  marginTop: 'auto',
});

export const overlayCompetitionSelect = style({
  display: 'none',
  padding: `0 ${space4} ${space4}`,
  '@media': {
    'screen and (max-width: 480px)': {
      display: 'block',
    },
  },
});
