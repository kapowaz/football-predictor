import { style } from '@vanilla-extract/css';
import { space2 } from '../../theme.css';

export const optionContent = style({
  display: 'flex',
  alignItems: 'center',
  gap: space2,
});

export const optionLogo = style({
  width: '20px',
  height: '20px',
  objectFit: 'contain',
  flexShrink: 0,
});
