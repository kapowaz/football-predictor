import { style } from '@vanilla-extract/css';
import {
  colorTextSecondary,
  colorTextHeading,
  space2,
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
  padding: space2,
  lineHeight: 1,
  borderRadius: radiusMd,
  flexShrink: 0,
  transition: 'color 0.2s',
  ':hover': {
    color: colorTextHeading,
  },
});
