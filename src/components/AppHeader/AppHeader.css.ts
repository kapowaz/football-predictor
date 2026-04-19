import { style } from '@vanilla-extract/css';
import { getDesignTokens } from '@kapowaz/design-tokens';

const { spacing } = getDesignTokens();

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: spacing.sm,
  width: '100%',
  maxWidth: '1400px',
  margin: `0 auto ${spacing.lg}`,
  '@media': {
    'screen and (max-width: 680px)': {
      padding: `${spacing.lg} ${spacing.md} 0`,
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
