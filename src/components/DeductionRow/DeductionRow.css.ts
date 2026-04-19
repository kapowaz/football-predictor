import { createVar, style } from '@vanilla-extract/css';
import {
  cssVariablesByColorMode,
  getDesignTokens,
} from '@kapowaz/design-tokens';

const { colors, spacing, borderRadius } = getDesignTokens();

const colorBgSurfaceHover = createVar('deduction-row-bg-surface-hover');
const colorTextPrimary = createVar('deduction-row-text-primary');
const colorTextSecondary = createVar('deduction-row-text-secondary');
const colorDanger = createVar('deduction-row-danger');

cssVariablesByColorMode({
  light: {
    [colorBgSurfaceHover]: colors.gray[200],
    [colorTextPrimary]: colors.gray[800],
    [colorTextSecondary]: colors.gray[500],
    [colorDanger]: colors.red[600],
  },
  dark: {
    [colorBgSurfaceHover]: colors.ink[800],
    [colorTextPrimary]: colors.ink[200],
    [colorTextSecondary]: colors.ink[500],
    [colorDanger]: colors.red[400],
  },
});

export const deductionRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.sm,
  padding: spacing.md,
  backgroundColor: colorBgSurfaceHover,
  borderRadius: borderRadius.md,
});

export const deductionRowTop = style({
  display: 'flex',
  alignItems: 'center',
  gap: spacing.md,
});

export const deductionActions = style({
  gap: spacing.sm,
  display: 'flex',
  alignItems: 'center',
});

export const badge = style({
  width: '24px',
  height: '24px',
  objectFit: 'contain',
  flexShrink: 0,
});

export const teamName = style({
  color: colorTextPrimary,
  flex: 1,
  minWidth: 0,
});

export const amountInput = style({
  width: '36px',
  textAlign: 'center',
  fontVariantNumeric: 'tabular-nums',
  color: colorDanger,
});

export const deductionReasonText = style({
  color: colorTextSecondary,
  lineHeight: 1.4,
});
