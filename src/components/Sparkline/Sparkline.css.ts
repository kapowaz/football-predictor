import { style } from '@vanilla-extract/css';
import {
  colorBgSurface,
  colorTextPrimary,
  fontSizeXs,
  radiusMd,
  shadowMd,
  space1,
  space2,
} from '../../theme.css';

export const container = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  lineHeight: 0,
  height: '100%',
});

export const tooltip = style({
  backgroundColor: colorBgSurface,
  color: colorTextPrimary,
  fontSize: fontSizeXs,
  fontWeight: 600,
  padding: `${space1} ${space2}`,
  borderRadius: radiusMd,
  boxShadow: shadowMd,
  whiteSpace: 'nowrap',
  lineHeight: 1,
});
