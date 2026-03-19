import { style } from '@vanilla-extract/css';
import {
  colorBgPopover,
  colorTextPopover,
  fontFamily,
  fontSizeSm,
  radiusMd,
  shadowMd,
  space1,
} from '../../theme.css';

export const arrow = style({
  fill: colorBgPopover,
});

export const shadow = style({
  filter: `drop-shadow(${shadowMd})`,
});

export const container = style({
  backgroundColor: colorBgPopover,
  borderRadius: `calc(${radiusMd} + ${space1})`,
  padding: space1,
  color: colorTextPopover,
  fontFamily,
  fontSize: fontSizeSm,
});
