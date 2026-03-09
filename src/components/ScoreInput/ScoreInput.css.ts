import { style } from '@vanilla-extract/css';
import {
  colorBgSurface,
  colorBorderInput,
  colorFocus,
  colorFocusRing,
  colorTextMuted,
  colorTextPrimary,
  fontFamilyMono,
} from '../../theme.css';

export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const input = style({
  width: '32px',
  height: '32px',
  textAlign: 'center',
  fontFamily: fontFamilyMono,
  fontSize: '14px',
  fontWeight: 600,
  color: colorTextPrimary,
  border: `2px solid ${colorBorderInput}`,
  borderRadius: '6px',
  backgroundColor: colorBgSurface,
  transition: 'border-color 0.2s, box-shadow 0.2s',
  ':focus': {
    outline: 'none',
    borderColor: colorFocus,
    boxShadow: `0 0 0 3px ${colorFocusRing}`,
  },
  '::-webkit-inner-spin-button': {
    appearance: 'none',
  },
  '::-webkit-outer-spin-button': {
    appearance: 'none',
  },
});

export const separator = style({
  fontSize: '12px',
  fontWeight: 600,
  color: colorTextMuted,
});
