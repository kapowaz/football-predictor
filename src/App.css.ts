import { style, globalStyle } from '@vanilla-extract/css';
import {
  colorBgPage,
  colorTextPrimary,
  colorTextHeading,
  colorTextSecondary,
  colorDanger,
  colorDangerBg,
  colorDangerBgHover,
  colorDangerBorder,
  fontFamily,
  fontSizeXl,
  fontSizeLg,
  fontSizeSm,
  space2,
  space3,
  space4,
  space6,
  space8,
  radiusSm,
  maxWidthContent,
} from './theme.css';

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
});

globalStyle('body', {
  margin: 0,
  fontFamily: fontFamily,
  backgroundColor: colorBgPage,
  color: colorTextPrimary,
  lineHeight: 1.5,
});

export const app = style({
  minHeight: '100vh',
  padding: space6,
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: space3,
  maxWidth: maxWidthContent,
  margin: `0 auto ${space8}`,
});

export const logo = style({
  height: '36px',
  width: 'auto',
});

export const title = style({
  fontSize: fontSizeXl,
  fontWeight: 700,
  color: colorTextHeading,
  margin: 0,
});

export const main = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: space8,
  maxWidth: maxWidthContent,
  margin: '0 auto',
  '@media': {
    'screen and (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space4,
});

export const panelHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const panelHeaderWithNotes = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
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

export const panelTitle = style({
  fontSize: fontSizeLg,
  fontWeight: 600,
  color: colorTextHeading,
  margin: 0,
});

export const resetButton = style({
  padding: `${space2} ${space4}`,
  fontFamily: fontFamily,
  fontSize: fontSizeSm,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '-0.02em',
  color: colorDanger,
  backgroundColor: colorDangerBg,
  border: `1px solid ${colorDangerBorder}`,
  borderRadius: radiusSm,
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: colorDangerBgHover,
  },
});
