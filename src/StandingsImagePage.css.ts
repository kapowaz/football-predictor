import { style } from '@vanilla-extract/css';
import { space2, space4 } from './theme.css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: space2,
  width: '100%',
  overflow: 'auto',
  paddingBottom: space4,
});

export const toolbar = style({
  width: 'calc(820px - 2 * 16px)',
  display: 'flex',
  justifyContent: 'flex-end',
});
