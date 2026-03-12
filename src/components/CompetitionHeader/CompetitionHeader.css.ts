import { style } from '@vanilla-extract/css';
import {
  space2,
  space4,
  space6,
  maxWidthContent,
} from '../../theme.css';

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: space2,
  width: '100%',
  maxWidth: maxWidthContent,
  margin: `0 auto ${space6}`,
  '@media': {
    'screen and (max-width: 680px)': {
      padding: `${space6} ${space4} 0`,
    },
  },
});

export const controls = style({
  display: 'flex',
  alignItems: 'center',
  marginLeft: 'auto',
});

export const competitionSelectWrapper = style({
  minWidth: '220px',
});
