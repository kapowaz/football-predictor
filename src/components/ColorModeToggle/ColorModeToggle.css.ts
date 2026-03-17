import { style } from '@vanilla-extract/css';
import {
  colorTextSecondary,
  colorTextHeading,
  radiusMd,
} from '../../theme.css';

export const toggleButton = style({
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
});
