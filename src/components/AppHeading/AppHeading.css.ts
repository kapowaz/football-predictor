import { style } from '@vanilla-extract/css';
import {
  colorTextHeading,
  fontFamilyDisplay,
  fontSize3xl,
  fontSizeXl,
  space2,
} from '../../theme.css';

export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: space2,
});

export const logo = style({
  height: '32px',
  width: '32px',
});

export const title = style({
  fontFamily: fontFamilyDisplay,
  fontStretch: '75%',
  fontSize: fontSizeXl,
  fontWeight: 700,
  textTransform: 'uppercase',
  color: colorTextHeading,
  margin: 0,
  whiteSpace: 'nowrap',
});

export const titleFullRender = style({
  fontFamily: fontFamilyDisplay,
  fontStretch: '75%',
  fontSize: fontSize3xl,
  fontWeight: 700,
  textTransform: 'uppercase',
  color: colorTextHeading,
  margin: 0,
  whiteSpace: 'nowrap',
});

export const extraContent = style({
  flex: 1,
});
