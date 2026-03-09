import { style } from '@vanilla-extract/css';
import {
  colorTextHeading,
  fontSizeXxl,
  fontSizeXl,
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

export const logo = style({
  height: '36px',
  width: 'auto',
  filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.4))',
  transform: 'rotate(-10deg)',
});

export const title = style({
  fontSize: fontSizeXxl,
  fontWeight: 700,
  color: colorTextHeading,
  margin: 0,
  '@media': {
    'screen and (max-width: 680px)': {
      fontSize: fontSizeXl,
    },
  },
});

export const competitionSelectWrapper = style({
  marginLeft: 'auto',
  minWidth: '220px',
});
