import { createVar, style } from '@vanilla-extract/css';
import {
  cssVariablesByColorMode,
  getDesignTokens,
} from '@kapowaz/design-tokens';

const { colors, spacing } = getDesignTokens();

const colorTextSecondary = createVar('add-deduction-form-text-secondary');

cssVariablesByColorMode({
  light: {
    [colorTextSecondary]: colors.gray[500],
  },
  dark: {
    [colorTextSecondary]: colors.ink[500],
  },
});

export const sectionLabel = style({
  color: colorTextSecondary,
  marginBottom: spacing.md,
});

export const addFormRow = style({
  display: 'flex',
  gap: spacing.md,
  alignItems: 'center',
});

export const teamSelectWrapper = style({
  flex: 1,
  minWidth: 0,
});

export const amountInput = style({
  width: '36px',
});
