import { keyframes, style } from '@vanilla-extract/css';
import {
  colorBgSurface,
  colorBorderInput,
  colorDanger,
  colorFocus,
  colorFocusRing,
  colorTextMuted,
  colorTextPrimary,
  fontFamily,
} from '../../theme.css';

export const container = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '112px',
});

export const liveScoreContainer = style({});

export const input = style({
  width: '32px',
  height: '32px',
  textAlign: 'center',
  fontFamily: fontFamily,
  fontSize: '14px',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
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
});

export const liveScoreInput = style({
  borderColor: colorDanger,
  borderStyle: 'dashed',
});

export const separator = style({
  flex: 1,
  textAlign: 'center',
  fontSize: '12px',
  fontWeight: 600,
  color: colorTextMuted,
});

const pulse = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.4 },
});

export const liveIndicator = style({
  display: 'block',
  fontSize: '8px',
  fontWeight: 700,
  letterSpacing: '0.5px',
  lineHeight: 1,
  color: colorDanger,
  marginBottom: '2px',
  animation: `${pulse} 2s ease-in-out infinite`,
});
