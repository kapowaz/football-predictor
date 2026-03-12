import { style } from '@vanilla-extract/css';
import { colorTextHeading, fontSizeXxl, fontSizeXl, fontSizeLg, space2 } from '../../theme.css';

export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: space2,
});

export const logo = style({
  height: '36px',
  width: 'auto',
});

export const title = style({
  fontSize: fontSizeXxl,
  fontWeight: 700,
  color: colorTextHeading,
  margin: 0,
  whiteSpace: 'nowrap',
  '@media': {
    'screen and (max-width: 680px)': {
      fontSize: fontSizeXl,
    },
    'screen and (max-width: 480px)': {
      fontSize: fontSizeLg,
    },
  },
});

export const titleFullRender = style({
  fontSize: fontSizeXxl,
  fontWeight: 700,
  color: colorTextHeading,
  margin: 0,
  whiteSpace: 'nowrap',
});

export const titlePrefix = style({
  '@media': {
    'screen and (max-width: 580px)': {
      display: 'none',
    },
  },
});

export const extraContent = style({
  flex: 1,
});
