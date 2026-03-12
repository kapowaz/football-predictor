import { style } from '@vanilla-extract/css';
import {
  colorBgPage,
  colorTextHeading,
  colorTextSecondary,
  fontSizeLg,
  fontSizeMd,
  fontSizeSm,
  space2,
  space3,
  space4,
} from '../../theme.css';

export const hiddenCaptureRoot = style({
  position: 'fixed',
  left: '-10000px',
  top: 0,
  pointerEvents: 'none',
  zIndex: -1,
});

export const outerWrapper = style({
  width: '820px',
});

export const captureSurface = style({
  width: '100%',
  minWidth: 0,
});

export const innerWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space4,
  padding: space4,
  backgroundColor: colorBgPage,
});

export const innerWrapperTop = style({
  paddingBottom: 0,
});

export const innerWrapperBottom = style({
  paddingTop: 0,
});

export const headingExtraContent = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'center',
});

export const competitionLabel = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space2,
  fontSize: fontSizeLg,
  fontWeight: 600,
  color: colorTextHeading,
});

export const competitionLogo = style({
  width: '24px',
  height: '24px',
  objectFit: 'contain',
  flexShrink: 0,
});

export const deductionNotes = style({
  display: 'flex',
  gap: space3,
  fontSize: fontSizeSm,
  color: colorTextSecondary,
});

export const deductionNote = style({
  cursor: 'help',
});

export const footerContainer = style({
  display: 'flex',
  alignItems: 'flex-start',
  height: 'calc(45px + 48px)',
});

export const footer = style({
  display: 'flex',
  alignItems: 'center',
  gap: space2,
  color: colorTextSecondary,
  fontSize: fontSizeMd,
});

export const footerIcon = style({
  flexShrink: 0,
});

export const footerBold = style({
  fontWeight: 500,
});
