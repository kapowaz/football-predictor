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

// Takes the width of the images, so the toolbar can stretch to match them.
export const content = style({
  display: 'flex',
  flexDirection: 'column',
});

// Inset by the images' padding, so its edges line up with the table's.
export const toolbar = style({
  display: 'flex',
  justifyContent: 'flex-end',
  marginInline: spacing.lg,
});
