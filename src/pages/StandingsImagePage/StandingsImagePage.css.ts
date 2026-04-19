import { style } from '@vanilla-extract/css';
import { getDesignTokens } from '@kapowaz/design-tokens';

const { spacing } = getDesignTokens();

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  overflow: 'auto',
  paddingBottom: spacing.lg,
});

export const toolbar = style({
  width: 'calc(820px - 2 * 16px)',
  display: 'flex',
  justifyContent: 'flex-end',
});
