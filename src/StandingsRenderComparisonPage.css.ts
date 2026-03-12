import { style } from '@vanilla-extract/css';
import {
  colorBgSurface,
  colorBorder,
  colorTextHeading,
  colorTextPrimary,
  colorTextSecondary,
  colorDanger,
  colorBgPage,
  radiusLg,
  shadowMd,
  space2,
  space3,
  space4,
  space6,
  maxWidthContent,
} from './theme.css';

const tableTargetWidth = '688px';
const viewportTargetWidth = `calc(${tableTargetWidth} + (${space4} * 2) + 2px)`;

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space4,
  width: '100%',
  maxWidth: maxWidthContent,
  margin: '0 auto',
  minHeight: 0,
  padding: `0 ${space2} ${space4}`,
  '@media': {
    'screen and (min-width: 680px)': {
      padding: 0,
    },
  },
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space2,
});

export const headerTopRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space3,
});

export const title = style({
  margin: 0,
  color: colorTextHeading,
  fontSize: '20px',
  fontWeight: 700,
  marginRight: 'auto',
});

export const subtitle = style({
  margin: 0,
  color: colorTextSecondary,
  fontSize: '13px',
});

export const statusRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `${space2} ${space3}`,
  fontSize: '12px',
});

export const statusOk = style({
  color: colorTextPrimary,
});

export const statusError = style({
  color: colorDanger,
});

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space4,
  width: '100%',
  maxWidth: viewportTargetWidth,
  minHeight: 0,
});

export const viewport = style({
  backgroundColor: colorBgSurface,
  border: `1px solid ${colorBorder}`,
  borderRadius: radiusLg,
  boxShadow: shadowMd,
  padding: space4,
  width: '100%',
  maxWidth: viewportTargetWidth,
  minHeight: 0,
  overflow: 'auto',
  '@media': {
    'screen and (max-width: 680px)': {
      borderRadius: 0,
      boxShadow: 'none',
      border: 'none',
      padding: 0,
      backgroundColor: colorBgPage,
    },
  },
});

export const captureSurface = style({
  width: '100%',
  maxWidth: tableTargetWidth,
  minWidth: 0,
});

export const hiddenCaptureRoot = style({
  position: 'fixed',
  left: '-10000px',
  top: 0,
  width: tableTargetWidth,
  pointerEvents: 'none',
  zIndex: -1,
});

export const previewImage = style({
  width: '100%',
  maxWidth: '100%',
  height: 'auto',
  display: 'block',
});

export const placeholder = style({
  color: colorTextSecondary,
  fontSize: '13px',
  margin: `${space6} 0`,
});
