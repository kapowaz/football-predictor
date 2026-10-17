import { createVar, style } from '@vanilla-extract/css';
import {
  cssVariablesByColorMode,
  getDesignTokens,
} from '@kapowaz/design-tokens';

const { colors, spacing } = getDesignTokens();

const colorTextSecondary = createVar('deductions-modal-text-secondary');

cssVariablesByColorMode({
  light: {
    [colorTextSecondary]: colors.gray[500],
  },
  dark: {
    [colorTextSecondary]: colors.ink[500],
  },
});

export const modalBody = style({
  display: 'flex',
  flexDirection: 'column',
});

export const genuineRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBottom: spacing.lg,
  cursor: 'pointer',
});

export const sectionLabel = style({
  color: colorTextSecondary,
  marginBottom: spacing.md,
});

export const deductionList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
});

export const emptyState = style({
  color: colorTextSecondary,
  fontStyle: 'italic',
  padding: `${spacing.md} 0`,
});
